import React, { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "UI/components/Button";
import css from "../styles.module.scss";
import includeCss from './styles.module.scss';
import { useBonds } from "./hooks/useBonds";

const Bonds: FC = () => {
  const { id: accountId, currency } = useParams();
  const navigate = useNavigate();
  const { bondsList } = useBonds({
    accountId: accountId || "0",
    currency: currency || "rub",
  });
  return (
    <>
      <div className={css.header_actions}>
        <Button
          text="Назад"
          buttonAttributes={{
            type: "button",
            onClick: () => navigate(`/account/${accountId}`),
          }}
        />
        <Button
          text="Рассчет доходности облигации"
          buttonAttributes={{
            type: "button",
            onClick: () => navigate(`/calcBonds`),
          }}
        />
      </div>
      <div className={css.symbols}>
        <div className={css.green}>
          <strong></strong>
          <span>Прибыльная покупка</span>
        </div>
        <div className={css.red}>
          <strong></strong>
          <span>Убыточная покупка</span>
        </div>
        <div className={css.threeYears}>
          <strong></strong>
          <span>Есль льгота ЛДВ</span>
        </div>
      </div>
      <div className={css.shares}>
        <div className={css.shares_title}>
          {currency === "rub" ? "Российские облигации" : "Валютные облигации"}
        </div>
        <div className={includeCss.bond__list}>
          {bondsList.map((item) => (
            <div
              className={includeCss.bond__item}
              onClick={() =>
                navigate(`/account/${accountId}/bonds/${currency}/${item.figi}`)
              }
            >
              {item.name} {"   "}
              / ({item.quantity}) шт
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Bonds;
