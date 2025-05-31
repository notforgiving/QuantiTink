import { put, takeEvery } from "redux-saga/effects";
import { fetchGetCurrencysAPI } from "../Api/currency.api";
import { currencySlice } from "../slices/currency.slice";
import { GET_CURRENCY_LIST, TCurrencyResponse } from "../../types/currency.type";

function* getCurrencySaga() {
    try {
        const response: TCurrencyResponse[] = yield fetchGetCurrencysAPI();
        yield put(currencySlice.actions.getCurrencyListSuccessAction(response));
    } catch (error) {
        yield put(currencySlice.actions.getCurrencyListErrorAction(error as string));
    }
}

export function* watchGetCurrencys() {
    yield takeEvery(GET_CURRENCY_LIST, getCurrencySaga);
}
