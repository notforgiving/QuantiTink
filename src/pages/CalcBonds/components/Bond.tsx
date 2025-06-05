import React, { FC } from "react";
import css from "../styles.module.scss";
import cn from "classnames";
import { IBondsTable } from "../hook/useCalcBonds";

interface IBondProps {
  itemData: IBondsTable;
  handleRemoveBond: (isin: string) => void;
  handleChangeValueBonds: (isin: string, newValue: number) => void;
}

const Bond: FC<IBondProps> = ({
  itemData,
  handleRemoveBond,
  handleChangeValueBonds,
}) => {
  return (
    <div className={css.bond}>
      <div
        className={css.remove}
        onClick={() => handleRemoveBond(itemData.isin)}
      >
        Удалить
      </div>
      <a
        href={`https://www.tbank.ru/invest/bonds/${itemData.isin}/`}
        target="_blank"
        className={cn(css.bond_name, css.bond_row)}
        rel="noreferrer"
      >
        {itemData.name}
      </a>
      <div className={cn(css.bond_row, "readOnly")}>
        <strong>Комиссия брокера, %</strong>
        <span>{itemData.comission}%</span>
      </div>
      <div className={cn(css.bond_row, "readOnly")}>
        <strong>Налог на доход, %</strong>
        <span>13,00%</span>
      </div>
      <div className={cn(css.bond_row, "readOnly")}>
        <strong>Номинал облигации, руб</strong>
        <span>1 000,00 ₽</span>
      </div>
      <div className={cn(css.bond_row, "isWrite")}>
        <strong>Количество облигаций, шт</strong>
        <input
          type="number"
          placeholder="Кол-во"
          value={itemData.value}
          onChange={(e) =>
            handleChangeValueBonds(itemData.isin, Number(e.target.value))
          }
        />
      </div>
      <div className={cn(css.bond_row, "isWrite")}>
        <strong>Стоимость облигации, %</strong>
        <input type="text" placeholder="100,40%" value="100,40%" />
      </div>
      <div className={cn(css.bond_row, "isWrite")}>
        <strong>Купонный доход на одну облигацию, руб</strong>
        <input type="text" placeholder="19,73" value="19,73" />
      </div>
      <div className={cn(css.bond_row, "isWrite")}>
        <strong>Количество купонных выплат до погашения</strong>
        <input type="number" placeholder="23" value="23" />
      </div>
      <div className={cn(css.bond_row, "isWrite")}>
        <strong>НКД</strong>
        <input type="number" placeholder="9" value="9" />
      </div>
      <div className={cn(css.bond_row, "isWrite")}>
        <strong>Дата погашения</strong>
        <input type="text" placeholder="14.07.2028" value="14.07.2028" />
      </div>

      <div className={cn(css.bond_row, "forbidden")}>
        <strong>Дней до погашения</strong>
        <span>1137</span>
      </div>
      <div className={cn(css.bond_row, "forbidden")}>
        <strong>Лет до погашения</strong>
        <span>3,12</span>
      </div>
      <div className={cn(css.bond_row, "forbidden")}>
        <strong>Комиссия за покупку</strong>
        <span>3,01 ₽</span>
      </div>
      <div className={cn(css.bond_row, "forbidden")}>
        <strong>Цена самих облигаций</strong>
        <span>1 004,00 ₽</span>
      </div>
      <div className={cn(css.bond_row, "forbidden")}>
        <strong>Уплаченного НКД</strong>
        <span>9,20 ₽</span>
      </div>
      <div className={cn(css.bond_row, "forbidden")}>
        <strong>Полная цена покупки</strong>
        <span>1 016,21 ₽</span>
      </div>
      <div className={cn(css.bond_row, "forbidden")}>
        <strong>С одной выплаты буду получать</strong>
        <span>19,73 ₽</span>
      </div>
      <div className={cn(css.bond_row, "forbidden")}>
        <strong>Цена покупки выше номинала</strong>
        <span>Да</span>
      </div>
      <div className={cn(css.bond_row, "forbidden")}>
        <strong>Суммарно получим купонами</strong>
        <span>453,79 ₽</span>
      </div>
      <div className={cn(css.bond_row, "forbidden")}>
        <strong>Маржа от погашения</strong>
        <span>0,00 ₽</span>
      </div>
      <div className={cn(css.bond_row, "forbidden")}>
        <strong>Налог на купоны</strong>
        <span>58,99 ₽</span>
      </div>
      <div className={cn(css.bond_row, "forbidden")}>
        <strong>Налог на погашение</strong>
        <span>0,00 ₽</span>
      </div>
      <div className={cn(css.bond_row, "forbidden")}>
        <strong>Погашение</strong>
        <span>1 000,00 ₽</span>
      </div>
      <div className={cn(css.bond_row, "forbidden")}>
        <strong>Чистая сумма в итоге</strong>
        <span>1 394,80 ₽</span>
      </div>

      <div className={cn(css.bond_row, "isResult")}>
        <strong>Чистая прибыль</strong>
        <span>378,59 ₽</span>
      </div>
      <div className={cn(css.bond_row, "isResult")}>
        <strong>Доходность (годовых)</strong>
        <span>11,96%</span>
      </div>
    </div>
  );
};

export default Bond;
