import React, { FC, useMemo } from "react";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { TAccount } from "api/features/accounts/accountsSlice";
import { toggleHideAccount } from "api/features/accounts/accountsSlice";
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
  hidden?: boolean;
}

const Account: FC<IAccountProps> = ({
  id,
  name,
  invested,
  formattedPortfolio,
  returnPercent,
  hidden,
}) => {
  const dispatch = useDispatch();
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
      <div
        className={css.account_eye}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          dispatch(toggleHideAccount({ accountId: id }));
        }}
        title={hidden ? "Показать счёт" : "Скрыть счёт"}
        aria-label={hidden ? "Показать счёт" : "Скрыть счёт"}
      >
        {/* simple inline SVG eye */}
        {!hidden ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5C7 5 2.73 8.11 1 12C2.73 15.89 7 19 12 19C17 19 21.27 15.89 23 12C21.27 8.11 17 5 12 5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.94 17.94C16.11 19.27 14.12 20 12 20C7 20 2.73 16.89 1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M22.54 11C21.21 7.11 17 4 12 4C10.34 4 8.79 4.32 7.38 4.9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M1 1L23 23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
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
