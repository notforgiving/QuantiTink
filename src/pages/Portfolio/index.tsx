import React, { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Container from "../../UI/components/Container";
import Button from "../../UI/components/Button";
import css from "./styles.module.scss";
import { usePortfolio } from "./hooks/usePortfolio";
import { formattedMoneySupply, getDeclensionWordMonth } from "../../utils";
import cn from "classnames";
import Goals from "../../components/Goals";
import { useGoals } from "./hooks/useGoals";
import GoalsModal from "../../components/Goals/components/GoalsModal";
import { TFAmount } from "../../types/portfolio.type";

const Portfolio: FC = () => {
  let { id: accountId } = useParams();
  const navigate = useNavigate();

  const {
    account,
    portfolio,
    amountInvestments,
    currentPrice,
    differencePercent,
    portfolioStart,
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

  return (
    <Container>
      <Button
        text="Назад"
        buttonAttributes={{
          type: "button",
          onClick: () => navigate("/"),
        }}
      />

      <div className={css.portfolio}>
        <div className={css.portfolio_data}>
          <div className={css.portfolio_info}>
            {account && (
              <div className={css.portfolio_name}>{account?.name}</div>
            )}
            {portfolio && (
              <div
                className={cn(css.portfolio_amount, {
                  _isGreen: currentPrice.value > amountInvestments.value,
                })}
              >
                <span>{currentPrice.formatt}</span>
                <span>
                  {" "}
                  ({" "}
                  {
                    formattedMoneySupply(
                      currentPrice.value - amountInvestments.value
                    ).formatt
                  }{" "}
                  / {`${differencePercent}%`})
                </span>
              </div>
            )}
          </div>
          <div className={css.portfolio_actions}>
            <div className={css.portfolio_start}>
              <span>{portfolioStart} / </span>
              <span>{`${investmentPeriod} ${getDeclensionWordMonth(
                investmentPeriod || 0
              )}`}</span>
            </div>
            <div className={css.portfolio_calendar}>
              <Button
                text="Календарь инвестора"
                buttonAttributes={{
                  type: "button",
                  onClick: () => navigate(`/account/${accountId}/calendar`),
                }}
              />
            </div>
          </div>
        </div>
        <div className={css.portfolio_grid}>
          <div className={css.portfolio_investments}>
            <strong>Вложено:</strong>
            <span>{amountInvestments.formatt}</span>
          </div>
          <div className={css.portfolio_comissions}>
            <strong>Уплачено комиссий:</strong>
            <span>{commissions.formatt}</span>
          </div>
          <div className={css.portfolio_taxes}>
            <strong>Уплачено налогов:</strong>
            <span>{taxes.formatt}</span>
          </div>
          <div className={css.portfolio_coupons}>
            <strong>Получено купонов за всё время:</strong>
            <span>{coupons.formatt}</span>
          </div>
          <div className={css.portfolio_dividends}>
            <strong>Получено дивидендов за всё время:</strong>
            <span>{dividends.formatt}</span>
          </div>
          <div
            className={css.portfolio_profitability}
            title="Без учета доходности по телу портфеля"
          >
            <strong>Текущая доходность</strong>
            <span>{`${currentProfitability}%`}</span>
          </div>
          <div
            className={css.portfolio_profitability}
            title="Без учета доходности по телу портфеля"
          >
            <strong>Годовая доходность (прогноз)</strong>
            <span>{`${(
              (currentProfitability / (investmentPeriod ?? 1)) *
              12
            ).toFixed(2)}%`}</span>
          </div>
        </div>
        <div className={css.portfolio_balance}>
          {shares.value !== 0 && (
            <div className={css.portfolio_shares}>
              <strong>Акции:</strong>
              <span>
                {shares.formatt} ({shares.percent}%)
              </span>
            </div>
          )}
          {rubBonds.value !== 0 && (
            <div className={css.portfolio_rubBonds}>
              <strong>Рублевые облигации:</strong>
              <span>
                {rubBonds.formatt} ({rubBonds.percent}%)
              </span>
            </div>
          )}
          {usdBonds.value !== 0 && (
            <div className={css.portfolio_usdBonds}>
              <strong>Валютные облигации:</strong>
              <span>
                {usdBonds.formatt} ({usdBonds.percent}%)
              </span>
            </div>
          )}
          {etfArray &&
            !!etfArray.length &&
            etfArray.map((etf) => (
              <div className={css.portfolio_etf} key={etf.name}>
                <strong>{etf.name}</strong>
                <span>
                  {etf.formatt} ({etf.percent}%)
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
    </Container>
  );
};

export default Portfolio;
