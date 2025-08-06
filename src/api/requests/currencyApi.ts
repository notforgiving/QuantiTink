import { CurrencyRates } from "api/features/currency/currencySlice";
import axios from "axios";

// Универсальная функция для поиска курса
const extractRate = (
  rates: any[],
  fromCode: number,
  toCode: number,
  category = "ATMCashoutRateGroup"
): number => {
  const rate = rates.find(
    (r) =>
      r.category === category &&
      r.fromCurrency?.code === fromCode &&
      r.toCurrency?.code === toCode &&
      typeof r.buy === "number"
  );

  if (!rate) {
    throw new Error(`Не найден курс ${fromCode} → ${toCode} (${category})`);
  }

  return rate.buy;
};

export const fetchCurrencyRatesApi = async (): Promise<CurrencyRates> => {
  try {
    const currencyParams = [
      { code: "USD", numCode: 840 },
      { code: "CNY", numCode: 156 },
    ];

    const responses = await Promise.all(
      currencyParams.map(({ code }) =>
        axios.get("https://api.tinkoff.ru/v1/currency_rates", {
          params: { from: code, to: "RUB" },
        })
      )
    );

    const [usdRates, cnyRates] = responses.map((res) => res.data?.payload?.rates);

    if (!Array.isArray(usdRates) || !Array.isArray(cnyRates)) {
      throw new Error("Некорректный формат ответа от API");
    }

    return {
      USD: extractRate(usdRates, 840, 643),
      CNY: extractRate(cnyRates, 156, 643),
    };
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
      error?.message ||
      "Ошибка при получении курсов валют"
    );
  }
};
