import { TFUnionOperations } from "../store/slices/operations.slice";
import { TFFormattPrice } from "../types/common";
import { TFAmount, TFCurrency, TFPortfolio } from "../types/portfolio.type";

type TGetNumberMoney = (initialData: TFAmount | null) => number;
/** Выводим адекватный вид для средств */
export const getNumberMoney: TGetNumberMoney = (initialData) => {
  if (!initialData) {
    return 0;
  }
  const minus = initialData.units.includes("-") ? -1 : 1;
  const lengthNano = 9;
  const rub = `${Number(initialData.units) * minus}`;
  const cent =
    String(initialData.nano * minus).length < lengthNano
      ? `0${String(initialData.nano * minus)}`
      : String(initialData.nano * minus);
  return Number(`${rub}.${cent}`);
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
/** Считаем сумму пополнений всех брокерстких счетов*/
export const calcSummOfAllDeposits: TCalcSummOfAllDeposits = (initialData) => {
  return initialData?.reduce((acc, el) => {
    const portfolioSumm = el.operations.reduce((accumulator, value) => {
      if (
        value.type === "Пополнение брокерского счёта" ||
        value.type === "Пополнение денежных средств со счета"
      ) {
        const numberMoney = getNumberMoney(value.payment);
        return accumulator + numberMoney;
      }
      if (
        value.type === "Вывод денежных средств" &&
        value.operationType !== "OPERATION_TYPE_OUT_MULTI"
      ) {
        const numberMoney = getNumberMoney(value.payment);
        return accumulator - numberMoney;
      }

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
export function searchPortfolioInArrayData<T>(
  /** В каком массиве искать */
  data: T[],
  /** По какому ключу смотреть совпадение в исходном массиве */
  key: string,
  /** Значение с которым сравнивать */
  value: string
): T | null {
  return data.filter((el: any) => el[key] === value)[0] || null;
}

export const getDeclensionWordMonth = (value: number) => {
  if (value === 1) {
    return "месяц";
  }
  if (value >= 2 && value < 5) {
    return "месяца";
  }
  return "месяцев";
};
