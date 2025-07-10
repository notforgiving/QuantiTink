import React, { FC } from "react";
import css from "./styles.module.scss";
import { TFAmount } from "../../types/portfolio.type";
import { formattedMoneySupply, getNumberMoney } from "../../utils";
import Load from "../../UI/components/Load";
import { NavLink } from "react-router-dom";
import { ReactComponent as ArrowRightSvg } from "assets/arrow-right.svg";
import cn from "classnames";
import { TFFormattPrice } from "types/common";

interface IAccountProps {
  id: string;
  name: string;
  totalAmountPortfolio?: TFAmount;
  loadingMoney: boolean;
  amountOfDeposits: TFFormattPrice;
}

const Account: FC<IAccountProps> = ({
  id,
  name,
  totalAmountPortfolio,
  loadingMoney,
  amountOfDeposits,
}) => {
  const currentPriceOfBody = totalAmountPortfolio
    ? formattedMoneySupply(getNumberMoney(totalAmountPortfolio))
    : {
        formatt: "0",
        value: 0,
      };
  return (
    <NavLink to={`/account/${id}`} className={css.account}>
      <div className={css.account_header}>
        <div className={css.account_name}>{name}</div>
        <div className={css.account_icon}>
          <ArrowRightSvg />
        </div>
      </div>
      {loadingMoney || !totalAmountPortfolio || !amountOfDeposits || !currentPriceOfBody ? (
        <Load
          style={{
            width: "100%",
            height: "auto",
          }}
        />
      ) : (
        <>
          {totalAmountPortfolio && (
            <div
              className={cn(css.account_money, {
                _isGreen: amountOfDeposits.value < currentPriceOfBody.value,
              })}
            >
              {currentPriceOfBody.formatt}
            </div>
          )}
        </>
      )}
    </NavLink>
  );
};

export default Account;
