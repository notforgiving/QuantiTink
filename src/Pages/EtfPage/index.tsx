import React, { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import cn from "classnames";
import BackHeader from "UI/components/BackHeader";
import Input from "UI/components/Input";
import LineBlock from "UI/components/LineBlock";
import ProfitabilityLine from "UI/components/ProfitabilityLine";

import { pluralize } from "utils/usePluralize";

import { useEtf } from "./hooks/useEtf";

import css from "./styles.module.scss";

const EtfPage: FC = () => {
  const { id, ticker } = useParams();
  const navigate = useNavigate();
  const {
    name,
    currentPrice,
    expectedYield,
    firstPurchaseAge,
    currentPercentageYield,
    annualPercentageYield,
    recommendBuyToReduceAvg,
    operations,
    incomeTax,
    setIncomeTax,
  } = useEtf(id || "0", ticker || "0");

  const recommendation = recommendBuyToReduceAvg(1); // снизить среднюю на 1 рубль

  return (
    <div>
      <BackHeader title={name} backCallback={() => navigate(`/${id}`)} />
      <LineBlock greenLine={expectedYield !== null && expectedYield.value > 0}>
        <div
          className={cn(css.etf, {
            _isGreen: expectedYield && expectedYield.value > 0,
          })}
        >
          <div className={css.etf__header}>
            <div className={css.etf__current}>
              {currentPrice && (
                <div className={css.etf__price}>{currentPrice.formatted}</div>
              )}
              <div className={css.etf__profitability}>
                {expectedYield && <strong>{expectedYield.formatted}</strong>}
                <span>{currentPercentageYield}%</span>
              </div>
            </div>
            {firstPurchaseAge && (
              <div className={css.etf__life}>
                {firstPurchaseAge.years() !== 0 &&
                  pluralize(
                    firstPurchaseAge.years(),
                    "год",
                    "года",
                    "лет"
                  )}{" "}
                {pluralize(
                  firstPurchaseAge.months(),
                  "месяц",
                  "месяца",
                  "месяцев"
                )}
              </div>
            )}
          </div>
          <div
            className={cn(css.etf__info, css.color, {
              _isGreen: expectedYield && expectedYield.value > 0,
            })}
          >
            <strong>Годовая доходность:</strong>
            <span>{annualPercentageYield}%</span>
          </div>
          {/* {expectedYield && (
            <div
              className={cn(css.etf__info, css.color, {
                _isGreen: expectedYield && expectedYield.value > 0,
              })}
            >
              <strong>Фин результат:</strong>
              <span>{expectedYield.formatted}</span>
            </div>
          )} */}
          {recommendation && (
            <div className={cn(css.share__info)}>
              <span>{recommendation.message}</span>
            </div>
          )}
        </div>
      </LineBlock>
      <div className={css.etf__toggle}>
        <Input
          label="Учитывать налог на прибыль"
          leftLabel
          inputAttributes={{
            type: "checkbox",
            checked: incomeTax,
            onClick: () => setIncomeTax(!incomeTax),
          }}
        />
      </div>
      <div className={css.etf__purchases}>
        {operations &&
          operations.map((item) => (
            <ProfitabilityLine
              key={item.totalPurchasePrice?.value}
              profitability={item.profitability}
              dateFormatted={item.dateFormatted}
              time={item.time}
              pricePerPurchaseLot={item.pricePerPurchaseLot}
              pricePerLotNow={item.pricePerLotNow}
              quantity={item.quantity}
              totalPurchasePrice={item.totalPurchasePrice}
              totalPriceNow={item.totalPriceNow}
            />
          ))}
      </div>
    </div>
  );
};

export default EtfPage;
