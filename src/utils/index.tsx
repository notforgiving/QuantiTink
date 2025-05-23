import moment from "moment";
import { TFUnionOperations } from "../store/slices/operations.slice";
import { TFFormattPrice } from "../types/common";
import { TFOperation } from "../types/operations.types";
import {
  TFAmount,
  TFCurrency,
  TFPortfolio,
  TFPosition,
} from "../types/portfolio.type";
import { TPortfolioEvents } from "../types/event.type";
import { IGoalssForm } from "../pages/Portfolio/hooks/useGoals";
import { IPortfolioItem } from "../pages/Portfolio/hooks/usePortfolio";

type TGetNumberMoney = (initialData: TFAmount | null) => number;
/** Выводим адекватный вид для средств */
export const getNumberMoney: TGetNumberMoney = (initialData) => {
  if (!initialData) {
    return 0;
  }
  const minus =
    String(initialData.nano).includes("-") ||
    String(initialData.units).includes("-")
      ? "-"
      : "";
  const lengthNano = 9;
  const rub = String(initialData.units).replace("-", "");
  const cent1 = String(initialData.nano).replace("-", "");
  const cent2 = cent1.length < lengthNano ? `0${cent1}` : cent1;
  const result = Number(`${minus}${rub}.${cent2}`);
  return result;
};

type TCalcSummOfTotalAmountPortfolio = (initialData: TFPortfolio[]) => number;
/** Считаем сумму всех портфелей */
export const calcSummOfTotalAmountPortfolio: TCalcSummOfTotalAmountPortfolio = (
  initialData
) => {
  return initialData.reduce((accumulator, currentValue) => {
    return accumulator + getNumberMoney(currentValue.totalAmountPortfolio);
  }, 0);
};

type TCalcSummOfAllDeposits = (initialData: TFUnionOperations[]) => number;
/** Считаем сумму пополнений брокерского счета или нескольких */
export const calcSummOfAllDeposits: TCalcSummOfAllDeposits = (initialData) => {
  return initialData?.reduce((acc, el) => {
    const portfolioSumm = el.operations.reduce((accumulator, value) => {
      if (
        value.type === "Пополнение брокерского счёта" ||
        value.type === "Пополнение денежных средств со счета" ||
        (value.type === "Вывод денежных средств со счета" &&
          value.operationType === "OPERATION_TYPE_OUT_MULTI") ||
        (value.type === "Вывод денежных средств" &&
          value.operationType !== "OPERATION_TYPE_OUT_MULTI")
      ) {
        const numberMoney = getNumberMoney(value.payment);
        return accumulator + numberMoney;
      }
      // if (
      //   value.type === "Вывод денежных средств со счета" &&
      //   value.operationType === "OPERATION_TYPE_OUT_MULTI"
      // ) {
      //   const numberMoney = getNumberMoney(value.payment);
      //   return accumulator + numberMoney;
      // }

      // if (
      //   value.type === "Вывод денежных средств" &&
      //   value.operationType !== "OPERATION_TYPE_OUT_MULTI"
      // ) {
      //   const numberMoney = getNumberMoney(value.payment);
      //   return accumulator + numberMoney;
      // }
      return accumulator;
    }, 0);
    return acc + portfolioSumm;
  }, 0);
};

type TFormattedMoneySupply = (
  value: number,
  currency?: TFCurrency
) => TFFormattPrice;
/** Форматирование цены в привычный вид */
export const formattedMoneySupply: TFormattedMoneySupply = (
  value,
  currency
) => {
  const result = value.toLocaleString("ru-RU", {
    style: "currency", // определяем объект со свойствами, определяющими параметры сравнения
    currency: currency || "RUB",
  });
  return {
    value,
    formatt: result,
  };
};

/** Функция поиска и возврата элемента массива по условию */
export function searchItemInArrayData<T>(
  /** В каком массиве искать */
  data: T[],
  /** По какому ключу смотреть совпадение в исходном массиве */
  key: string,
  /** Значение с которым сравнивать */
  value: string
): T | null {
  return data.filter((el: any) => el[key] === value)[0] || null;
}

/** Склоняем слово Месяц в зависимости от числа */
export const getDeclensionWordMonth = (value: number): string => {
  if (value === 1) {
    return "месяц";
  }
  if (value >= 2 && value < 5) {
    return "месяца";
  }
  return "месяцев";
};

/** Поиск в позициях только облигаций или акций */
export const getOnlyEventsPositionsByPortfolio = (
  positions: TFPosition[]
): TFPosition[] => {
  return (
    positions.filter(
      (el) => el.instrumentType === "bond" || el.instrumentType === "share"
    ) || []
  );
};

/** Поиск в локал сторадже данных и отдача их в читаемом виде*/
export function searchInLocalStorageByKey<T>(key: string): T | null {
  const storage = localStorage.getItem(key);
  if (storage) {
    return JSON.parse(storage);
  }

  return null;
}

/** Получение процента от числа */
export const getPercentByTarget = (base: number, target: number): number => {
  return Number(((base / target) * 100).toFixed(2));
};

// Функция для проверки начислений по дивидендам
export const calcLotsForDividends = (
  operations: TFOperation[],
  event: TPortfolioEvents,
  lots: number
) => {
  if (operations && !!operations.length) {
    // Получаем из операций только дивиденды по акциям
    const filtredOperations = operations.filter(
      (el) =>
        (el.type === "Выплата дивидендов" ||
          el.type === "Выплата дивидендов на карту") &&
        el.instrumentType === "share"
    );
    // Сравниваем выплаты с нашей целью
    // Если цель найдена, значит отправляем true - выплата уже получена
    // Если цель не найдена, значит выплата не получена, значит проверяет
    // прошлая ли это выплата
    let temp = false;
    if (!!filtredOperations.length) {
      for (let i = 0; i < filtredOperations.length; i++) {
        const el = filtredOperations[i];
        const payOut = getNumberMoney(el.payment);
        const shouldPay = getNumberMoney(event.dividendNet) * lots;
        if (payOut === shouldPay) {
          temp = true;
          return {
            temp,
            quantity: 0,
          };
        }
        temp = false;
      }
    }
    // Если выплаты не нашли, то будем смотреть по дате отсечки
    // Смотрим операции покупки данного тикера
    const operationsBuyTicker = operations.filter(
      (el) =>
        el.type === "Покупка ценных бумаг" &&
        el.figi === event.figi &&
        el.instrumentType === "share"
    );
    // Нам надо подсчитать сколько лотов у нас было на момент отсечки и
    // вернуть число лотов для рассчета дивидендов
    // если количество лотов не ноль после подсчетов, то temp делаем false, чтобы не скрывать выплату из списка
    let quantity = 0;
    operationsBuyTicker.forEach((item) => {
      if (moment(item.date) < moment(event.createdAt)) {
        quantity += Number(item.quantity);
      }
    });
    if (quantity !== 0) {
      temp = false;
    }
    return {
      temp,
      quantity,
    };
  }
  return {
    temp: false,
    quantity: 0,
  };
};

interface IUseCalcRebalancePortfolioProps {
  freeAmountMoney: number;
  totalAmountPortfolio: TFAmount;
  totalAmountCurrencies: TFAmount;
  accountId: string;
  shares: IPortfolioItem;
  rubBonds: IPortfolioItem;
  usdBonds: IPortfolioItem;
  etfArray: (TFFormattPrice & {
    percent: number;
    name: string;
    ticker: string;
  })[];
}

type TFUseCalcRebalancePortfolio = (props: IUseCalcRebalancePortfolioProps) => {
  [x: string]: number;
};

export const useCalcRebalancePortfolio: TFUseCalcRebalancePortfolio = ({
  freeAmountMoney,
  totalAmountPortfolio,
  totalAmountCurrencies,
  accountId,
  shares,
  rubBonds,
  usdBonds,
  etfArray,
}) => {
  // let sumOfAllPositionsInEtf = 0;
  // if (formattedEtf) {
  //   let temp = Array.from(formattedEtf, (x) => x.value) || [];
  //   if (!!temp.length) {
  //     sumOfAllPositionsInEtf = temp.reduce(
  //       (state: number, item: number) => state + item,
  //       0
  //     );
  //   }
  // }
  // Считаем сумму всех активов (100%)
  const sumOfAllPositions = getNumberMoney(totalAmountPortfolio);

  // Учитываем свободные финансы на счете или долг (то, что докидываем)
  const freeMoneyWithoutDebt =
    freeAmountMoney + getNumberMoney(totalAmountCurrencies);

  // забираем цели из локалсторадж
  const localData: {
    [x: string]: IGoalssForm;
  } = searchInLocalStorageByKey("TBalance_goals") || {};

  // забираем цели для конкретного портфеля
  const goals = localData[accountId] || {};

  let resultValues = {};

  if (goals) {
    // получаем новую сумму для рассчета новых соотношений
    const newSummAfterCalc = sumOfAllPositions + freeMoneyWithoutDebt;

    // // создаем объект с текущими соотношениями etf - ов для распарса внутрь общего объекта
    // const newFactsPercentsEtfs = formattedEtf.reduce(
    //   (state, item) => ({
    //     ...state,
    //     [item.ticker]: (item.value / newSummAfterCalc) * 100,
    //   }),
    //   {}
    // );
    // новые проценты соотношений
    const newPercents: {
      [x: string]: number;
    } = {
      rubBonds: (rubBonds.value / newSummAfterCalc) * 100,
      usdBonds: (usdBonds.value / newSummAfterCalc) * 100,
      shares: (shares.value / newSummAfterCalc) * 100,
      ...etfArray.reduce(
        (acc, el) => ({
          ...acc,
          [el.ticker]: (el.value / newSummAfterCalc) * 100,
        }),
        {}
      ),
    };

    // надо понять насколько процентов больше чем надо или меньше
    const howManyPercentsMoreOfGoals: {
      [x: string]: number;
    } = Object.keys(newPercents).reduce((state, key) => {
      return {
        ...state,
        [key]: newPercents[key] - (goals[key] || 0),
      };
    }, {});

    // считаем сколько процентов положительных, больше нуля процентов в объекте howManyPercentsMoreOfGoals (сумму)
    const amountOfInterestExceeding = Object.values(
      howManyPercentsMoreOfGoals
    ).reduce((state, value) => {
      if (Number(value) < 0) {
        return Number(state) + Math.abs(Number(value));
      }
      return state;
    }, 0);

    // считаем сколько одна доля составляет
    const oneRatio = freeMoneyWithoutDebt / Number(amountOfInterestExceeding);

    // путь для ребаланса
    let wayForRebalance = "Full_Rebalance";
    // когда денег только для погашения долга или для ребаланса
    if (freeAmountMoney < Math.abs(getNumberMoney(totalAmountCurrencies)) && getNumberMoney(totalAmountCurrencies) < 0) {
      wayForRebalance = "Debt_Repayment";
    }
    resultValues = Object.keys(howManyPercentsMoreOfGoals).reduce((state, key) => {
      if (
        howManyPercentsMoreOfGoals[key] < 0 &&
        wayForRebalance !== "Debt_Repayment"
      ) {
        return {
          ...state,
          [key]: Math.abs(howManyPercentsMoreOfGoals[key]) * oneRatio,
        };
      }
      return {
        ...state,
        [key]: 0,
      };
    }, {});
  }
  return resultValues
};
