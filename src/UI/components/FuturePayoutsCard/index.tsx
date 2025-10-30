import { FC } from "react";
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

import { useFuturePayoutsCard } from "./hooks/useFuturePayoutsCard";

import css from "./styles.module.scss";

type TFuturePayoutsCardProps = {
  eventData: TCalendarEventUi[][];
};

const FuturePayoutsCard: FC<TFuturePayoutsCardProps> = ({ eventData }) => {
  const theme = useTheme();
  const { chartData, avgMonth, totalYear } = useFuturePayoutsCard(eventData);
  
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
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} margin={{ top: 40, bottom: 0 }}>
            <defs>
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
              tick={{
                fill: `${theme === "light" ? "#001c18" : "#ffffffb3"}`,
                fontSize: 12,
              }}
            />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.05)" }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;

                const item = payload[0].payload;
                const fullMonth = moment(item.fullMonth).format("MMMM YYYY");
                const capitalizedMonth =
                  fullMonth.charAt(0).toUpperCase() + fullMonth.slice(1);

                return (
                  <div
                    style={{
                      background: `${
                        theme === "light" ? "#1a1a1a" : "#001c18ff"
                      }`,
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
              maxBarSize={window.innerWidth <= 768 ? 26 : 36}
              fill="url(#dividendsPattern)"
            />
            <Bar
              dataKey="coupons"
              stackId="a"
              radius={[6, 6, 0, 0]}
              maxBarSize={window.innerWidth <= 768 ? 26 : 36}
              fill="url(#couponsPattern)"
            >
              <LabelList
                dataKey="formatted"
                position="top"
                dy={-6}
                style={{
                  fill: `${theme === "light" ? "#001c18" : "#ffffffb3"}`,
                  fontSize: window.innerWidth <= 768 ? 10 : 12,
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
