import { TMoneyValue } from "types/common";


export type TFormatMoney = {
    value: number; formatted: string
}

export function formatMoney(
  input: TMoneyValue | number | undefined,
  currencyOverride?: string
): TFormatMoney {
  let value: number;
  let currency: string;

  if (typeof input === 'undefined') {
    value = 0;
    currency = currencyOverride ?? 'rub';
  } else if (typeof input === 'number') {
    value = input;
    currency = currencyOverride ?? 'rub';
  } else {
    const { units, nano, currency: cur } = input;
    const numericUnits = parseInt(units, 10);
    const fractional = nano / 1e9;
    value = numericUnits + fractional;
    currency = currencyOverride ?? cur;
  }

  const currencySymbol = currency.toLowerCase() === 'rub' ? '₽' : currency;

  const formatted = value.toLocaleString('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }) + ` ${currencySymbol}`;

  return { value, formatted };
}