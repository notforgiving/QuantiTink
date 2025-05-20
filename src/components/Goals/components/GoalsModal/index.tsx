import React, { FC } from "react";
import css from "../../styles.module.scss";
import cn from "classnames";
import Input from "../../../../UI/components/Input";
import Button from "../../../../UI/components/Button";
import { TFAmount } from "../../../../types/portfolio.type";
import { formattedMoneySupply, getNumberMoney } from "../../../../utils";
import { useSelector } from "react-redux";
import { StateType } from "../../../../store/root-reducer";

interface IGoalsModalProps {
  openPanel: boolean;
  setOpenPanel: React.Dispatch<React.SetStateAction<boolean>>;
  /** Сумма денег для распределения */
  freeAmountMoney: number;
  setFreeAmountMoney: React.Dispatch<React.SetStateAction<number>>;
  /** Сумма денег на счету */
  portfolioAmountMoney: TFAmount;
  resultValues: {
    [x: string]: number;
  };
}

const GoalsModal: FC<IGoalsModalProps> = ({
  openPanel,
  setOpenPanel,
  freeAmountMoney,
  setFreeAmountMoney,
  portfolioAmountMoney,
  resultValues,
}) => {
  const { data: etfData } = useSelector((state: StateType) => state.etfs);

  const formatPortfolioAmountMoney = formattedMoneySupply(
    getNumberMoney(portfolioAmountMoney)
  );
  const remainedAmountMoney = formattedMoneySupply(
    freeAmountMoney + formatPortfolioAmountMoney.value
  );
  const nameActives: {
    [x: string]: string;
  } = {
    shares: "Акции",
    rubBonds: "Российские облигации",
    usdBonds: "Валютные облигации",
    ...etfData?.instrument.reduce(
      (acc, el) => ({
        ...acc,
        [el.ticker]: el.name,
      }),
      {}
    ),
  };

  return (
    <div
      className={cn(css.goals_modal, {
        _isOpen: openPanel,
      })}
    >
      <div className={css.goals_input}>
        <strong>Сколько вы готовы потратить?</strong>
        <Input
          inputAttributes={{
            value: freeAmountMoney.toString(),
            type: "number",
            onChange: (e) =>
              setFreeAmountMoney(Math.abs(Number(e.target.value))),
            placeholder: "Введите сумму",
          }}
        />
      </div>
      <div className={css.goals_info}>
        <strong>У вас на счету: </strong>
        <span>{formatPortfolioAmountMoney.formatt}</span>
      </div>
      <div className={css.goals_info}>
        <strong>Можно использовать для покупки: </strong>
        <span>{remainedAmountMoney.formatt}</span>
      </div>
      {!!Object.keys(resultValues).length &&
        Object.keys(resultValues).map((el) => (
          <div className={css.goals_info} key={el}>
            <strong>{nameActives[el] || el}: </strong>
            <span>{formattedMoneySupply(resultValues[el]).formatt}</span>
          </div>
        ))}
      <div className={css.goals_modal_btn}>
        <Button
          text="Купил"
          buttonAttributes={{
            onClick: () => setOpenPanel(false),
          }}
        />
      </div>
    </div>
  );
};

export default GoalsModal;
