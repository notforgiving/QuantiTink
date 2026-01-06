import React, { FC } from "react";
import { TCalendarEventUi } from "Pages/CalendarPage/hooks/useCalendar";
import LineBlock from "UI/components/LineBlock";

import { TFormatMoney } from "utils/formatMoneyAmount";

import css from "../../styles.module.scss";

interface IListProps {
  groupDate: string;
  total: TFormatMoney;
  group: TCalendarEventUi[];
}

const List: FC<IListProps> = ({ groupDate, total, group }) => {
  return (
    <div className={css.calendar__group} key={`${groupDate}-${total.value}`}>
      <div className={css.calendar__group_info}>
        <div className={css.calendar__group_date}>{groupDate}</div>
        <div className={css.calendar__group_total}>
          <span>Итого:</span>
          <strong>{total.formatted}</strong>
        </div>
      </div>

      {group.map((event, i) => (
        <LineBlock
          key={`${event.raw.eventNumber}-${event.name}-${i}`}
          greenLine={
            event.eventType !== "dividend" ||
            (event.raw.eventType === "EVENT_TYPE_MTY" &&
              event.raw.operationType === "OM")
          }
        >
          <div className={css.calendar__payout_type}>
            {event.eventType === "dividend" && "Дивиденды"}
            {event.eventType === "coupon" &&
              event.raw.eventType === "EVENT_TYPE_CPN" &&
              !["OA", "OM"].includes(event.raw.operationType) &&
              "Купон"}
            {event.eventType === "coupon" &&
              event.raw.eventType === "EVENT_TYPE_MTY" &&
              event.raw.operationType === "OA" &&
              "Амортизация"}
            {event.eventType === "coupon" &&
              event.raw.eventType === "EVENT_TYPE_MTY" &&
              event.raw.operationType === "OM" &&
              "Погашение"}
            {event.eventType === "coupon" &&
              event.raw.eventType === "EVENT_TYPE_CALL" &&
              event.raw.operationType === "A" &&
              "Оъявлено досрочное погашение по запросу"}
          </div>
          <div className={css.calendar__payout}>
            <div className={css.calendar__payout_name}>{event.name}</div>
            <div className={css.calendar__payout_value}>
              {event.moneyAmount.formatted}
            </div>
          </div>
        </LineBlock>
      ))}
    </div>
  );
};

export default List;
