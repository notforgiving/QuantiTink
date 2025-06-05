import React, { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Container from "../../UI/components/Container";
import Button from "../../UI/components/Button";
import { useCalendar } from "./hook/useCalendar";
import css from "./styles.module.scss";
import cn from "classnames";
import { formattedMoneySupply } from "../../utils";
import Load from "../../UI/components/Load";
import Input from "UI/components/Input";

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
    <Container>
      <Button
        text="Назад"
        buttonAttributes={{
          type: "button",
          onClick: () => navigate(`/account/${accountId}`),
        }}
      />
      <div className={css.total_wrapper}>
        <span>В течении мес.:</span>
        {isLoadingCalc ? (
          <>
            <Load
              style={{
                width: "106px",
                height: "52px",
              }}
            />
            <Load
              style={{
                width: "106px",
                height: "52px",
              }}
            />
            <Load
              style={{
                width: "106px",
                height: "52px",
              }}
            />
          </>
        ) : (
          <>
            <div className={css.total}>{monthPayBonds.formatt}</div>
            <div className={cn(css.total, css.shares)}>
              {monthPayDiv.formatt}
            </div>
            <div className={cn(css.total, css.all)}>
              {
                formattedMoneySupply(monthPayBonds.value + monthPayDiv.value)
                  .formatt
              }
            </div>
          </>
        )}
      </div>
      <div className={css.total_wrapper}>
        <span>За всё время:</span>
        {isLoadingCalc ? (
          <Load
            style={{
              width: "106px",
              height: "52px",
            }}
          />
        ) : (
          <div className={cn(css.total, css.all)}>{yearAllPay.formatt}</div>
        )}
      </div>
      <div className={css.actions}>
        <Input
          label="Дивиденды"
          inputAttributes={{
            type: "checkbox",
            checked: currentFilter === "DIVIDENDS",
            onClick: () =>
              setCurrentFilter(
                currentFilter === "DIVIDENDS" ? "DEFAULT" : "DIVIDENDS"
              ),
          }}
        />
        <Input
          label="Месяц"
          inputAttributes={{
            type: "checkbox",
            checked: currentFilter === "MONTH",
            onClick: () =>
              setCurrentFilter(currentFilter === "MONTH" ? "DEFAULT" : "MONTH"),
          }}
        />
        <Input
          label={`Период - ${new Date().getFullYear()}`}
          inputAttributes={{
            type: "checkbox",
            checked: currentFilter === "YEAR",
            onClick: () =>
              setCurrentFilter(currentFilter === "YEAR" ? "DEFAULT" : "YEAR"),
          }}
        />
      </div>
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
        {}
        {!isLoadingCalc &&
          !isLoadingEventData &&
          payOuts.length !== 0 &&
          payOuts.map((event, index) => {
            return (
              <div className={css.item} key={`${index}${event.figi}`}>
                <div className={css.item_left}>
                  <div
                    className={cn(css.item_type, {
                      _isDividend: event.operationType === "Дивиденды",
                      _isRepayment: event.operationType === "Погашение",
                    })}
                  >
                    {event.operationType}
                  </div>
                  <div className={css.item_date}>{event.paymentTitle}</div>
                </div>
                <div className={css.item_body}>
                  <div className={css.item_info}>
                    <div className={css.item_name}>{event.name}</div>
                    <div
                      className={cn(css.item_price, {
                        _isDividend: event.operationType === "Дивиденды",
                        _isRepayment: event.operationType === "Погашение",
                      })}
                    >
                      {event.totalAmount.formatt}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </Container>
  );
};

export default Calendar;
