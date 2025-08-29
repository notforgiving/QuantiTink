import React, { FC, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchCalendarRequest } from "api/features/calendar/calendarSlice";
import BackHeader from "UI/components/BackHeader";

const CalendarPage: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCalendarRequest({ accountId: id || "0" }));
  }, [dispatch, id]);

  // const { loading, error, grouped, total, byMonth } = useCalendarUI(
  //   id || "0",
  //   "year"
  // );
  // console.log(grouped, "grouped");
  // console.log(total, "total");
  // console.log(byMonth, "byMonth");

  return (
    <div>
      <BackHeader
        title={"Календарь выплат"}
        backCallback={() => navigate(`/${id}`)}
      />

      {/* <div>
        <h3>Сумма: {total.toFixed(2)} ₽</h3>
        {Object.entries(grouped).map(([date, events]) => (
          <div key={date}>
            <h4>{date}</h4>
            <ul>
              {events.map((e, i) => (
                <li key={i}>
                  {e.eventType} {e.figi} → {JSON.stringify(e.raw)}
                </li>
              ))}
            </ul>
          </div>
        ))}
        <h3>По месяцам</h3>
        {Object.entries(byMonth).map(([month, value]) => (
          <div key={month}>
            {month}: {value.toFixed(2)} ₽
          </div>
        ))}
      </div> */}
    </div>
  );
};

export default CalendarPage;
