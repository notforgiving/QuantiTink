import React, { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Container from "../../UI/components/Container";
import Button from "../../UI/components/Button";
import { useCalendar } from "./hook/useCalendar";
import css from "./styles.module.scss";
import cn from "classnames";
import moment from "moment";
import { formattedMoneySupply } from "../../utils";
import Load from "../../UI/components/Load";

const Calendar: FC = () => {
  let { id: accountId } = useParams();
  const navigate = useNavigate();
  const { payOuts, monthPayBonds, monthPayDiv, yearAllPay, isLoadingCalc } =
    useCalendar({
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
        <span>В течении года:</span>
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
      <div className={css.grid}>
        {isLoadingCalc && (
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
          payOuts &&
          !!payOuts.length &&
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
                  <div className={css.item_date}>
                    {event.operationType === "Дивиденды" &&
                    moment(event.paymentDate) < moment() ? (
                      "Ожидаются"
                    ) : (
                      <>
                        {moment(event.paymentDate).day() === 5
                          ? moment(event.paymentDate).day() === 6
                            ? moment(event.paymentDate)
                                .add(2, "d")
                                .format("DD MMMM")
                            : moment(event.paymentDate)
                                .add(3, "d")
                                .format("DD MMMM")
                          : moment(event.paymentDate)
                              .add(1, "d")
                              .format("DD MMMM")}
                      </>
                    )}
                  </div>
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
