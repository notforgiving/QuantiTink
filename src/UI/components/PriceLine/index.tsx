import React, { FC } from "react";
import { ReactComponent as ArrowSvg } from "assets/arrow-forward.svg";
import cn from "classnames";

import { TFormatMoney } from "utils/formatMoneyAmount";

import css from "./styles.module.scss";

interface IPriceLineProps {
  leftPrice: TFormatMoney;
  rightPrice: TFormatMoney;
  color?: "GREEN" | "YELLOW";
}

const PriceLine: FC<IPriceLineProps> = ({ leftPrice, rightPrice, color }) => {
  return (
    <div
      className={cn(css.price, 'PriceLine', {
        _isGreen: color === "GREEN",
        _isYellow: color === "YELLOW",
      })}
    >
      <span>{leftPrice.formatted}</span>
      <ArrowSvg />
      <span>{rightPrice.formatted}</span>
    </div>
  );
};

export default PriceLine;
