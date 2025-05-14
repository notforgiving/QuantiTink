import React, { FC } from "react";
import { ReactComponent as AccountSvg } from "../../assets/account.svg";
import css from "./styles.module.scss";
import { TFAmount } from "../../types/portfolio.type";
import { formattedMoneySupply, getNumberMoney } from "../../utils";

interface IAccountProps {
  name: string;
  totalAmountPortfolio?: TFAmount;
}

const Account: FC<IAccountProps> = ({ name, totalAmountPortfolio }) => {
  return (
    <div className={css.account}>
      <div className={css.account_img}>
        <AccountSvg />
      </div>
      <div className={css.account_body}>
        <div className={css.account_name}>{name}</div>
        {totalAmountPortfolio && (
          <div className={css.account_money}>
            {formattedMoneySupply(getNumberMoney(totalAmountPortfolio)).formatt}
          </div>
        )}
      </div>
    </div>
  );
};

export default Account;
