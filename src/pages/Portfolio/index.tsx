import React, { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../UI/components/Button";
import css from "./styles.module.scss";
import { usePortfolio } from "./hooks/usePortfolio";
import { formattedMoneySupply, getDeclensionWordMonth } from "../../utils";
import cn from "classnames";
import Goals from "../../components/Goals";
import { useGoals } from "./hooks/useGoals";
import GoalsModal from "../../components/Goals/components/GoalsModal";
import { TFAmount } from "../../types/portfolio.type";
import { ReactComponent as CalendarSvg } from "assets/calendar.svg";
import { ReactComponent as WalletSvg } from "assets/ionicons/icon2.svg";
import { ReactComponent as TicketSvg } from "assets/ticket.svg";
import { ReactComponent as ReceiptSvg } from "assets/receipt.svg";
import { ReactComponent as ServerSvg } from "assets/server.svg";
import { ReactComponent as CashSvg } from "assets/cash.svg";
import { ReactComponent as PodiumSvg } from "assets/podium.svg";
import { ReactComponent as NutritionSvg } from "assets/nutrition.svg";
import { ReactComponent as GitBranchSvg } from "assets/git-branch.svg";
import { ReactComponent as GitNetworkSvg } from "assets/git-network.svg";
import { ReactComponent as CubeSvg } from "assets/cube.svg";

const Portfolio: FC = () => {
  let { id: accountId } = useParams();
  const navigate = useNavigate();
  const {
    account,
    portfolio,
    amountInvestments,
    currentPrice,
    differencePercent,
    investmentPeriod,
    commissions,
    taxes,
    coupons,
    dividends,
    currentProfitability,
    shares,
    rubBonds,
    usdBonds,
    etfArray,
  } = usePortfolio({
    accountId: accountId || "0",
  });
  const {
    openTargets,
    setOpenTargets,
    formik,
    error,
    validateFillFields,
    openPanel,
    setOpenPanel,
    freeAmountMoney,
    setFreeAmountMoney,
    resultValues,
  } = useGoals({
    accountId: accountId || "0",
    totalAmountPortfolio: portfolio?.totalAmountPortfolio || ({} as TFAmount),
    totalAmountCurrencies: portfolio?.totalAmountCurrencies || ({} as TFAmount),
    shares,
    rubBonds,
    usdBonds,
    etfArray,
  });

  const forecastYear =
    currentProfitability !== 0
      ? (currentProfitability / (investmentPeriod ?? 1)) * 12
      : 0;
  return (
    <div>
      <div
        className={cn(css.portfolio, {
          isGreen: currentPrice.value > amountInvestments.value,
        })}
      >
        {account && <div className={css.portfolio__title}>{account?.name}</div>}
        <div className={css.portfolio_data}>
          {portfolio && (
            <div
              className={cn(css.portfolio_amount, {
                _isGreen: currentPrice.value > amountInvestments.value,
              })}
            >
              <strong>{currentPrice.formatt}</strong>
              <span>
                {
                  formattedMoneySupply(
                    currentPrice.value - amountInvestments.value
                  ).formatt
                }{" "}
                / {`${differencePercent}%`}
              </span>
            </div>
          )}
          <div className={css.portfolio_actions}>
            <div className={css.portfolio_start}>
              {`${investmentPeriod} ${getDeclensionWordMonth(
                investmentPeriod || 0
              )}`}
            </div>
            <Button
              text=""
              icon={<CalendarSvg />}
              buttonAttributes={{
                type: "button",
                onClick: () => navigate(`/account/${accountId}/calendar`),
                disabled:
                  shares.value === 0 &&
                  rubBonds.value === 0 &&
                  usdBonds.value === 0,
              }}
            />
          </div>
        </div>

        <div className={css.portfolio_block}>
          <div className={css.portfolio_blockItem}>
            <WalletSvg />
            <strong>Вложено:</strong>
            <span>{amountInvestments.formatt}</span>
          </div>
          <div className={css.portfolio_blockItem}>
            <TicketSvg />
            <strong>Уплачено комиссий:</strong>
            <span>{commissions.formatt}</span>
          </div>
          <div className={css.portfolio_blockItem}>
            <ReceiptSvg />
            <strong>Уплачено налогов:</strong>
            <span>{taxes.formatt}</span>
          </div>
        </div>
        <div className={css.portfolio_block}>
          <div className={css.portfolio_blockItem}>
            <ServerSvg />
            <strong>Получено всего выплат</strong>
            <span>
              {
                formattedMoneySupply(Number(coupons.value + dividends.value))
                  .formatt
              }
            </span>
          </div>
          <div className={css.portfolio_blockItem}>
            <CashSvg />
            <strong>Получено купонов / дивидендов</strong>
            <span>
              {coupons.formatt} / {dividends.formatt}
            </span>
          </div>
        </div>
        <div className={css.portfolio_block}>
          <div className={css.portfolio_blockItem}>
            <PodiumSvg />
            <strong>Доходность / в год</strong>
            <span>
              {`${currentProfitability}%`} /{" "}
              {forecastYear !== 0 ? `${forecastYear.toFixed(2)}%` : "0%"}
            </span>
          </div>
        </div>
        <div className={cn(css.portfolio_block, "isActive")}>
          {shares.value !== 0 && (
            <div
              className={cn(css.portfolio_blockItem, "isShare")}
              onClick={() => navigate(`/account/${accountId}/shares`)}
            >
              <NutritionSvg />
              <strong>Акции:</strong>
              <span>
                <span>{shares.formatt}</span> / <span>{shares.percent}%</span>
              </span>
            </div>
          )}
          {rubBonds.value !== 0 && (
            <div
              className={cn(css.portfolio_blockItem, "isBond")}
              onClick={() => navigate(`/account/${accountId}/bonds/rub`)}
            >
              <GitBranchSvg />
              <strong>Рублевые облигации:</strong>
              <span>
                <span>{rubBonds.formatt}</span> /
                <span>{rubBonds.percent}%</span>
              </span>
            </div>
          )}
          {usdBonds.value !== 0 && (
            <div
              className={cn(css.portfolio_blockItem, "isBond")}
              onClick={() => navigate(`/account/${accountId}/bonds/usd`)}
            >
              <GitNetworkSvg />
              <strong>Валютные облигации:</strong>
              <span>
                <span>{usdBonds.formatt}</span> <span>{usdBonds.percent}%</span>
              </span>
            </div>
          )}
          {etfArray &&
            !!etfArray.length &&
            etfArray.map((etf) => (
              <div
                className={cn(css.portfolio_blockItem, "isEtf")}
                onClick={() => navigate(`/account/${accountId}/bonds/usd`)}
              >
                <CubeSvg />
                <strong>{etf.name}</strong>
                <span>
                  <span>{etf.formatt}</span> <span>{etf.percent}%</span>
                </span>
              </div>
            ))}
        </div>

        <Button
          text="Докупить"
          className={css.portfolio_rebalance}
          buttonAttributes={{
            onClick: () => {
              validateFillFields();
            },
          }}
        />
        <GoalsModal
          openPanel={openPanel}
          setOpenPanel={setOpenPanel}
          freeAmountMoney={freeAmountMoney}
          setFreeAmountMoney={setFreeAmountMoney}
          portfolioAmountMoney={
            portfolio?.totalAmountCurrencies || ({} as TFAmount)
          }
          resultValues={resultValues}
        />
      </div>
      <Goals
        shares={shares.value !== 0}
        rubBonds={rubBonds.value !== 0}
        usdBonds={usdBonds.value !== 0}
        etfs={etfArray}
        openTargets={openTargets}
        setOpenTargets={setOpenTargets}
        formik={formik}
        error={error}
      />
    </div>
  );
};

export default Portfolio;
