import React, { FC, useState } from "react";
import css from "../styles.module.scss";
import cn from "classnames";
import { IBondsTable } from "../hook/useCalcBonds";
import Button from "UI/components/Button";

interface IBondProps {
  itemData: IBondsTable;
  handleRemoveBond: (isin: string) => void;
  handleChangeValueBonds: (isin: string, newValue: number) => void;
  handleChangeCurrentPrice: (isin: string, newPrice: number) => void;
}

const Bond: FC<IBondProps> = ({
  itemData,
  handleRemoveBond,
  handleChangeValueBonds,
  handleChangeCurrentPrice,
}) => {
  const [showAllData, setShowAllData] = useState<boolean>(false);
  const [showMenu, setShowMenu] = useState<boolean>(false);

  const handleClickBond = () => {
    setShowMenu(!showMenu);
  };
  return (
    <div
      className={cn(css.bond, {
        isShowMenu: showMenu,
      })}
      onClick={handleClickBond}
    >
      <div className={css.bond_actions}>
        <Button
          text={
            !showAllData ? "Показать полную таблицу" : "Скрыть лишние данные"
          }
          className={css.saveChanges}
          buttonAttributes={{
            onClick: () => setShowAllData(!showAllData),
          }}
        />
        <Button
          text="Удалить"
          className={css.remove}
          buttonAttributes={{
            onClick: () => handleRemoveBond(itemData.isin),
          }}
        />
      </div>
      <div className={css.bond__inner}>
        <a
          href={`https://www.tbank.ru/invest/bonds/${itemData.isin}/`}
          target="_blank"
          className={css.bond_name}
          rel="noreferrer"
        >
          {itemData.name} ({itemData.typeOfBond === "Плавающий" ? "Ф" : "ПК"})
        </a>
        <div
          className={cn(css.bond_row, "readOnly", {
            _isHide: !showAllData,
          })}
        >
          <strong>Комиссия брокера, %</strong>
          <span>{itemData.comission}%</span>
        </div>
        <div
          className={cn(css.bond_row, "readOnly", {
            _isHide: !showAllData,
          })}
        >
          <strong>Налог на доход, %</strong>
          <span>13,00%</span>
        </div>
        <div className={cn(css.bond_row, "readOnly")}>
          <strong>Номинал облигации, руб</strong>
          <span>{itemData.formattInitialNominal.formatt}</span>
        </div>
        <div className={cn(css.bond_row, "isWrite")}>
          <strong>Количество облигаций, шт</strong>
          <input
            type="number"
            placeholder="Кол-во"
            name="value"
            value={itemData.value}
            onChange={(e) =>
              handleChangeValueBonds(itemData.isin, Number(e.target.value))
            }
          />
        </div>
        <div
          className={cn(css.bond_row, "isWrite", {
            _isWrongPrice:
              itemData.priceInPercent === 100 || itemData.priceInPercent === 0,
          })}
        >
          <strong>Стоимость облигации, %</strong>
          <input
            type="number"
            placeholder="0%"
            name="priceInPercent"
            value={itemData.priceInPercent}
            onChange={(e) =>
              handleChangeCurrentPrice(itemData.isin, Number(e.target.value))
            }
          />
        </div>
        <div className={cn(css.bond_row, "isWrite")}>
          <strong>Купонный доход на одну облигацию, руб</strong>
          <span>{itemData.payOneBond.formatt}</span>
        </div>
        <div
          className={cn(css.bond_row, "isWrite", {
            _isHide: !showAllData,
          })}
        >
          <strong>Количество купонных выплат до погашения</strong>
          <span>{itemData.eventsLength}</span>
        </div>
        <div className={cn(css.bond_row, "isWrite")}>
          <strong>НКД</strong>
          <span>{itemData.nkd.formatt}</span>
        </div>
        <div className={cn(css.bond_row, "isWrite")}>
          <strong>Дата погашения</strong>
          <span>{itemData.maturityDate.formatt}</span>
        </div>

        <div
          className={cn(css.bond_row, "forbidden", {
            _isHide: !showAllData,
          })}
        >
          <strong>Дней до погашения</strong>
          <span>{itemData.daysToMaturity}</span>
        </div>
        <div
          className={cn(css.bond_row, "forbidden", "weight", {
            _isLightGreen: Number(itemData.yearsToMaturity) >= 3,
          })}
        >
          <strong>Лет до погашения</strong>
          <span>{itemData.yearsToMaturity}</span>
        </div>
        <div
          className={cn(css.bond_row, "forbidden", {
            _isHide: !showAllData,
          })}
        >
          <strong>Комиссия за покупку</strong>
          <span>{itemData.commissionForPurchase}</span>
        </div>
        <div
          className={cn(css.bond_row, "forbidden", {
            _isHide: !showAllData,
          })}
        >
          <strong>Цена самих облигаций</strong>
          <span>{itemData.priceInCurrencyView.formatt}</span>
        </div>
        <div
          className={cn(css.bond_row, "forbidden", {
            _isHide: !showAllData,
          })}
        >
          <strong>Уплаченного НКД</strong>
          <span>{itemData.totalNkd.formatt}</span>
        </div>
        <div className={cn(css.bond_row, "forbidden", "weight")}>
          <strong>Полная цена покупки</strong>
          <span>{itemData.fullPrice.formatt}</span>
        </div>
        <div className={cn(css.bond_row, "forbidden", "weight")}>
          <strong>С одной выплаты буду получать</strong>
          <span>{itemData.payOneBondTotal.formatt}</span>
        </div>
        <div
          className={cn(css.bond_row, "forbidden", {
            _isHide: !showAllData,
          })}
        >
          <strong>Цена покупки выше номинала</strong>
          <span>{itemData.aboveNominal ? "Да" : "Нет"}</span>
        </div>
        <div className={cn(css.bond_row, "forbidden")}>
          <strong>Суммарно получим купонами</strong>
          <span>{itemData.sumAllCouponsReceived.formatt}</span>
        </div>
        <div className={cn(css.bond_row, "forbidden")}>
          <strong>Маржа от погашения</strong>
          <span>{itemData.marginFromBondRepayment.formatt}</span>
        </div>
        <div
          className={cn(css.bond_row, "forbidden", {
            _isHide: !showAllData,
          })}
        >
          <strong>Налог на купоны</strong>
          <span>{itemData.couponTax.formatt}</span>
        </div>
        <div
          className={cn(css.bond_row, "forbidden", {
            _isHide: !showAllData,
          })}
        >
          <strong>Налог на погашение</strong>
          <span>{itemData.taxOnBondRepayment.formatt}</span>
        </div>
        <div className={cn(css.bond_row, "forbidden")}>
          <strong>Погашение</strong>
          <span>{itemData.bondRepaymentAmount.formatt}</span>
        </div>
        <div className={cn(css.bond_row, "forbidden")}>
          <strong>Чистая сумма в итоге</strong>
          <span>{itemData.netAmountInTheEnd.formatt}</span>
        </div>
      </div>
      <div className={css.bond__result}>
        <div className={cn(css.bond_row, "isResult")}>
          <span>{itemData.netProfit.formatt}</span>
          <strong>Чистая прибыль</strong>
        </div>
        <div className={cn(css.bond_row, "isResult")}>
          <span>{itemData.annualProfitability}%</span>
          <strong>Годовая доходность</strong>
        </div>
      </div>
    </div>
  );
};

export default Bond;
