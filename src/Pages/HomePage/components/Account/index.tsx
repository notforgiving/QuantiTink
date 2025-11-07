import React, { FC, useMemo } from "react";
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
  const isPositive = useMemo(
    () => invested.value < formattedPortfolio.value,
    [invested.value, formattedPortfolio.value]
  );
  const IconComponent = useMemo(() => getAccountIcon(name), [name]);
  const isDisabled = formattedPortfolio.value === 0;

  return (
    <NavLink
      to={`/${id}`}
      className={cn(css.account, {
        _isGreen: isPositive,
        _isDisabled: isDisabled,
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
