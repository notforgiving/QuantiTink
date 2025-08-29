import React, { FC } from "react";
import { ReactComponent as ArrowSvg } from "assets/arrow-forward.svg";
import cn from "classnames";

import { TFormatMoney } from "utils/formatMoneyAmount";
import { pluralize } from "utils/usePluralize";

import LineBlock from "../LineBlock";

import css from "./styles.module.scss";

interface IProfitabilityLineProps {
  profitability?: {
    amount: TFormatMoney;
    percent: string;
  };
  totalPriceNow?: TFormatMoney;
  pricePerLotNow?: TFormatMoney;
  totalPurchasePrice?: TFormatMoney;
  pricePerPurchaseLot?: TFormatMoney;
  quantity?: number;
  dateFormatted: string;
  time?: number;
}

const ProfitabilityLine: FC<IProfitabilityLineProps> = ({
  profitability,
  dateFormatted,
  time,
  pricePerPurchaseLot,
  pricePerLotNow,
  quantity,
  totalPurchasePrice,
  totalPriceNow,
}) => {
  return (
    <LineBlock
      className={css.purchases}
      greenLine={profitability ? profitability.amount.value > 0 : false}
    >
      {dateFormatted && (
        <div className={css.purchases__top}>
          <span>{dateFormatted}</span>
          {time && <span>{pluralize(time, "месяц", "месяца", "месяцев")}</span>}
        </div>
      )}
      <div className={css.purchases__bottom}>
        <div className={css.purchases__left}>
          {pricePerPurchaseLot && quantity && (
            <div className={cn(css.purchases__line, css.purchases__lot)}>
              <strong>Цена за лот -</strong>
              <span>
                {pricePerPurchaseLot.formatted} <ArrowSvg />
                {pricePerLotNow?.formatted} ( {quantity} шт.)
              </span>
            </div>
          )}
          {totalPurchasePrice && (
            <div className={cn(css.purchases__line, css.purchases__total)}>
              <strong>Общая цена -</strong>
              <span>
                {totalPurchasePrice.formatted} <ArrowSvg />
                {totalPriceNow?.formatted}
              </span>
            </div>
          )}
        </div>
        {profitability && (
          <div
            className={cn(css.purchases__right, {
              _isGreen: profitability.amount.value > 0,
            })}
          >
            <span>({profitability.amount.formatted})</span>
            <strong>{profitability.percent}%</strong>
          </div>
        )}
      </div>
    </LineBlock>
  );
};

export default ProfitabilityLine;
