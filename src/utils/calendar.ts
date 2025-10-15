import { TOperation, TPortfolioPositionFull } from "api/features/accounts/accountsTypes";
import { TCalendarEvent } from "api/features/calendar/calendarType";
import moment from "moment";
import { TCalendarEventUi, TCalendarEventWithCalc } from "Pages/CalendarPage/hooks/useCalendar";

import { formatMoney } from "./formatMoneyAmount";
import { formatPaymentStatus, getAdjustedDate } from "./getAdjustedDate";

// Сортировка по дате
export function sortEvents(events: TCalendarEventUi[]): TCalendarEventUi[] {
  return [...events].sort((a, b) => {
    const dateA = a.raw.payDate || a.raw.paymentDate;
    const dateB = b.raw.payDate || b.raw.paymentDate;
    return moment(dateA).valueOf() - moment(dateB).valueOf();
  });
}

export function uniqueFigis(events: TCalendarEvent[]): string[] {
  return Array.from(new Set(events.map(e => e.figi)));
}

function mapOperationsByFigi<T extends { figi: string; opeartions: any[] }>(
  items: T[]
): Record<string, any[]> {
  return items.reduce((acc, item) => {
    acc[item.figi] = item.opeartions;
    return acc;
  }, {} as Record<string, any[]>);
}

// отсекаем ненужные выплаты по дивидендам, которые нам не полагаются
export function resivedDividends(events: TCalendarEvent[], operations: TOperation[]): TCalendarEventWithCalc[] {
  // 1. Получаем уникальные figi
  const uniqueByFigiArray = uniqueFigis(events);

  // 2. Собираем операции по каждому figi
  const figiOpearions = uniqueByFigiArray.map(figi => ({
    figi,
    opeartions: operations.filter(op => op.figi === figi).reverse()
  }))
  // 3. Превращаем в объект { [figi]: Operation[] }

  const uniqueByFigiObject: Record<string, TOperation[]> = mapOperationsByFigi(figiOpearions)

  // 3. Обрабатываем дивидендные события
  return events
    .map((event) => {
      const lastBuyDate = moment(event.raw.lastBuyDate);
      const ops = uniqueByFigiObject[event.figi] || [];

      let quantity = 0;

      // 4. Считаем, сколько акций было на момент lastBuyDate
      for (const op of ops) {
        const opDate = moment(op.date);

        if (opDate.isSameOrBefore(lastBuyDate)) {
          if (op.type === 'Покупка ценных бумаг' || op.type === 'Покупка ценных бумаг с карты') {
            quantity += Number(op.quantity);
          } else if (op.type === 'Продажа ценных бумаг') {
            quantity -= Number(op.quantity);
          }
        }
      }

      // 5. Проверяем, получены ли уже дивиденды
      const received = ops.some(
        (op) =>
          (op.type === 'Выплата дивидендов' || op.type === 'Выплата дивидендов на карту') &&
          moment(op.date).isSameOrAfter(lastBuyDate)
      );

      // 6. Возвращаем обновлённое событие
      return {
        ...event,
        quantity,
        received,
      };
    })
    // 7. Оставляем только те, где у нас была позиция на дату фиксации
    .filter(ev => ev.quantity > 0)
    // 8. Исключаем уже полученные
    .filter(ev => !ev.received);
}

export function resivedCoupons(events: TCalendarEvent[], positions: TPortfolioPositionFull[]): TCalendarEventWithCalc[] {
  return events.filter(event => formatMoney(event?.raw.payOneBond).value !== 0).map(event => {
    const position = positions.find(pos => pos.figi === event.figi);
    const quantity = Number(position?.quantity?.units || 0);

    return {
      ...event,
      quantity,
      received: false,
    };
  });
}

// Группировка по дню
export function groupByDay(events: TCalendarEvent[]) {
  return events.reduce<Record<string, TCalendarEvent[]>>((acc, ev) => {
    const date = ev.raw.couponDate || ev.raw.paymentDate;
    const key = moment(date).format("YYYY-MM-DD");
    if (!acc[key]) acc[key] = [];
    acc[key].push(ev);
    return acc;
  }, {});
}

// Готовим итоговый массив для вывода в UI
export function formatteEventsForUi(
  events: TCalendarEventWithCalc[],
  positions: TPortfolioPositionFull[],
  USD: number
): TCalendarEventUi[] {
  return events
    .map(event => {
      const name = positions.find(el => el.figi === event.figi)?.name || 'Актив';
      let moneyAmount = formatMoney(0);

      // 💰 Расчёт суммы выплаты
      if (event.eventType === 'coupon' && event.raw.payOneBond.currency === 'usd') {
        moneyAmount = formatMoney(
          event.quantity * formatMoney(event.raw.payOneBond).value * USD
        );
      } else if (event.eventType === 'dividend') {
        moneyAmount = formatMoney(
          event.quantity * formatMoney(event.raw.dividendNet).value * 0.87
        );
      } else if (event.eventType === 'coupon' && event.raw.payOneBond.currency !== 'usd') {
        moneyAmount = formatMoney(
          event.quantity * formatMoney(event.raw.payOneBond).value
        );
      }

      // 📅 Дата с учётом выходных
      const rawDate =
        event.eventType === 'dividend'
          ? event.raw.paymentDate
          : event.raw.payDate;

      const correctDate = moment(getAdjustedDate(rawDate));
      const textCorrectDate = formatPaymentStatus(correctDate, event.received);

      return {
        ...event,
        correctDate: correctDate.format('DD.MM.YYYY'),
        textCorrectDate,
        name,
        moneyAmount,
      };
    })
    // 🧹 Фильтрация купонов со вчерашней датой
    .filter(event => {
      if (event.eventType !== 'coupon') return true;
      const correct = moment(event.correctDate, 'DD.MM.YYYY').startOf('day');
      const yesterday = moment().subtract(1, 'day').startOf('day');
      return !correct.isSame(yesterday, 'day'); // убираем если вчера
    });
}

// Группируем по дате платежа для финала
export function groupByCorrectDate(
  events: TCalendarEventUi[]
): TCalendarEventUi[][] {
  const map = new Map<string, TCalendarEventUi[]>();

  for (const event of events) {
    const date = event.correctDate;
    if (!map.has(date)) {
      map.set(date, []);
    }
    map.get(date)!.push(event);
  }

  return Array.from(map.values());
}

// Фильтрация по периоду
export function filterEvents(
  events: TCalendarEvent[],
  filter: "week" | "month" | "year" | "2025" | "dividends"
) {
  const now = moment();

  if (filter === "dividends") {
    return events.filter((ev) => ev.eventType === "dividend");
  }

  // периоды
  const endDates: Record<"week" | "month" | "year" | "2025", moment.Moment> = {
    week: now.clone().add(7, "days"),
    month: now.clone().add(1, "month"),
    year: now.clone().add(1, "year"),
    "2025": moment("2026-01-01"),
  };

  const end = endDates[filter as keyof typeof endDates];

  return events.filter((ev) => {
    const date = moment(ev.raw.couponDate || ev.raw.paymentDate);
    if (filter === "2025") return date.year() === 2025;
    return date.isSameOrBefore(end, "day");
  });
}

// Подсчёт суммы
export function calcTotal(events: TCalendarEvent[]): number {
  return events.reduce((sum, ev) => {
    if (ev.eventType === "dividend") {
      // дивиденды с налогом 13%
      const amount = parseFloat(ev.raw.dividendNet?.units || "0");
      return sum + amount * 0.87;
    }
    if (ev.eventType === "coupon") {
      const units = parseFloat(ev.raw.payOneBond?.units || "0");
      const nano = ev.raw.payOneBond?.nano || 0;
      const amount = units + nano / 1e9;
      return sum + amount;
    }
    return sum;
  }, 0);
}

// Агрегация по месяцам
export function aggregateByMonth(events: TCalendarEvent[]) {
  return events.reduce<Record<string, number>>((acc, ev) => {
    const date = ev.raw.couponDate || ev.raw.paymentDate;
    const key = moment(date).format("YYYY-MM");
    const value =
      ev.eventType === "dividend"
        ? parseFloat(ev.raw.dividendNet?.units || "0") * 0.87
        : parseFloat(ev.raw.payOneBond?.units || "0") +
        (ev.raw.payOneBond?.nano || 0) / 1e9;

    acc[key] = (acc[key] || 0) + value;
    return acc;
  }, {});
}
