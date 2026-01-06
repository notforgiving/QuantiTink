import React, { FC, useEffect,useRef, useState } from "react";
import moment from "moment";
import { TCalendarEventUi } from "Pages/CalendarPage/hooks/useCalendar";

import { formatMoney } from "utils/formatMoneyAmount";

import css from "../../styles.module.scss";

interface IGridProps {
  monthMoment: any;
  weekDays: string[];
  changeMonth: (diff: number) => void;
  canPrev: boolean;
  canNext: boolean;
  days: moment.Moment[];
  buildDayMap: Record<
    string,
    {
      total: number;
      events: TCalendarEventUi[];
    }
  >;
  today: moment.Moment;
}

const Grid: FC<IGridProps> = ({
  monthMoment,
  weekDays,
  changeMonth,
  canPrev,
  canNext,
  days,
  buildDayMap,
  today,
}) => {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDocClick = (e: Event) => {
      const target = (e as MouseEvent).target || (e as TouchEvent).target;
      if (gridRef.current && !gridRef.current.contains(target as Node)) {
        setActiveKey(null);
      }
    };
    document.addEventListener("click", onDocClick);
    document.addEventListener("touchstart", onDocClick);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("touchstart", onDocClick);
    };
  }, []);

  const getEventLabel = (ev: TCalendarEventUi) => {
    if (ev.eventType === "dividend") return "Дивиденд";
    if (ev.eventType === "coupon" && ev.raw.eventType === "EVENT_TYPE_CPN") return "Купон";
    if (ev.eventType === "coupon" && ev.raw.eventType === "EVENT_TYPE_MTY" && ev.raw.operationType === "OA") return "Амортизация";
    if (ev.eventType === "coupon" && ev.raw.eventType === "EVENT_TYPE_MTY" && ev.raw.operationType === "OM") return "Погашение";
    if (ev.eventType === "coupon" && ev.raw.eventType === "EVENT_TYPE_CALL") return "Досрочное погашение";
    return "Выплата";
  };
  return (
    <div className={css.calendar__month} ref={gridRef}>
      <div className={css.calendar__monthNav}>
        <button onClick={() => changeMonth(-1)} disabled={!canPrev}>
          ←
        </button>
        <div className={css.calendar__monthLabel}>
          {monthMoment.format("MMMM YYYY")}
        </div>
        <button onClick={() => changeMonth(1)} disabled={!canNext}>
          →
        </button>
      </div>

      <div className={css.calendar__monthGrid}>
        {weekDays.map((wd) => (
          <div key={wd} className={css.calendar__weekday}>
            {wd}
          </div>
        ))}

        {days.map((d) => {
          const key = d.format("DD.MM.YYYY");
          const inMonth = d.isSame(monthMoment, "month");
          const data = buildDayMap[key];
          const total = data ? data.total : 0;
          const isToday = d.isSame(today, "day");
          const classes = [css.calendar__day];
          classes.push(inMonth ? css._inMonth : css._outMonth);
          if (isToday) classes.push(css._today);

          return (
            <div
              key={key}
              data-day={key}
              className={classes.join(" ")}
              onClick={(e) => {
                e.stopPropagation();
                setActiveKey(activeKey === key ? null : key);
              }}
            >
              <div className={css.calendar__dayNumber}>{d.format("D")}</div>
              {total ? (
                <div className={css.calendar__dayTotal}>
                  {formatMoney(total).formatted}
                </div>
              ) : null}

              {activeKey === key && data && data.events && data.events.length > 0 ? (
                <div className={css.calendar__tooltip}>
                  {data.events.map((ev, i) => (
                    <div key={`${ev.raw.eventNumber}-${i}`} className={css.calendar__tooltip_item}>
                      <span className={css.calendar__tooltip_type}>{getEventLabel(ev)}</span>
                      <span className={css.calendar__tooltip_name}>{ev.name}</span>
                      <span className={css.calendar__tooltip_amount}>{ev.moneyAmount.formatted}</span>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Grid;
