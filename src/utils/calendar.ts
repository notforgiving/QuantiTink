import { TCalendarEvent } from "api/features/calendar/calendarType";
import moment from "moment";

// Сортировка по дате
export function sortEvents(events: TCalendarEvent[]): TCalendarEvent[] {
  return [...events].sort((a, b) => {
    const dateA = a.raw.couponDate || a.raw.paymentDate;
    const dateB = b.raw.couponDate || b.raw.paymentDate;
    return moment(dateA).valueOf() - moment(dateB).valueOf();
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
