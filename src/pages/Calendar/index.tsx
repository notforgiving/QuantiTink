import React, { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCalendar } from "./hook/useCalendar";
import css from "./styles.module.scss";
import cn from "classnames";
import Load from "../../UI/components/Load";
import BackHeader from "components/BackHeader";
import { formattedMoneySupply } from "utils";

const Calendar: FC = () => {
  let { id: accountId } = useParams();
  const navigate = useNavigate();
  const {
    payOuts,
    monthPayBonds,
    monthPayDiv,
    yearAllPay,
    isLoadingCalc,
    currentFilter,
    setCurrentFilter,
    isLoadingEventData,
  } = useCalendar({
    accountId,
  });

  return (
    <div>
      <BackHeader
        title="Календарь выплат"
        backCallback={() => navigate(`/account/${accountId}`)}
      />
      {/* <div className={css.total_wrapper}>
        {isLoadingCalc ? (
          <>
            <Load
              style={{
                width: "100%",
                height: "16px",
              }}
            />
            <Load
              style={{
                width: "100%",
                height: "16px",
              }}
            />
            <Load
              style={{
                width: "100%",
                height: "16px",
              }}
            />
          </>
        ) : (
          <>
            <div className={css.total_wrapper_item}>
              <span>Купоны за месяц:</span>
              <strong>{monthPayBonds.formatt}</strong>
            </div>
            <div className={css.total_wrapper_item}>
              <span>Дивиденды за месяц:</span>
              <strong>{monthPayDiv.formatt}</strong>
            </div>
            <div className={css.total_wrapper_item}>
              <span>Всего за период:</span>
              <strong>{yearAllPay.formatt}</strong>
            </div>
          </>
        )}
      </div> */}
      {/* <div className={css.actions}>
        <div
          className={cn(css.actions__item, {
            _isActive: currentFilter === "DEFAULT",
          })}
          onClick={() => setCurrentFilter("DEFAULT")}
        >
          Год вперед
        </div>
        <div
          className={cn(css.actions__item, {
            _isActive: currentFilter === "MONTH",
          })}
          onClick={() => setCurrentFilter("MONTH")}
        >
          Месяц
        </div>
        <div
          className={cn(css.actions__item, {
            _isActive: currentFilter === "DIVIDENDS",
          })}
          onClick={() => setCurrentFilter("DIVIDENDS")}
        >
          Дивиденды
        </div>
        <div
          className={cn(css.actions__item, {
            _isActive: currentFilter === "YEAR",
          })}
          onClick={() => setCurrentFilter("YEAR")}
        >
          2025
        </div>
      </div> */}
      <div className={css.grid}>
        {(isLoadingCalc || isLoadingEventData) && (
          <>
            <Load
              style={{
                width: "100%",
                height: "78px",
              }}
            />
            <Load
              style={{
                width: "100%",
                height: "78px",
              }}
            />
            <Load
              style={{
                width: "100%",
                height: "78px",
              }}
            />
          </>
        )}
        {!isLoadingCalc &&
          !isLoadingEventData &&
          payOuts.length !== 0 &&
          payOuts.map((event, index) => {
            return (
              <div className={css.item} key={`${index}${event.date}`}>
                <div className={css.item__date}>
                  <strong>{event.date}</strong>
                  <span>
                    Итого:{" "}
                    <span className="green">
                      {
                        formattedMoneySupply(
                          event.array.reduce(
                            (acc, el) => acc + el.totalAmount.value,
                            0
                          )
                        ).formatt
                      }
                    </span>
                  </span>
                </div>
                {event.array.map((el) => (
                  <div
                    className={css.item__body}
                    title={
                      el.operationType === "Досрочное погашение" ? el.note : ""
                    }
                  >
                    <div className={css.item__type}>{el.operationType}</div>
                    <div className={css.item__info}>
                      <strong>{el.name}</strong>
                      <span>{el.totalAmount.formatt}</span>
                    </div>
                  </div>
                ))}
                {/* <div className={css.item__type}>{event.operationType}</div>
                  <div className={css.item__info}>
                    <strong>{event.name}</strong>
                    <span>{event.totalAmount.formatt}</span>
                  </div> */}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Calendar;
