import React, { FC } from "react";
import css from "./styles.module.scss";
import { TFAmount } from "../../types/portfolio.type";
import { formattedMoneySupply, getNumberMoney } from "../../utils";
import Load from "../../UI/components/Load";
import { NavLink } from "react-router-dom";
import cn from "classnames";
import { TFFormattPrice } from "types/common";
import { getIconByRubAlfabet } from "general";

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

  if(!amountOfDeposits || !currentPriceOfBody) {
    return null;
  }

  return (
    <NavLink
      to={`/account/${id}`}
      className={cn(css.account, {
        _isGreen: amountOfDeposits.value < currentPriceOfBody.value,
      })}
    >
      <div className={css.account_icon}>{getIconByRubAlfabet(name[0])}</div>
      <div className={css.account_name}>{name}</div>
      {loadingMoney ||
      !totalAmountPortfolio ||
      !amountOfDeposits ||
      !currentPriceOfBody ? (
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
              <strong>{currentPriceOfBody.formatt}</strong>
              <span>{((currentPriceOfBody.value - amountOfDeposits.value)/amountOfDeposits.value*100).toFixed(2)}%</span>
            </div>
          )}
        </>
      )}
    </NavLink>
  );
};

export default Account;
