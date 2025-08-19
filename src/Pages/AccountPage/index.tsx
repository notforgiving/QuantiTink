import React, { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ReactComponent as BigemitentSvg } from "assets/bigemitent.svg";
import { ReactComponent as CalendarSvg } from "assets/calendar.svg";
import { ReactComponent as CashSvg } from "assets/cash.svg";
import { ReactComponent as CubeSvg } from "assets/cube.svg";
import { ReactComponent as GoldetfSvg } from "assets/goldetf.svg";
import { ReactComponent as WalletSvg } from "assets/ionicons/icon2.svg";
import { ReactComponent as PodiumSvg } from "assets/podium.svg";
import { ReactComponent as ReceiptSvg } from "assets/receipt.svg";
import { ReactComponent as RubbondsSvg } from "assets/rubbonds.svg";
import { ReactComponent as ServerSvg } from "assets/server.svg";
import { ReactComponent as SharesSvg } from "assets/shares.svg";
import { ReactComponent as TicketSvg } from "assets/ticket.svg";
import { ReactComponent as UsdbondsSvg } from "assets/usdbonds.svg";
import cn from "classnames";
import BackHeader from "UI/components/BackHeader";
import Button from "UI/components/Button";

import { pluralize } from "utils/usePluralize";

import { useAccount } from "./hook/useAccount";

import css from "./styles.module.scss";

const AccountPage: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    account,
    totalAmountPortfolio,
    totalDeposits,
    portfolioGrowth,
    accountAge,
    totalPaidTaxes,
    totalCommissions,
    totalCoupons,
    totalDividends,
    totalPayouts,
    currentYield,
    yearlyYield,
  } = useAccount(id || "");

  return (
    <div>
      <BackHeader
        title={account?.name || "Брокерский счет"}
        backCallback={() => navigate(`/`)}
      />

      <div
        className={cn(css.portfolio, {
          _isGreen: portfolioGrowth.percent > 0,
        })}
      >
        <div className={css.portfolio_data}>
          <div
            className={cn(css.portfolio_amount, {
              _isGreen: portfolioGrowth.percent > 0,
            })}
          >
            <strong>{totalAmountPortfolio.formatted}</strong>
            <span>
              {portfolioGrowth.amount.formatted} / {portfolioGrowth.percent}%
            </span>
          </div>
          <div className={css.portfolio_actions}>
            {accountAge && (
              <div className={css.portfolio_start}>
                {pluralize(accountAge.months(), "месяц", "месяца", "месяцев")}
              </div>
            )}
            <Button
              text=""
              icon={<CalendarSvg />}
              buttonAttributes={{
                type: "button",
                // onClick: () => navigate(`/account/${accountId}/calendar`),
                // disabled:
                //   shares.value === 0 &&
                //   rubBonds.value === 0 &&
                //   usdBonds.value === 0,
              }}
            />
          </div>
        </div>
        <div className={css.portfolio_block}>
          <div className={css.portfolio_blockItem}>
            <WalletSvg />
            <strong>Вложено:</strong>
            <span>{totalDeposits.formatted}</span>
          </div>
          <div className={css.portfolio_blockItem}>
            <TicketSvg />
            <strong>Уплачено комиссий:</strong>
            <span>{totalCommissions.formatted}</span>
          </div>
          <div className={css.portfolio_blockItem}>
            <ReceiptSvg />
            <strong>Уплачено налогов:</strong>
            <span>{totalPaidTaxes.formatted}</span>
          </div>
        </div>
        <div className={css.portfolio_block}>
          <div className={css.portfolio_blockItem}>
            <ServerSvg />
            <strong>Получено всего выплат</strong>
            <span>{totalPayouts.formatted}</span>
          </div>
          <div className={css.portfolio_blockItem}>
            <CashSvg />
            <strong>Получено купонов / дивидендов</strong>
            <span>
              {totalCoupons.formatted} / {totalDividends.formatted}
            </span>
          </div>
        </div>
        <div className={css.portfolio_block}>
          <div className={css.portfolio_blockItem}>
            <PodiumSvg />
            <strong>Доходность / в год</strong>
            <span>
              {`${currentYield}%`} / {`${yearlyYield}%`}
            </span>
          </div>
        </div>
        <div className={cn(css.portfolio_block, "isActive")}>
          <div
            className={cn(css.portfolio_blockItem, "isShare")}
            // onClick={() => navigate(`/account/${accountId}/shares`)}
          >
            <SharesSvg />
            <strong>Акции:</strong>
            <span>
              <span>0</span> <span>(0%)</span>
            </span>
          </div>
          {/* {rubBonds.value !== 0 && (
            <div
              className={cn(css.portfolio_blockItem, "isBond")}
              onClick={() => navigate(`/account/${accountId}/bonds/rub`)}
            >
              <RubbondsSvg />
              <strong>Рублевые облигации:</strong>
              <span>
                <span>{rubBonds.formatt}</span>
                <span>({rubBonds.percent}%)</span>
              </span>
            </div>
          )}
          {usdBonds.value !== 0 && (
            <div
              className={cn(css.portfolio_blockItem, "isBond")}
              onClick={() => navigate(`/account/${accountId}/bonds/usd`)}
            >
              <UsdbondsSvg />
              <strong>Валютные облигации:</strong>
              <span>
                <span>{usdBonds.formatt}</span>{" "}
                <span>({usdBonds.percent}%)</span>
              </span>
            </div>
          )} */}
          {/* {etfArray &&
            !!etfArray.length &&
            etfArray.map((etf) => (
              <div
                className={cn(css.portfolio_blockItem, "isEtf")}
                onClick={() =>
                  navigate(`/account/${accountId}/etf/${etf.ticker}`)
                }
              >
                {etf.ticker === "TGLD" && <GoldetfSvg />}
                {etf.ticker === "TMOS" && <BigemitentSvg />}
                {etf.ticker !== "TGLD" && etf.ticker !== "TMOS" && <CubeSvg />}

                <strong>{etf.name}</strong>
                <span>
                  <span>{etf.formatt}</span> <span>({etf.percent}%)</span>
                </span>
              </div>
            ))} */}
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
