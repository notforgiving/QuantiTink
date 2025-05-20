import React, { FC } from "react";
import css from "../../styles.module.scss";
import cn from "classnames";
import moment from "moment";
import { getDeclensionWordMonth } from "../../../../utils";

interface ILineProps {
  operation: { [x: string]: any };
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
        <div>{operation.number}</div>
        <div>{operation.name}</div>
        <div>{moment(operation.date).format("DD.MM.YYYY")}</div>
        <div>{operation.quantity}</div>
        <div>{operation.priceLot.formatt}</div>
        <div>{operation.priceTotal.formatt}</div>
        <div>
          {operation.profitabilityNow.percent}% (
          {operation.profitabilityNow.money.formatt})
        </div>
        <div>
          {(operation.ownershipPeriod / 12).toFixed(2)} года /{" "}
          {operation.ownershipPeriod}{" "}
          {getDeclensionWordMonth(operation.ownershipPeriod)}
        </div>
      </div>
    </div>
  );
};

export default Line;
