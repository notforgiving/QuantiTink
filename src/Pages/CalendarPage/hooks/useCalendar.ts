import { useMemo } from "react";
import { useAccounts } from "api/features/accounts/useAccounts";
import { TCalendarEvent } from "api/features/calendar/calendarType";
import { useCalendar } from "api/features/calendar/useCalendar";
import { useCurrency } from "api/features/currency/useCurrency";

import { aggregateByMonth, calcTotal, filterEvents, formatteEventsForUi, groupByCorrectDate, groupByDay, resivedCoupons, resivedDividends, sortEvents } from "utils/calendar";
import { TFormatMoney } from "utils/formatMoneyAmount";

export type TCalendarEventWithCalc = TCalendarEvent & {
  quantity: number;
  received: boolean;
};

export type TCalendarEventUi = TCalendarEventWithCalc & {
  correctDate: string;
  textCorrectDate: string;
  name: string;
  moneyAmount: TFormatMoney;
}

export function useCalendarUI(accountId: string, filter: "week" | "month" | "year" | "2025" | "dividends") {
  const accounts = useAccounts();
  const { events, loading, error } = useCalendar(accountId);

  const account = accounts?.data?.find((el) => el.id === accountId) ?? null;
  const { rates: { USD } } = useCurrency();
  const operations = useMemo(() => {
    return account?.operations?.filter(
      (op) => (op.instrumentType === 'share') && (op.type === 'Покупка ценных бумаг' || op.type === 'Покупка ценных бумаг с карты' || op.type === 'Продажа ценных бумаг' || op.type === 'Выплата дивидендов' || op.type === 'Выплата дивидендов на карту')
    ) ?? [];
  }, [account?.operations]);
  
  // Массив без дивидендов
  const notResivedDividends = resivedDividends(events.filter(el => el.eventType === 'dividend'), operations)

  // Нужен массив купонов с указанием количества бондов для получения выплаты
  const notResivedCoupons = resivedCoupons(events.filter(el => el.eventType === 'coupon'), account?.positions || [])

  // ЕДИНЫЙ МАССИВ ВЫПЛАТ С КОЛИЧЕСТВОМ
  const unionEventsWithQantity = [...notResivedDividends, ...notResivedCoupons]


  const eventsForUi = formatteEventsForUi(unionEventsWithQantity, account?.positions || [], USD);

  // сортировка
  const sorted = sortEvents(eventsForUi);

  // const result:any[] = [];
  const result = groupByCorrectDate(sorted);

  // фильтрация
  const filtered = filterEvents(events, filter);

  // группировка
  const grouped = groupByDay(filtered);

  // сумма
  const total = calcTotal(filtered);

  // по месяцам
  const byMonth = aggregateByMonth(filtered);

  return { loading, error, grouped, total, byMonth, result };
}