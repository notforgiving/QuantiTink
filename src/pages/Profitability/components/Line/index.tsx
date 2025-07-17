import React, { FC } from "react";
import css from "../../styles.module.scss";
import cn from "classnames";
import moment from "moment";
import { getDeclensionWordMonth } from "utils";
import { TActiveProfitability } from "pages/Profitability/types";
import { ReactComponent as ArrowSvg } from "assets/arrow-forward.svg";

interface ILineProps {
  name?: boolean;
  quantity?: boolean;
  operation: TActiveProfitability;
}

const Line: FC<ILineProps> = ({ operation, name, quantity }) => {
  return (
    <div
      className={cn(css.income_item, {
        _isGreen: operation.profitabilityNow.percent > 0,
        _isRed: operation.profitabilityNow.percent <= 0,
        _isOrange: operation.ownershipPeriod / 12 >= 3,
      })}
    >
      <div className={css.income_item_time}>
        <span>{moment(operation.date).format("DD.MM.YYYY")}</span>
        <span>
          {operation.ownershipPeriod / 12 < 3 && (
            <>
              {operation.ownershipPeriod}{" "}
              {getDeclensionWordMonth(operation.ownershipPeriod)}
            </>
          )}
          {operation.ownershipPeriod / 12 >= 3 && "Льгота"}
        </span>
      </div>
      {name && <div className={css.income_item_name}>{operation.name}</div>}
      <div className={css.income_item_bottom}>
        <div className={css.income_item_prices}>
          <div className={css.income_item_lot} title="Цена за один лот">
            <span>{operation.priceTotal.oneLot.formatt}</span>
            <ArrowSvg />
            <span>{operation.priceActiality.oneLot.formatt}</span>
          </div>
          <div className={css.income_item_value} title="Цена покупки">
            <span>{operation.priceTotal.value.formatt}</span>
            <ArrowSvg />
            <span>{operation.priceActiality.value.formatt}</span>
            {quantity && `(${operation.quantity})`}
          </div>
        </div>
        <div className={css.income_item_percent}>
          {operation.profitabilityNow.percent}%
        </div>
      </div>
    </div>
  );
};

export default Line;
