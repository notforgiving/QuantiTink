import { fetchGetInfoAPI } from "api/requests/infoApi";
import { call, put, select, takeLatest } from "redux-saga/effects";

import { TTokenState } from "../token/tokenSlice";
import { selectTokenData } from "../token/useToken";

import { fetchInfoFailure, fetchInfoRequest, fetchInfoSuccess, TInfo } from "./infoSlice";

export function* fetchInfoWorker() {
  try {
    const token:TTokenState = yield select(selectTokenData);

    if (!token.data) {
      throw new Error("Токен не найден");
    }

    const info: TInfo = yield call(fetchGetInfoAPI, token.data);
    yield put(fetchInfoSuccess(info));
  } catch (error: any) {
    yield put(fetchInfoFailure(error.message || 'Ошибка загрузки информации о тарифе'));
  }
}

export function* infoSaga() {
  yield takeLatest(fetchInfoRequest.type, fetchInfoWorker);
}
