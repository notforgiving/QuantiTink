import React, { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Container from "../../UI/components/Container";
import Button from "../../UI/components/Button";
import { useCalendar } from "./hook/useCalendar";
import css from "./styles.module.scss";
import cn from "classnames";
import moment from "moment";
import { formattedMoneySupply, getNumberMoney } from "../../utils";

const Calendar: FC = () => {
  let { id: accountId } = useParams();
  const navigate = useNavigate();
  const { payOuts } = useCalendar({
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
      <div className={css.grid}>
        {payOuts &&
          !!payOuts.length &&
          payOuts.map((event, index) => (
            <div className={css.item} key={`${index}${event.figi}`}>
              <div className={css.item_left}>
                <div
                  className={cn(css.item_type, {
                    _isDividend: event.operationType === "Дивиденды",
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
                    })}
                  >
                    {
                      formattedMoneySupply(
                        (event.oneLot *
                          Number(event.quantity.units) *
                          getNumberMoney(event.payOneLot)) * 0.87
                      ).formatt
                    }
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
