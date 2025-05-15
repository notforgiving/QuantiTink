import React, { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Container from "../../UI/components/Container";
import Button from "../../UI/components/Button";
import css from "./styles.module.scss";
import { usePortfolio } from "./hooks/usePortfolio";
import { formattedMoneySupply, getDeclensionWordMonth } from "../../utils";
import cn from "classnames";

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
  } = usePortfolio({
    accountId: accountId || "0",
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
            <span>{`${(Number(currentProfitability) / (investmentPeriod ?? 1) * 12).toFixed(2)}%`}</span>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Portfolio;
