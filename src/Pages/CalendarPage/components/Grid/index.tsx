import React, { FC } from "react";
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
  return (
    <div className={css.calendar__month}>
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
            <div key={key} className={classes.join(" ")}>
              <div className={css.calendar__dayNumber}>{d.format("D")}</div>
              {total ? (
                <div className={css.calendar__dayTotal}>
                  {formatMoney(total).formatted}
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
