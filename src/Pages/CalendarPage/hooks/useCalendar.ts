import { useMemo } from "react";
import { useAccounts } from "api/features/accounts/useAccounts";
import { TCalendarEvent } from "api/features/calendar/calendarType";
import { useCalendar } from "api/features/calendar/useCalendar";
import { useCurrency } from "api/features/currency/useCurrency";

import { formatteEventsForUi, groupByCorrectDate, resivedCoupons, resivedDividends, sortEvents } from "utils/calendar";
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


export type TUseCalendarUI = (props: string) => {
  loading: boolean;
  error: string | null;
  result: TCalendarEventUi[][]
}

export const useCalendarUI: TUseCalendarUI = (accountId) => {
  const accounts = useAccounts();
  const { events, loading, error } = useCalendar(accountId);

  const account = accounts?.data?.find((el) => el.id === accountId) ?? null;
  const { rates: { USD } } = useCurrency();

  const sharesOperations = useMemo(() => {
    return account?.operations?.filter(
      (op) => (op.instrumentType === 'share') && (op.type === 'Покупка ценных бумаг' || op.type === 'Покупка ценных бумаг с карты' || op.type === 'Продажа ценных бумаг' || op.type === 'Выплата дивидендов' || op.type === 'Выплата дивидендов на карту')
    ) ?? [];
  }, [account?.operations]);

  const bondsOperations = useMemo(() => {
    return account?.operations?.filter(
      (op) => (op.instrumentType === 'bond') && (op.type === 'Выплата купонов' || op.type === 'Покупка ценных бумаг')
    ) ?? [];
  }, [account?.operations]);

  // Массив без дивидендов
  const notResivedDividends = resivedDividends(events.filter(el => el.eventType === 'dividend'), sharesOperations)

  // Нужен массив купонов с указанием количества бондов для получения выплаты
  const notResivedCoupons = resivedCoupons(events.filter(el => el.eventType === 'coupon'), account?.positions || [], bondsOperations)

  // Единый массив
  const unionEventsWithQantity = [...notResivedDividends, ...notResivedCoupons]

  // Добавляет корректные даты, названия и суммы
  const eventsForUi = formatteEventsForUi(unionEventsWithQantity, account?.positions || [], USD);

  // сортируем по возрастанию даты
  const sorted = sortEvents(eventsForUi);
  // группировка по дате платежа для вывода в UI
  const result = groupByCorrectDate(sorted);

  return { loading, error, result };
}