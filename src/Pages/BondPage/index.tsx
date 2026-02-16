import React, { FC } from "react";
import { FiExternalLink } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { ReactComponent as ArrowSvg } from "assets/arrow-forward.svg";
import cn from "classnames";
import BackHeader from "UI/components/BackHeader";
import LineBlock from "UI/components/LineBlock";
import PriceLine from "UI/components/PriceLine";

import { pluralize } from "utils/usePluralize";

import { useBondPage } from "./hook/useBondPage";

import css from "./styles.module.scss";

const BondPage: FC = () => {
  const { id, currency, figi } = useParams();
  const navigate = useNavigate();
  const {
    name,
    quantity,
    currentPrice,
    expectedYield,
    currentNkd,
    paidCommissions,
    couponsReceived,
    averagePrice,
    currentPriceOneLot,
    averagePositionPrice,
    priceIncreasePercent,
    currentPercentageYield,
    annualPercentageYield,
    operations,
    isin,
  } = useBondPage(id || "0", currency || "rub", figi || "");

  return (
    <div>
      <BackHeader title={name} backCallback={() => navigate(-1)} />
      <LineBlock
        greenLine={expectedYield.value > 0}
        className={css.bond__wrapper}
      >
        <div
          className={cn(css.bond, {
            _isGreen: expectedYield.value > 0,
          })}
        >
          {isin && (
            <a
              href={`https://www.tbank.ru/invest/bonds/${isin}`}
              target="_blank"
              rel="noopener noreferrer"
              className={css.bond__link}
            >
              <FiExternalLink />
            </a>
          )}

          <div className={cn(css.bond__info, "isColor")}>
            <strong>Текущая цена:</strong>
            <span>
              {averagePositionPrice.formatted}
              <ArrowSvg /> {currentPrice.formatted} / ({priceIncreasePercent}%)
            </span>
          </div>
          <div className={cn(css.bond__info)}>
            <strong>Средняя цена:</strong>
            <span>{averagePrice.formatted}</span>
          </div>
          <div className={cn(css.bond__info)}>
            <strong>Накопленный НКД:</strong>
            <span>{currentNkd.formatted}</span>
          </div>
          <div className={cn(css.bond__info)}>
            <strong>Количество: </strong>
            <span>{quantity} шт.</span>
          </div>
          <div className={cn(css.bond__info)}>
            <strong>Уплачено комиссий: </strong>
            <span>{paidCommissions.formatted}</span>
          </div>
          <div className={cn(css.bond__info)}>
            <strong>Получено купонов: </strong>
            <span>{couponsReceived.formatted}</span>
          </div>
          <div
            className={cn(css.bond__info, css.color, {
              _isGreen: expectedYield.value > 0,
            })}
            title="Текущая доходность с учетом КОМИССИЙ И ТЕЛА, а годовая без учета ТЕЛА"
          >
            <strong>Текущая / годовая доходность: </strong>
            <span>
              {currentPercentageYield}% / {annualPercentageYield}%
            </span>
          </div>
        </div>
      </LineBlock>
      <div className={css.bond__purchases}>
        {operations &&
          operations.map((item, index) => (
            <LineBlock
              greenLine={expectedYield.value > 0}
              key={`${item.date}${index}`}
            >
              <div
                className={cn(css.bond__item, {
                  _isGreen: Number(item.yield) > 0,
                })}
              >
                <div className={css.bond__header}>
                  <span>{item.date}</span>
                  <span title="Прошло времени с даты покупки">
                    {pluralize(Number(item.time), "месяц", "месяца", "месяцев")}
                  </span>
                </div>
                <div className={css.bond__body}>
                  <div className={css.bond__quantity}>
                    <span>Количество: </span>
                    <span>{item.quantity} шт</span>
                  </div>
                  <div className={css.bond__oneLot}>
                    <span>Цена покупки / Текущая цена: </span>
                    <span>
                      <PriceLine
                        leftPrice={item.oneLote}
                        rightPrice={currentPriceOneLot}
                        color={
                          item.oneLote.value < currentPriceOneLot.value
                            ? "GREEN"
                            : "YELLOW"
                        }
                      />
                    </span>
                  </div>
                  <div
                    className={css.bond__yield}
                    title="С учетом потраченных комиссий на покупку"
                  >
                    <span>Ткущая доходность</span>
                    <strong>
                      <span className={css.small}>
                        ({item.coupons.formatted})
                      </span>{" "}
                      {item.yield}%
                    </strong>
                  </div>
                </div>
              </div>
            </LineBlock>
          ))}
      </div>
    </div>
  );
};

export default BondPage;
