import { put, takeEvery } from "redux-saga/effects";
import { fetchGetCurrencysAPI } from "../Api/currency.api";
import { currencySlice } from "../slices/currency.slice";
import { TCurrencyResponse } from "../../types/currency.type";
import { GET_ACCOUNTS_LIST } from "../../types/accounts.type";

function* getCurrencySaga() {
    try {
        const response: TCurrencyResponse = yield fetchGetCurrencysAPI();
        yield put(currencySlice.actions.getCurrencyListSuccessAction(response));
    } catch (error) {
        yield put(currencySlice.actions.getCurrencyListErrorAction(error as string));
    }
}

export function* watchGetCurrencys() {
    yield takeEvery(GET_ACCOUNTS_LIST, getCurrencySaga);
}
