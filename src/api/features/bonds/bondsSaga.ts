import { fetchGetBondsAPI } from "api/requests/bondsApi";
import { call, put, select, takeLatest } from "redux-saga/effects";

import { TTokenState } from "../token/tokenSlice";
import { selectTokenData } from "../token/useToken";

import { fetchBondsFailure, fetchBondsRequest, fetchBondsSuccess } from "./bondsSlice";
import { TBondsResponse } from "./bondsTypes";


function* fetchBondsWorker(action: { type: string; payload: TTokenState["data"] }) {
    try {
        const tokenState: { data: string } = yield select(selectTokenData);
        const token = tokenState.data;

        const response: TBondsResponse = yield call(fetchGetBondsAPI, { token });
        yield put(fetchBondsSuccess(response.instruments));
    } catch (error: any) {
        yield put(fetchBondsFailure(error.message || "Ошибка загрузки облигаций"));
    }
}

export function* bondsSaga() {
    yield takeLatest(fetchBondsRequest.type, fetchBondsWorker);
}
