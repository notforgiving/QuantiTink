import { useCalendar } from "api/features/calendar/useCalendar";

import { aggregateByMonth, calcTotal, filterEvents, groupByDay, sortEvents } from "utils/calendar";

export function useCalendarUI(accountId: string, filter: "week" | "month" | "year" | "2025" | "dividends") {
  const { events, loading, error } = useCalendar(accountId);

  // сортировка
  const sorted = sortEvents(events);

  // фильтрация
  const filtered = filterEvents(sorted, filter);

  // группировка
  const grouped = groupByDay(filtered);

  // сумма
  const total = calcTotal(filtered);

  // по месяцам
  const byMonth = aggregateByMonth(filtered);

  return { loading, error, grouped, total, byMonth };
}