import React, { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Container from "../../UI/components/Container";
import Button from "../../UI/components/Button";
import { useCalendar } from "./hook/useCalendar";
import css from "./styles.module.scss";
import cn from "classnames";
import moment from "moment";
import { formattedMoneySupply } from "../../utils";

const Calendar: FC = () => {
  let { id: accountId } = useParams();
  const navigate = useNavigate();
  const { payOuts, monthPayBonds, monthPayDiv, yearAllPay, additionalPayOuts } =
    useCalendar({
      accountId,
    });
  console.log(payOuts, "payOuts");

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
        <div className={css.total}>{monthPayBonds.formatt}</div>
        <div className={cn(css.total, css.shares)}>{monthPayDiv.formatt}</div>
        <div className={cn(css.total, css.all)}>
          {
            formattedMoneySupply(monthPayBonds.value + monthPayDiv.value)
              .formatt
          }
        </div>
      </div>
      <div className={css.total_wrapper}>
        <span>В течении года:</span>
        <div className={cn(css.total, css.all)}>{yearAllPay.formatt}</div>
      </div>
      <div className={css.grid}>
        <>
          {additionalPayOuts &&
            !!additionalPayOuts.length &&
            additionalPayOuts.map((el, index) => (
              <div className={css.item} key={`${index}${el.figi}`}>
                <div className={css.item_left}>
                  <div
                    className={cn(css.item_type, {
                      _isDividend: el.operationType === "Дивиденды",
                      _isRepayment: el.operationType === "Погашение",
                    })}
                  >
                    {el.operationType}
                  </div>
                  <div className={css.item_date}>
                    {moment(el.paymentDate).format("DD MMMM")}
                  </div>
                </div>
                <div className={css.item_body}>
                  <div className={css.item_info}>
                    <div className={css.item_name}>{el.name}</div>
                    <div
                      className={cn(css.item_price, {
                        _isDividend: el.operationType === "Дивиденды",
                        _isRepayment: el.operationType === "Погашение",
                      })}
                    >
                      {el.totalAmount.formatt}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </>
        {payOuts &&
          !!payOuts.length &&
          payOuts.map((event, index) => (
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
                  {moment(event.paymentDate).format("DD MMMM")}
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
          ))}
      </div>
    </Container>
  );
};

export default Calendar;
