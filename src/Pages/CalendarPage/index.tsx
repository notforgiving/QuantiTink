import React, { FC, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchCalendarRequest } from "api/features/calendar/calendarSlice";
import BackHeader from "UI/components/BackHeader";
import Input from "UI/components/Input";
import LineBlock from "UI/components/LineBlock";

import { formatMoney } from "utils/formatMoneyAmount";

import { useCalendarUI } from "./hooks/useCalendar";

import css from "./styles.module.scss";

const CalendarPage: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCalendarRequest({ accountId: id || "0" }));
  }, [dispatch, id]);

  const { result } = useCalendarUI(id || "0", "year");
  
  // console.log(grouped, "grouped");
  // console.log(total, "total");
  // console.log(byMonth, "byMonth");

  return (
    <div>
      <BackHeader
        title={"Календарь выплат"}
        backCallback={() => navigate(`/${id}`)}
      />
      <div className={css.calendar}>
        <div className={css.calendar__actions}>
          <Input
            label=""
            inputAttributes={{
              placeholder: "Поиск...",
            }}
          />
        </div>
        <div className={css.calendar__grid}>
          {!!result.length &&
            result.map((group, groupIndex) => {
              const total = formatMoney(
                group.reduce((acc, el) => {
                  return acc + el.moneyAmount.value;
                }, 0)
              );
              const groupDate = group[0].textCorrectDate;

              return (
                <div
                  className={css.calendar__group}
                  key={`${total.value}${groupDate}`}
                >
                  <div className={css.calendar__group_info}>
                    <div className={css.calendar__group_date}>{groupDate}</div>
                    <div className={css.calendar__group_total}>
                      <span>Итого:</span>
                      <strong>{total.formatted}</strong>
                    </div>
                  </div>
                  {!!group.length &&
                    group.map((event,eventIndex) => (
                      <LineBlock
                        key={`${event.raw.eventNumber}${eventIndex}`}
                        greenLine={event.eventType !== "dividend"}
                      >
                        <div className={css.calendar__payout_type}>
                          {event.eventType === "dividend" && "Дивиденды"}
                          {event.eventType === "coupon" &&
                            event.raw.eventType === "EVENT_TYPE_CPN" &&
                            (event.raw.operationType !== "OA" ||
                              event.raw.operationType !== "OM") &&
                            "Купон"}
                          {event.eventType === "coupon" &&
                            event.raw.eventType === "EVENT_TYPE_MTY" &&
                            event.raw.operationType === "OA" &&
                            "Амортизация"}
                          {event.eventType === "coupon" &&
                            event.raw.eventType === "EVENT_TYPE_MTY" &&
                            event.raw.operationType === "OM" &&
                            "Погашение"}
                        </div>
                        <div className={css.calendar__payout}>
                          <div className={css.calendar__payout_name}>
                            {event.name}
                          </div>
                          <div className={css.calendar__payout_value}>
                            {event.moneyAmount.formatted}
                          </div>
                        </div>
                      </LineBlock>
                    ))}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
