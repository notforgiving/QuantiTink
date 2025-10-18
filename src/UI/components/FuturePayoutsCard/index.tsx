import { FC, useMemo } from "react";
import { useTheme } from "api/features/user/useUser";
import moment from "moment";
import { TCalendarEventUi } from "Pages/CalendarPage/hooks/useCalendar";
import {
  Bar,
  BarChart,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

import { formatMoney } from "utils/formatMoneyAmount";

import css from "./styles.module.scss";

type Props = {
  result: TCalendarEventUi[][];
};

const FuturePayoutsCard: FC<Props> = ({ result }) => {
  // --- 1️⃣ Плоский список положительных выплат ---
  const flatEvents = useMemo(
    () => result.flat().filter((ev) => ev.moneyAmount?.value > 0),
    [result]
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
  const chartData = monthlyData.slice(0, 6);

  // --- 4️⃣ Суммарные значения за 6 месяцев ---
  const total6mCoupons = chartData.reduce((acc, el) => acc + el.coupons, 0);
  const total6mDividends = chartData.reduce((acc, el) => acc + el.dividends, 0);
  const total6mValue = total6mCoupons + total6mDividends;

  const totalYear = formatMoney(total6mValue); // 👈 теперь за 6 мес
  const avgMonth = formatMoney(total6mValue / 6); // 👈 среднее тоже по 6 мес

  const theme = useTheme();

  // --- 5️⃣ JSX ---
  return (
    <div className={css.card}>
      <div className={css.card__header}>
        <div className={css.card__title}>Будущие выплаты</div>
        <div className={css.card__total}>
          {totalYear.formatted} <span>за 6 месяцев</span>
        </div>
      </div>

      <div className={css.card__chart}>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={chartData} margin={{ top: 10, bottom: 0 }}>
            <defs>
              {/* Монотонная заливка для дивидендов */}
              <pattern
                id="dividendsPattern"
                width="6"
                height="6"
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(45)"
              >
                <rect x="0" y="0" width="6" height="6" fill="#d88500" />
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="6"
                  stroke="black"
                  strokeWidth="2"
                />
              </pattern>

              <pattern
                id="couponsPattern"
                width="6"
                height="6"
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(45)"
              >
                <rect x="0" y="0" width="6" height="6" fill="#3bc2a1" />
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="6"
                  stroke="black"
                  strokeWidth="2"
                />
              </pattern>
            </defs>
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: `${theme === 'light' ? "#001c18" : "#ffffffb3"}`, fontSize: 12 }}
            />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.05)" }}
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;

                const item = payload[0].payload;
                const fullMonth = moment(item.fullMonth).format("MMMM YYYY");
                const capitalizedMonth =
                  fullMonth.charAt(0).toUpperCase() + fullMonth.slice(1);

                return (
                  <div
                    style={{
                      background: `${theme === 'light' ? "#1a1a1a" : "#001c18ff"}`,
                      border: "none",
                      borderRadius: 8,
                      color: "#fff",
                      padding: "8px 12px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                    }}
                  >
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>
                      {capitalizedMonth}
                    </div>
                    <div
                      style={{
                        color: "#3bc2a1",
                      }}
                    >
                      Купоны:{" "}
                      <strong>{formatMoney(item.coupons).formatted}</strong>
                    </div>
                    <div
                      style={{
                        color: "#d88500",
                      }}
                    >
                      Дивиденды:{" "}
                      <strong>{formatMoney(item.dividends).formatted}</strong>
                    </div>
                  </div>
                );
              }}
            />
            {/* --- stacked bar: дивиденды + купоны --- */}

            <Bar
              dataKey="dividends"
              stackId="a"
              radius={[0, 0, 0, 0]}
              maxBarSize={36}
              fill="url(#dividendsPattern)"
            />
            <Bar
              dataKey="coupons"
              stackId="a"
              radius={[6, 6, 0, 0]}
              maxBarSize={36}
              fill="url(#couponsPattern)"
            >
              <LabelList
                dataKey="formatted"
                position="top"
                dy={-6}
                style={{
                  fill: `${theme === 'light' ? "#001c18" : "#ffffffb3"}`,
                  fontSize: 12,
                  fontWeight: 500,
                }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className={css.card__average}>
        В среднем <strong>{avgMonth.formatted}</strong> в месяц 💰
      </div>
    </div>
  );
};

export default FuturePayoutsCard;
