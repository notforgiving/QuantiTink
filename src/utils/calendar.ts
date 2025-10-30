import { TOperation, TPortfolioPositionFull } from "api/features/accounts/accountsTypes";
import { TCalendarEvent } from "api/features/calendar/calendarType";
import moment from "moment";
import { TCalendarEventUi, TCalendarEventWithCalc } from "Pages/CalendarPage/hooks/useCalendar";

import { formatMoney } from "./formatMoneyAmount";
import { formatPaymentStatus, getAdjustedDate } from "./getAdjustedDate";

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
export function resivedCoupons(events: TCalendarEvent[], positions: TPortfolioPositionFull[], operations: TOperation[]): TCalendarEventWithCalc[] {
  // 1. Получаем уникальные figi
  const uniqueByFigiArray = uniqueFigis(events);

  // 2. Собираем операции по каждому figi
  const figiOpearions = uniqueByFigiArray.map(figi => ({
    figi,
    opeartions: operations.filter(op => op.figi === figi).reverse()
  }))

  // 3. Превращаем в объект { [figi]: Operation[] }
  const uniqueByFigiObject: Record<string, TOperation[]> = mapOperationsByFigi(figiOpearions)

  // 4.  Проверяем в операциях по счету получен ли купон и убираем его из списка, если уже пришел
  
  return events.filter(event => formatMoney(event?.raw.payOneBond).value !== 0).map(event => {
    const position = positions.find(pos => pos.figi === event.figi);
    const quantity = Number(position?.quantity?.units || 0);
    const received = uniqueByFigiObject[event.figi].some(op =>
      op.type === 'Выплата купонов' &&
      moment(op.date).isSameOrAfter(moment(event?.raw.payDate))
    );
    return {
      ...event,
      quantity,
      received,
    };
  }).filter(ev => !ev.received);
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
      const today = moment().startOf('day');

      return !correct.isBefore(today, 'day'); // убираем все купоны до сегодняшнего дня
    });
}
// Сортировка по дате
export function sortEvents(events: TCalendarEventUi[]): TCalendarEventUi[] {
  return [...events].sort((a, b) => {
    const dateA = a.raw.payDate || a.raw.paymentDate;
    const dateB = b.raw.payDate || b.raw.paymentDate;
    return moment(dateA).valueOf() - moment(dateB).valueOf();
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
export function uniqueFigis(events: TCalendarEvent[]): string[] {
  return Array.from(new Set(events.map(e => e.figi)));
}
export function mapOperationsByFigi<T extends { figi: string; opeartions: any[] }>(
  items: T[]
): Record<string, any[]> {
  return items.reduce((acc, item) => {
    acc[item.figi] = item.opeartions;
    return acc;
  }, {} as Record<string, any[]>);
}