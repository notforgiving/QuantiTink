import React, { FC } from "react";
import css from "../../styles.module.scss";
import cn from "classnames";
import moment from "moment";
import { getDeclensionWordMonth } from "../../../../utils";
import { TShareProfitability } from "../../hook/useShares";

interface ILineProps {
  operation: TShareProfitability;
}

const Line: FC<ILineProps> = ({ operation }) => {
  return (
    <div
      className={cn(css.shares_item, {
        _isProfitablePurchase: operation.profitabilityNow.percent > 0,
        _isUnprofitablePurchase: operation.profitabilityNow.percent <= 0,
      })}
    >
      <div className={cn(css.shares_item_row, "_isBody")}>
        <div className={css.number}>{operation.number}</div>
        <div className={css.name}>{operation.name}</div>
        <div className={css.date}>
          {moment(operation.date).format("DD.MM.YYYY")}
        </div>
        <div className={css.quantity}>{operation.quantity}</div>
        <div className={css.priceTotal}>{operation.priceTotal.formatt}</div>
        <div className={css.priceActiality}>
          {operation.priceActiality.formatt}
        </div>
        <div className={css.profitabilityNow}>
          {operation.profitabilityNow.percent}% (
          {operation.profitabilityNow.money.formatt})
        </div>
        <div className={css.ownershipPeriod}>
          <strong>{(operation.ownershipPeriod / 12).toFixed(2)} года </strong>
          <span>
            {operation.ownershipPeriod}{" "}
            {getDeclensionWordMonth(operation.ownershipPeriod)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Line;
