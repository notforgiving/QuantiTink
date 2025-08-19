import React, { FC } from "react";
import { NavLink } from "react-router-dom";
import { TAccount } from "api/features/accounts/accountsSlice";
import cn from "classnames";
import { getAccountIcon } from "general";

import { TFormatMoney } from "utils/formatMoneyAmount";

import css from "./styles.module.scss";

interface IAccountProps {
  id: TAccount["id"];
  name: TAccount["name"];
  invested: TFormatMoney;
  formattedPortfolio: TFormatMoney;
  returnPercent: string;
}

const Account: FC<IAccountProps> = ({
  id,
  name,
  invested,
  formattedPortfolio,
  returnPercent,
}) => {
  const isPositive = invested.value < formattedPortfolio.value;
  const IconComponent = getAccountIcon(name);

  return (
    <NavLink
      to={`/${id}`}
      className={cn(css.account, {
        _isGreen: isPositive,
      })}
      aria-label={`Счёт ${name}, доходность ${returnPercent}%`}
      title={`Счёт ${name}`}
    >
      <div className={css.account_icon}>
        {IconComponent && <IconComponent />}
      </div>
      <div className={css.account_name}>{name || "Без названия"}</div>
      <div
        className={cn(css.account_money, {
          _isGreen: isPositive,
        })}
      >
      <strong>{formattedPortfolio?.formatted ?? "0.00 ₽"}</strong>
        <span>{returnPercent ?? "0.00"}%</span>
      </div>
    </NavLink>
  );
};

export default Account;
