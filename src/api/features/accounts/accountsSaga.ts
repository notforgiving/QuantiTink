import { fetchGetAccountsAPI, fetchGetPortfolioAPI } from "api/requests/accountsApi";
import { RootState } from "api/store";
import { call, put, select, takeEvery, takeLatest } from "redux-saga/effects";

import { TTokenState } from "../token/tokenSlice";
import { selectTokenData } from "../token/useToken";

import { fetchAccountsFailure, fetchAccountsRequest, fetchAccountsSuccess, setPortfolioForAccount, TAccount } from "./accountsSlice";
import { TPortfolioResponse } from "./accountsTypes";

export function* fetchAccountsWorker() {
  try {
    const token: TTokenState = yield select(selectTokenData);

    if (!token.data) {
      throw new Error("Токен не найден");
    }

    const accounts: TAccount[] = yield call(fetchGetAccountsAPI, token.data);
    // 🔥 Фильтруем лишние типы
    const filteredAccounts = accounts.filter(
      (account) => account.type !== 'ACCOUNT_TYPE_INVEST_BOX'
    );

    yield put(fetchAccountsSuccess(filteredAccounts));
  } catch (error: any) {
    yield put(fetchAccountsFailure(error.message || 'Ошибка загрузки аккаунтов'));
  }
}

function* fetchPortfoliosSaga() {
  const accounts: TAccount[] = yield select((state: RootState) => state.accounts.data);
  const token: TTokenState = yield select(selectTokenData);

  for (const account of accounts) {
    try {
      const portfolio: TPortfolioResponse = yield call(
        () => fetchGetPortfolioAPI({ token: token.data, accountId: account.id })
      );

      yield put(
        setPortfolioForAccount({ accountId: account.id, portfolio })
      );
    } catch (e) {
      console.error(`Ошибка загрузки портфеля для account ${account.id}`, e);
    }
  }
}

export function* accountsSaga() {
  yield takeLatest(fetchAccountsRequest.type, fetchAccountsWorker);
}

export function* watchAccountsLoaded() {
  yield takeEvery(fetchAccountsSuccess.type, fetchPortfoliosSaga);
}
