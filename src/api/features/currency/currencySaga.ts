import { fetchCurrencyRatesApi } from "api/requests/currencyApi";
import { call, put, takeLatest } from "redux-saga/effects";

import {
    CurrencyRates,
  fetchCurrencyRatesFailure,
  fetchCurrencyRatesRequest,
  fetchCurrencyRatesSuccess,
} from "./currencySlice";

export function* currencyWorker(action: ReturnType<typeof fetchCurrencyRatesRequest>) {
  try {
    const rates:CurrencyRates = yield call(fetchCurrencyRatesApi);
    yield put(fetchCurrencyRatesSuccess(rates));
  } catch (e: any) {
    yield put(fetchCurrencyRatesFailure(e.message || "Ошибка загрузки курса валют"));
  }
}

export function* currencySaga() {
  yield takeLatest(fetchCurrencyRatesRequest.type, currencyWorker);
}
