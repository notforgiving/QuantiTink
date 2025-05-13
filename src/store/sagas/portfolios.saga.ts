import { put, takeEvery } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import { GET_PORTFOLIO_LIST, TFPortfolio } from "../../types/portfolio.type";
import { portfoliosSlice } from "../slices/portfolio.slice";
import { fetchAllGetPortfoliosAPI } from "../Api/portfolios.api";
import { TFAccount } from "../../types/accounts.type";

function* getPortfoliosListSaga(list: PayloadAction<TFAccount[]>) {
    try {
        const response: TFPortfolio[] = yield fetchAllGetPortfoliosAPI(list.payload);
        yield put(portfoliosSlice.actions.getPortfoliosListSuccessAction({
            accounts: list.payload,
            portfolios: response,
        }));
    } catch (error) {
        yield put(portfoliosSlice.actions.getPortfoliosListErrorAction(error as string));
    }
}

export function* watchGetPortfolios() {
    yield takeEvery(GET_PORTFOLIO_LIST, getPortfoliosListSaga);
}
