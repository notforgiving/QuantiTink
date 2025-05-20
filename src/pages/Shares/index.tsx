import React, { FC } from "react";
import Container from "../../UI/components/Container";
import Button from "../../UI/components/Button";
import { useNavigate, useParams } from "react-router-dom";
import css from "./styles.module.scss";
import { useShares } from "./hook/useShares";
import cn from "classnames";
import Line from "./components/Line";

const Shares: FC = () => {
  let { id: accountId } = useParams();
  const navigate = useNavigate();
  const { result } = useShares({ accountId: accountId || "0" });
  return (
    <Container>
      <Button
        text="Назад"
        buttonAttributes={{
          type: "button",
          onClick: () => navigate(`/account/${accountId}`),
        }}
      />
      <div className={css.symbols}>
        <div className={css.green}>
          <strong></strong><span>Прибыльная покупка</span>
        </div>
          <div className={css.red}> 
          <strong></strong><span>Убыточная покупка</span>
        </div>
          <div className={css.threeYears}>
          <strong></strong><span>Есль льгота ЛДВ</span>
        </div>
      </div>
      <div className={css.shares}>
        <div className={css.shares_title}>Акции</div>
        <div className={css.shares_header}>
          <div className={cn(css.shares_item_row, "_isHeader")}>
            <div>№</div>
            <div>Название</div>
            <div>Дата покупки</div>
            <div>Количество</div>
            <div>Цена покупки одного лота</div>
            <div>Итоговая цена покупки</div>
            <div>Доходность этой операции сейчас</div>
            <div>Срок владения покупкой</div>
          </div>
        </div>
        <div className={css.shares_list}>
          {!!result.length &&
            result.map((operation) => <Line operation={operation} key={operation.date}/>)}
        </div>
      </div>
    </Container>
  );
};

export default Shares;
