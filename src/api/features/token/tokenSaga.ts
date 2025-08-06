import { fetchDeleteTokenAPI, fetchReadTokenAPI, fetchWriteTokenAPI } from "api/requests/tokenApi";
import { all, call, put, takeLatest } from "redux-saga/effects";

import { deleteTokenFailure, deleteTokenRequest, deleteTokenSuccess, fetchTokenFailure, fetchTokenRequest, fetchTokenSuccess, writeTokenFailure, writeTokenRequest, writeTokenSuccess } from "./tokenSlice";

// === Чтение токена ===
function* fetchTokenWorker(action: ReturnType<typeof fetchTokenRequest>) {
  try {
    const token: string = yield call(fetchReadTokenAPI, action.payload);
    yield put(fetchTokenSuccess(token));
  } catch (error: any) {
    yield put(fetchTokenFailure(error.message || "Ошибка получения токена"));
  }
}

// === Запись токена ===
function* writeTokenWorker(action: ReturnType<typeof writeTokenRequest>) {
  try {
    const { token, userId } = action.payload;
    const result: string | null = yield call(fetchWriteTokenAPI, { token, userId });

    if (result) {
      yield put(writeTokenSuccess(result));
    } else {
      yield put(writeTokenFailure("Не удалось записать токен"));
    }
  } catch (error: any) {
    yield put(writeTokenFailure(error.message || "Ошибка записи токена"));
  }
}

// === Удаление токена ===
function* deleteTokenWorker(action: ReturnType<typeof deleteTokenRequest>) {
  try {
    const userId = action.payload;
    const success: boolean = yield call(fetchDeleteTokenAPI, userId);

    if (success) {
      yield put(deleteTokenSuccess());
    } else {
      yield put(deleteTokenFailure("Не удалось удалить токен"));
    }
  } catch (error: any) {
    yield put(deleteTokenFailure(error.message || "Ошибка удаления токена"));
  }
}

// === Главная сага ===
export function* tokenSaga() {
  yield all([
    takeLatest(fetchTokenRequest.type, fetchTokenWorker),
    takeLatest(writeTokenRequest.type, writeTokenWorker),
    takeLatest(deleteTokenRequest.type, deleteTokenWorker),
  ]);
}