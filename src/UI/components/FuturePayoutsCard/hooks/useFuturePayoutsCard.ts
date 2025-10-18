import { useMemo } from "react";
import moment from "moment";
import { TCalendarEventUi } from "Pages/CalendarPage/hooks/useCalendar";

import { formatMoney, TFormatMoney } from "utils/formatMoneyAmount";

type TChartData = {
    month: string;
    fullMonth: Date;
    dividends: number;
    coupons: number;
    value: number;
    formatted: string;
}

type TUseFuturePayoutsCard = (props: TCalendarEventUi[][]) => {
    totalYear: TFormatMoney;
    avgMonth: TFormatMoney;
    chartData: TChartData[];
}

export const useFuturePayoutsCard: TUseFuturePayoutsCard = (eventData) => {
    // --- 1️⃣ Плоский список положительных выплат ---
    const flatEvents = useMemo(
        () => eventData.flat().filter((ev) => ev.moneyAmount?.value > 0),
        [eventData]
    );

    // --- 2️⃣ Агрегируем выплаты по месяцам и по типам ---
    const monthlyAggregated = useMemo(() => {
        const map = new Map<string, { coupons: number; dividends: number }>();

        flatEvents.forEach((ev) => {
            const date =
                ev.raw.payDate ||
                ev.raw.paymentDate ||
                ev.raw.couponEndDate ||
                ev.raw.eventDate;
            if (!date) return;

            const key = moment(date).startOf("month").format("YYYY-MM");
            const prev = map.get(key) || { coupons: 0, dividends: 0 };

            const value = ev.moneyAmount.value || 0;

            // Определяем тип выплаты напрямую по eventType
            if (ev.eventType === "coupon") {
                prev.coupons += value;
            } else if (ev.eventType === "dividend") {
                prev.dividends += value;
            }

            map.set(key, prev);
        });

        return Array.from(map.entries())
            .map(([month, { coupons, dividends }]) => ({
                month,
                coupons,
                dividends,
                total: coupons + dividends,
            }))
            .sort((a, b) => (a.month > b.month ? 1 : -1));
    }, [flatEvents]);

    // --- 3️⃣ Собираем 12 месяцев вперёд ---
    const now = moment().startOf("month");
    const next12Months = Array.from({ length: 12 }).map((_, i) =>
        now.clone().add(i, "months")
    );

    const monthlyData = next12Months.map((m) => {
        const key = m.format("YYYY-MM");
        const found = monthlyAggregated.find((x) => x.month === key);

        const value = (found?.dividends ?? 0) + (found?.coupons ?? 0);

        return {
            month: m.format("MMM"), // короткое имя для оси
            fullMonth: m.toDate(),
            dividends: found?.dividends ?? 0,
            coupons: found?.coupons ?? 0,
            value,
            formatted: formatMoney(value).formatted.replace(/\s/g, ""),
        };
    });

    // --- первые 6 месяцев для графика ---
    const chartData: TChartData[] = monthlyData.slice(0, 6);

    // --- 4️⃣ Суммарные значения за 6 месяцев ---
    const total6mCoupons = chartData.reduce((acc, el) => acc + el.coupons, 0);
    const total6mDividends = chartData.reduce((acc, el) => acc + el.dividends, 0);
    const total6mValue = total6mCoupons + total6mDividends;

    const totalYear = formatMoney(total6mValue); // 👈 теперь за 6 мес
    const avgMonth = formatMoney(total6mValue / 6); // 👈 среднее тоже по 6 мес


    return {
        chartData,
        avgMonth,
        totalYear,
    }
}