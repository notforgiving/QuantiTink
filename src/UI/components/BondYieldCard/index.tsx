import React, { FC, useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { IoCashOutline, IoContract, IoExpand } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { removeFavoriteBond } from "api/features/favoritesBonds/favoritesBondsSlice";
import cn from "classnames";
import { TCalculatedBond } from "Pages/CalcPage/hooks/useCalcBonds";

import { formatMoney } from "utils/formatMoneyAmount";

import css from "./styles.module.scss";

export type TBondYieldCardProps = TCalculatedBond;

const BondYieldCard: FC<TBondYieldCardProps> = (bond) => {
  const [collapse, setCollapse] = useState<boolean>(false);
  const [incomeTax, setIncomeTax] = useState(0);
  const toggleTax = () => setIncomeTax((prev) => (prev === 0 ? 13 : 0));
  const dispatch = useDispatch();
  const handleRemove = (isin: string) => {
    dispatch(removeFavoriteBond(isin));
  };

  const netCouponTax = formatMoney(
    (incomeTax * bond.totalCouponesValue.value) / 100
  );
  const netRepaymentTax = bond.aboveNominal
    ? formatMoney(0)
    : formatMoney((incomeTax * bond.marginFromRepayment.value) / 100);

  const netMarginWithTax = formatMoney(
    bond.nominalValue.value +
      bond.totalCouponesValue.value -
      netCouponTax.value -
      netRepaymentTax.value
  );

  const netProfitWithTax = formatMoney(
    netMarginWithTax.value - bond.currentPriceWithComission.value
  );
  const annualProfitabilityWithTax = (
    (netProfitWithTax.value / bond.currentPriceWithComission.value) *
    (365 / bond.daysToMaturity) *
    100
  ).toFixed(1);

  return (
    <div className={css.card}>
      <div className={css.card__body}>
        <div className={css.card__actions}>
          <div className={css.card__actions_top}>
            {collapse ? (
              <IoContract
                onClick={() => setCollapse(false)}
                size={24}
                title="Скрыть данные"
              />
            ) : (
              <IoExpand
                onClick={() => setCollapse(true)}
                size={24}
                title="Показать данные"
              />
            )}
            <IoCashOutline
              onClick={toggleTax}
              title={
                incomeTax === 0
                  ? "Показать с учетом налога"
                  : "Показать без учета налога"
              }
              className={cn(css.card__tax, {
                isOpacity: incomeTax === 0,
              })}
            />
          </div>
          <FiTrash2
            size={24}
            title="Удалить"
            onClick={() => handleRemove(bond.isin)}
          />
        </div>
        <a
          className={css.card__name}
          target="_blank"
          rel="noreferrer"
          href={`https://www.tbank.ru/invest/bonds/${bond.isin}/`}
        >
          {bond.name} ({bond.floatingCouponFlag ? "Ф" : "ПК"})
        </a>
        <div
          className={cn(css.card__line, "hiddble", {
            isShow: collapse,
          })}
        >
          <span>Комиссия брокера, %</span>
          <span>{bond.comission}%</span>
        </div>
        <div
          className={cn(css.card__line, "hiddble", {
            isShow: collapse,
          })}
        >
          <span>Налог на доход, %</span>
          <span>13,00%</span>
        </div>
        <div
          className={cn(css.card__line, "hiddble", {
            isShow: collapse,
          })}
        >
          <span>Номинал облигации, руб</span>
          <span>{bond.nominalValue.formatted}</span>
        </div>
        <div
          className={cn(css.card__line, "hiddble", {
            isShow: collapse,
          })}
        >
          <span>Стоимость облигации, %</span>
          <span>{bond.currentPercentPrice}%</span>
        </div>
        <div
          className={cn(css.card__line, {
            isBold: collapse,
          })}
        >
          <span>Купонный доход на одну облигацию, руб</span>
          <span>{bond.payOneBond.formatted}</span>
        </div>
        <div
          className={cn(css.card__line, {
            isBold: collapse,
          })}
        >
          <span>Купонная доходность, %</span>
          <span>{bond.couponeYeild}%</span>
        </div>
        <div
          className={cn(css.card__line, "hiddble", {
            isShow: collapse,
          })}
        >
          <span>Количество купонных выплат до погашения</span>
          <span>{bond.couponesFromMaturityDate}</span>
        </div>
        <div
          className={cn(css.card__line, "hiddble", {
            isShow: collapse,
          })}
        >
          <span>НКД</span>
          <span>{bond.nkd.formatted}</span>
        </div>
        <div
          className={cn(css.card__line, "hiddble", {
            isBold: false,
            isShow: collapse,
          })}
        >
          <span>Дата погашения</span>
          <span>{bond.formatMaturityDate}</span>
        </div>
        <div
          className={cn(css.card__line, "hiddble", {
            isShow: collapse,
          })}
        >
          <span>Дней до погашения</span>
          <span>{bond.daysToMaturity}</span>
        </div>
        <div
          className={cn(css.card__line, {
            isBold: collapse,
          })}
        >
          <span>Лет до погашения</span>
          <span>{bond.yearsToMaturity}</span>
        </div>
        <div
          className={cn(css.card__line, "hiddble", {
            isShow: collapse,
          })}
        >
          <span>Комиссия за покупку</span>
          <span>{bond.comissionFullPrice.formatted}</span>
        </div>
        <div
          className={cn(css.card__line, "hiddble", {
            isShow: collapse,
          })}
        >
          <span>Цена самих облигаций</span>
          <span>{bond.currentFormatPrice.formatted}</span>
        </div>
        <div
          className={cn(css.card__line, "hiddble", {
            isBold: true,
            isShow: collapse,
          })}
        >
          <span>Полная цена покупки</span>
          <span>{bond.currentPriceWithComission.formatted}</span>
        </div>
        <div
          className={cn(css.card__line, "hiddble", {
            isShow: collapse,
          })}
        >
          <span>Цена покупки выше номинала</span>
          <span>{bond.aboveNominal ? "Да" : "Нет"}</span>
        </div>
        <div
          className={cn(css.card__line, "hiddble", {
            isShow: collapse,
          })}
        >
          <span>Суммарно получим купонами</span>
          <span>{bond.totalCouponesValue.formatted}</span>
        </div>
        <div
          className={cn(css.card__line, "hiddble", {
            isShow: collapse,
          })}
        >
          <span>Маржа от погашения</span>
          <span>{bond.marginFromRepayment.formatted}</span>
        </div>
        <div
          className={cn(css.card__line, "hiddble", {
            isShow: collapse,
          })}
        >
          <span>Налог на купоны</span>
          <span>{netCouponTax.formatted}</span>
        </div>
        <div
          className={cn(css.card__line, "hiddble", {
            isShow: collapse,
          })}
        >
          <span>Налог на погашение</span>
          <span>{netRepaymentTax.formatted}</span>
        </div>
        <div
          className={cn(css.card__line, "hiddble", {
            isShow: collapse,
          })}
        >
          <span>Погашение</span>
          <span>{bond.nominalValue.formatted}</span>
        </div>
        <div
          className={cn(css.card__line, {
            isBold: collapse,
          })}
        >
          <span>Чистая сумма в итоге</span>
          <span>{netMarginWithTax.formatted}</span>
        </div>
      </div>
      <div className={css.card__result}>
        <div className={css.card__result_item}>
          <strong>{netProfitWithTax.formatted}</strong>
          <span>Чистая прибыль</span>
        </div>
        <div className={css.card__result_item}>
          <strong>{annualProfitabilityWithTax}%</strong>
          <span>Годовая доходность</span>
        </div>
      </div>
    </div>
  );
};

export default BondYieldCard;
