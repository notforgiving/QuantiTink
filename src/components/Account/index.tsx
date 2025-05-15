import React, { FC } from "react";
import { ReactComponent as AccountSvg } from "../../assets/account.svg";
import css from "./styles.module.scss";
import { TFAmount } from "../../types/portfolio.type";
import { formattedMoneySupply, getNumberMoney } from "../../utils";
import Load from "../../UI/components/Load";

interface IAccountProps {
  name: string;
  totalAmountPortfolio?: TFAmount;
  loadingMoney: boolean;
}

const Account: FC<IAccountProps> = ({
  name,
  totalAmountPortfolio,
  loadingMoney,
}) => {

  return (
    <div className={css.account}>
      <div className={css.account_img}>
        <AccountSvg />
      </div>
      <div className={css.account_body}>
        <div className={css.account_name}>{name}</div>
        {loadingMoney || !totalAmountPortfolio ? (
          <Load
            style={{
              width: "150px",
              height: "14px",
            }}
          />
        ) : (
          <>
            {totalAmountPortfolio && (
              <div className={css.account_money}>
                {
                  formattedMoneySupply(getNumberMoney(totalAmountPortfolio))
                    .formatt
                }
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Account;
