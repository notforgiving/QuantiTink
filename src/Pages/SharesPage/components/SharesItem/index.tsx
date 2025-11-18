import React, { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import cn from "classnames";
import BackHeader from "UI/components/BackHeader";
import LineBlock from "UI/components/LineBlock";
import ProfitabilityLine from "UI/components/ProfitabilityLine";

import { useShare } from "./hook/useShare";

import css from "./styles.module.scss";

const ShareItem: FC = () => {
  const { id, figi } = useParams();
  const navigate = useNavigate();
  const {
    share,
    quantity,
    expectedYield,
    currentPrice,
    paidCommissions,
    dividendsReceived,
    pnl,
    totalYield,
    totalYearlyYield,
    recommendBuyToReduceAvg,
    lastBuyOperationsUI,
  } = useShare({
    id: id ?? "",
    figi: figi ?? "",
  });

  const recommendation = recommendBuyToReduceAvg(1); // снизить среднюю на 1 рубль

  return (
    <div>
      <BackHeader
        title={share?.name ?? "Акция"}
        backCallback={() => navigate(-1)}
      />
      <LineBlock greenLine={expectedYield.value > 0}>
        <div
          className={cn(css.share, {
            _isGreen: expectedYield.value > 0,
          })}
        >
          <div className={cn(css.share__info, "isColor")}>
            <strong>Текущая цена:</strong>
            <span>
              {currentPrice.formatted} / ({expectedYield.formatted})
            </span>
          </div>
          <div className={cn(css.share__info)}>
            <strong>Количество: </strong>
            <span>{quantity} шт.</span>
          </div>
          <div className={cn(css.share__info)}>
            <strong>Уплачено комиссий: </strong>
            <span>{paidCommissions.formatted}</span>
          </div>
          <div className={cn(css.share__info)}>
            <strong>Получено дивидендов: </strong>
            <span>{dividendsReceived.formatted}</span>
          </div>
          <div
            className={cn(css.share__info, css.color, {
              _isGreen: totalYield >= 0 && totalYearlyYield >= 0,
            })}
          >
            <strong>Текущая / годовая доходность: </strong>
            <span>
              {totalYield}% / {totalYearlyYield}%
            </span>
          </div>
          <div
            className={cn(css.share__info, css.color, {
              _isGreen: pnl.total.value >= 0,
            })}
          >
            <strong>Фин результат: </strong>
            <span>{pnl.total.formatted}</span>
          </div>
          {recommendation && (
            <div className={cn(css.share__info)}>
              <span>{recommendation.message}</span>
            </div>
          )}
        </div>
      </LineBlock>
      <div className={css.share__purchases}>
        {!!lastBuyOperationsUI.length &&
          lastBuyOperationsUI.map((item) => (
            <ProfitabilityLine
              id={item.id}
              profitability={item.profitability}
              dateFormatted={item.dateFormatted}
              time={item.time}
              pricePerPurchaseLot={item.pricePerPurchaseLot}
              pricePerLotNow={item.pricePerLotNow}
              quantity={item.quantity}
              totalPurchasePrice={item.totalPurchasePrice}
              totalPriceNow={item.totalPriceNow}
              key={item.id}
            />
          ))}
      </div>
    </div>
  );
};

export default ShareItem;
