import React, { FC, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ReactComponent as CalendarSvg } from "assets/calendar.svg";
import { ReactComponent as CashSvg } from "assets/cash.svg";
import { ReactComponent as CubeSvg } from "assets/cube.svg";
import { ReactComponent as WalletSvg } from "assets/ionicons/icon2.svg";
import { ReactComponent as PodiumSvg } from "assets/podium.svg";
import { ReactComponent as ReceiptSvg } from "assets/receipt.svg";
import { ReactComponent as ServerSvg } from "assets/server.svg";
import { ReactComponent as SharesSvg } from "assets/shares.svg";
import { ReactComponent as TicketSvg } from "assets/ticket.svg";
import cn from "classnames";
import BackHeader from "UI/components/BackHeader";
import Button from "UI/components/Button";
import GoalProgress from "UI/components/GoalProgress";
import Goals from "UI/components/Goals";
import { useGoals } from "UI/components/Goals/hooks/useGoals";

import { pluralize } from "utils/usePluralize";

import { useAccount } from "./hook/useAccount";

import css from "./styles.module.scss";

const AccountPageMakeup: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // Длина линии целей
  const SIZE_LINE = 15;
  const {
    account,
    freeAccoutnMoney,
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
    totalYield,
    totalYearlyYield,
    portfolioShare,
    portfolioBonds,
    portfolioEtf,
  } = useAccount(id || "");

  const goalsProps = useMemo(() => {
    if (!portfolioShare || !portfolioBonds || !portfolioEtf) return null;

    return {
      account, // 👈 добавляем
      shares: portfolioShare,
      bonds: Object.entries(portfolioBonds),
      etfs: Object.entries(portfolioEtf),
    };
  }, [portfolioShare, portfolioBonds, portfolioEtf, account]);

  const goalsUi = useGoals({
    goalsProps,
    SIZE_LINE,
  });

  const [flipped, setFlipped] = useState(false);

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
            {!!freeAccoutnMoney && (
              <div
                className={cn(css.freeValue, {
                  isOpen: flipped,
                })}
                onClick={() => setFlipped(!flipped)}
              >
                <div className={css.freeValue_inner}>
                  <div className={css.freeValue_front}>Свободные средства</div>
                  <div className={css.freeValue_back}>
                    {freeAccoutnMoney.formatted}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className={css.portfolio_actions}>
            {accountAge && (
              <div className={css.portfolio_start}>
                {accountAge.years() !== 0 &&
                  pluralize(accountAge.years(), "год", "года", "лет")}{" "}
                {pluralize(accountAge.months(), "месяц", "месяца", "месяцев")}
              </div>
            )}
            {portfolioBonds && Object.entries(portfolioBonds).length !== 0 && (
              <Button
                text=""
                icon={<CalendarSvg />}
                buttonAttributes={{
                  type: "button",
                  onClick: () => navigate(`/${id}/calendar`),
                }}
              />
            )}
          </div>
        </div>
        <div className={css.portfolio_block}>
          <div className={css.portfolio_blockItem}>
            <WalletSvg />
            <strong>Вложено:</strong>
            <span>{totalDeposits.formatted}</span>
          </div>
          {totalCommissions.value !== 0 && (
            <div className={css.portfolio_blockItem}>
              <TicketSvg />
              <strong>Уплачено комиссий:</strong>
              <span>{totalCommissions.formatted}</span>
            </div>
          )}
          {totalPaidTaxes.value !== 0 && (
            <div className={css.portfolio_blockItem}>
              <ReceiptSvg />
              <strong>Уплачено налогов:</strong>
              <span>{totalPaidTaxes.formatted}</span>
            </div>
          )}
        </div>
        {(totalPayouts.value !== 0 ||
          totalCoupons.value !== 0 ||
          totalDividends.value !== 0) && (
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
            <div className={css.portfolio_blockItem}>
              <PodiumSvg />
              <strong>Доходность / в год</strong>
              <span>
                {`${currentYield}%`} / {`${yearlyYield}%`}
              </span>
            </div>
          </div>
        )}
        <div className={css.portfolio_block}>
          <div className={css.portfolio_blockItem}>
            <PodiumSvg />
            <strong>Общая доходность / годовая</strong>
            <span>
              {`${totalYield}%`} / {`${totalYearlyYield}%`}
            </span>
          </div>
        </div>
        <div className={cn(css.portfolio_block, "isActive")}>
          {portfolioShare.percent !== 0 && (
            <div
              className={cn(css.portfolio_blockItem, "isShare")}
              onClick={() => navigate(`/${account?.id}/shares`)}
              title={goalsUi["shares"].amount.formatted}
            >
              <SharesSvg />
              <strong>Акции:</strong>
              <span
                className={cn(css.blockItem__value, {
                  isGoal: !!goalsUi["shares"],
                })}
              >
                {!!goalsUi["shares"] && (
                  <GoalProgress
                    size={goalsUi["shares"].size}
                    loading={!goalsUi["shares"]}
                    total={SIZE_LINE}
                  />
                )}
                <span>{portfolioShare.value.formatted}</span>{" "}
                <span>({portfolioShare.percent}%) </span>
              </span>
            </div>
          )}
          {portfolioBonds &&
            Object.entries(portfolioBonds).map(([key, bond]) => {
              const goal = goalsUi[key];
              return (
                <div
                  className={cn(css.portfolio_blockItem, "isBond")}
                  onClick={() => navigate(`/${account?.id}/bonds/${key}`)}
                  key={key}
                  title={goal.amount.formatted}
                >
                  {bond.icon}
                  <strong>{bond.name}</strong>
                  <span
                    className={cn(css.blockItem__value, {
                      isGoal: !!goal,
                    })}
                  >
                    {!!goal && (
                      <GoalProgress
                        size={goalsUi[key].size}
                        loading={!goalsUi[key]}
                        total={SIZE_LINE}
                      />
                    )}
                    <span>{bond.value.formatted}</span>
                    <span>({bond.percent}%)</span>
                  </span>
                </div>
              );
            })}
          {portfolioEtf &&
            Object.entries(portfolioEtf).map(([key, etf]) => {
              const goal = goalsUi[key];
              return (
                <div
                  className={cn(css.portfolio_blockItem, "isBond")}
                  onClick={() => navigate(`/${account?.id}/etf/${key}`)}
                  key={key}
                  title={goal.amount.formatted}
                >
                  <CubeSvg />
                  <strong>Фонд {etf.name}</strong>
                  <span
                    className={cn(css.blockItem__value, {
                      isGoal: !!goal,
                    })}
                  >
                    {!!goal && (
                      <GoalProgress
                        size={goal.size}
                        loading={!goal}
                        total={SIZE_LINE}
                      />
                    )}
                    <span>{etf.value.formatted}</span>
                    <span>({etf.percent}%)</span>
                  </span>
                </div>
              );
            })}
        </div>
        <Goals
          shares={portfolioShare.percent !== 0}
          bond={portfolioBonds && Object.entries(portfolioBonds)}
          etfs={portfolioEtf && Object.entries(portfolioEtf)}
          account={account}
        />
      </div>
    </div>
  );
};

export default AccountPageMakeup;
