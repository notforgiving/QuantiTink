import { fetchGetAccountsAPI, fetchGetOperationsAPI, fetchGetPortfolioAPI, fetchGetPositionBondAPI } from "api/requests/accountsApi";
import { RootState } from "api/store";
import { all, call, put, select, takeEvery, takeLatest } from "redux-saga/effects";

import { TTokenState } from "../token/tokenSlice";
import { selectTokenData } from "../token/useToken";

import { fetchAccountsFailure, fetchAccountsRequest, fetchAccountsSuccess, fetchBondPositionsFailure, fetchBondPositionsRequest, fetchBondPositionsSuccess, setBondForAccount, setOperationsForAccount, setPortfolioForAccount, TAccount } from "./accountsSlice";
import { TInstrumentResponse, TOperationsResponse, TPortfolioResponse } from "./accountsTypes";
import { selectAccountById } from "./useAccounts";

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

function* fetchOperationsSaga() {
  const accounts: TAccount[] = yield select((state: RootState) => state.accounts.data);
  const token: TTokenState = yield select(selectTokenData);

  for (const account of accounts) {
    try {
      const response: TOperationsResponse = yield call(
        () => fetchGetOperationsAPI({ token: token.data, accountId: account.id })
      );

      yield put(
        setOperationsForAccount({ accountId: account.id, response })
      );
    } catch (e) {
      console.error(`Ошибка загрузки операций для account ${account.id}`, e);
    }
  }
}

// воркер для одной облигации (с перехватом ошибки, чтобы не падала вся пачка)
function* fetchBondForPositionWorker({
  accountId,
  figi,
  token,
}: {
  accountId: string;
  figi: string;
  token: TTokenState['data'];
}) {
  try {
    const bondResp: TInstrumentResponse = yield call(fetchGetPositionBondAPI, {
      token,
      figi,
    });

    // обновляем конкретную позицию
    yield put(
      setBondForAccount({
        accountId,
        figi,
        bond: bondResp.instrument,
      })
    );
  } catch (err: any) {
    // Можно залогировать/собрать ошибки по FIGI, но не роняем всю загрузку
    console.error(`Не удалось загрузить bond по ${figi}:`, err?.message || err);
  }
}

function* fetchAccountByIdSaga(action: ReturnType<typeof fetchBondPositionsRequest>) {
  const { accountId } = action.payload;
  const account: TAccount | undefined = yield select(selectAccountById, accountId);
  try {
    if (!account) {
      yield put(
        fetchBondPositionsFailure({
          accountId,
          error: `Аккаунт ${accountId} не найден`,
        })
      );
      return;
    }
    const token: TTokenState['data'] = yield select(selectTokenData);
    if (!token) {
      yield put(
        fetchBondPositionsFailure({
          accountId,
          error: "Токен отсутствует",
        })
      );
      return;
    }
    // берём только bond-позиции, устраняем дубликаты по FIGI
    const bondPositions = (account.positions ?? []).filter(
      (p) => p.instrumentType === "bond" && p.figi
    );
    const uniqueFigis = Array.from(new Set(bondPositions.map((p) => p.figi)));
    yield all(
      uniqueFigis.map((figi) =>
        call(function* () {
          yield* fetchBondForPositionWorker({ accountId, figi, token });
        })
      )
    );

    // успех — выключаем лоадер
    yield put(fetchBondPositionsSuccess({ accountId }));
  } catch (e: any) {
    yield put(fetchBondPositionsFailure(e.message));
  }
}

export function* accountsSaga() {
  yield takeLatest(fetchAccountsRequest.type, fetchAccountsWorker);
  yield takeLatest(fetchBondPositionsRequest.type, fetchAccountByIdSaga);
}

export function* watchAccountsLoaded() {
  yield takeEvery(fetchAccountsSuccess.type, fetchPortfoliosSaga);
  yield takeEvery(fetchAccountsSuccess.type, fetchOperationsSaga);
}
