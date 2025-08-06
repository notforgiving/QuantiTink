import React, { FC } from "react";
import { NavLink } from "react-router-dom";
import { TAccount } from "api/features/accounts/accountsSlice";
import cn from "classnames";

import css from "./styles.module.scss";

interface IAccountProps {
  id: TAccount['id'];
  name: TAccount['name'];
}

const Account: FC<IAccountProps> = ({ id, name }) => {
  return (
    <NavLink
      to={`/account/${id}`}
      className={cn(css.account, {
        // _isGreen: amountOfDeposits.value < currentPriceOfBody.value,
      })}
    >
      {/* <div className={css.account_icon}>{getIconByRubAlfabet(name[0])}</div> */}
      <div className={css.account_name}>{name}</div>
      <div
        className={cn(css.account_money, {
        //   _isGreen: amountOfDeposits.value < currentPriceOfBody.value,
        })}
      >
        <strong>0 руб</strong>
        <span>
          0 %
        </span>
      </div>
    </NavLink>
  );
};

export default Account;
