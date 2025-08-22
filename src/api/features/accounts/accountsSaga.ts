import { fetchGetAccountsAPI, fetchGetOperationsAPI, fetchGetPortfolioAPI, fetchGetPositionBondAPI, fetchGetPositionEtfAPI, fetchGetPositionShareAPI } from "api/requests/accountsApi";
import { RootState } from "api/store";
import { all, call, fork, put, select, take, takeEvery, takeLatest } from "redux-saga/effects";
import { InstrumentType } from "types/common";

import { TTokenState } from "../token/tokenSlice";
import { selectTokenData } from "../token/useToken";

import { fetchAccountsFailure, fetchAccountsRequest, fetchAccountsSuccess, fetchPositionsFailure, fetchPositionsRequest, fetchPositionsSuccess, setInstrumentPositionForAccount, setOperationsForAccount, setPortfolioForAccount, setShareInstrumentPositionForAccount, TAccount } from "./accountsSlice";
import { TBondsInstrumentResponse, TEtfsInstrumentResponse, TOperationsResponse, TPortfolioResponse, TSharesInstrumentResponse } from "./accountsTypes";
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
    const bondResp: TBondsInstrumentResponse = yield call(fetchGetPositionBondAPI, {
      token,
      figi,
    });

    // обновляем конкретную позицию
    yield put(
      setInstrumentPositionForAccount({
        accountId,
        figi,
        instrumentType: InstrumentType.Bond,
        instrument: bondResp.instrument,
      })
    );
  } catch (err: any) {
    yield put(
      fetchPositionsFailure({
        accountId,
        error: `${`Не удалось загрузить bond по ${figi}:` || err?.message || err}`,
      })
    );
    return;
  }
}

// воркер для одного фонда (с перехватом ошибки, чтобы не падала вся пачка)
function* fetchEtfForPositionWorker({
  accountId,
  figi,
  token,
}: {
  accountId: string;
  figi: string;
  token: TTokenState['data'];
}) {
  try {
    const etfResp: TEtfsInstrumentResponse = yield call(fetchGetPositionEtfAPI, {
      token,
      figi,
    });

    // обновляем конкретную позицию
    yield put(
      setInstrumentPositionForAccount({
        accountId,
        figi,
        instrumentType: InstrumentType.Etf,
        instrument: etfResp.instrument,
      })
    );
  } catch (err: any) {
    yield put(
      fetchPositionsFailure({
        accountId,
        error: `${`Не удалось загрузить etf по ${figi}:` || err?.message || err}`,
      })
    );
    return;
  }
}

// воркер для одной акции (с перехватом ошибки, чтобы не падала вся пачка)
function* fetchShareForPositionWorker({
  accountId,
  figi,
  token,
}: {
  accountId: string;
  figi: string;
  token: TTokenState['data'];
}) {
  try {
    const shareResp: TSharesInstrumentResponse = yield call(fetchGetPositionShareAPI, {
      token,
      figi,
    });

    // обновляем конкретную позицию
    yield put(
      setShareInstrumentPositionForAccount({
        accountId,
        figi,
        instrumentType: 'share',
        instrument: shareResp.instrument,
      })
    );
  } catch (err: any) {
    yield put(
      fetchPositionsFailure({
        accountId,
        error: `${`Не удалось загрузить share по ${figi}:` || err?.message || err}`,
      })
    );
    return;
  }
}

function* fetchAccountByIdSaga(action: ReturnType<typeof fetchPositionsRequest>) {
  const { accountId } = action.payload;
  const account: TAccount | undefined = yield select(selectAccountById, accountId);
  try {
    if (!account) {
      yield put(
        fetchPositionsFailure({
          accountId,
          error: `Аккаунт ${accountId} не найден`,
        })
      );
      return;
    }
    const token: TTokenState = yield select(selectTokenData);
    if (!token) {
      yield put(
        fetchPositionsFailure({
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
    const etfPositions = (account.positions ?? []).filter(
      (p) => p.instrumentType === "etf" && p.figi
    );
    const sharesPositions = (account.positions ?? []).filter(
      (p) => p.instrumentType === "share" && p.figi
    );
    const uniqueBondsFigis = Array.from(new Set(bondPositions.map((p) => p.figi)));
    const uniqueEtfsFigis = Array.from(new Set(etfPositions.map((p) => p.figi)));
    const uniqueSharesFigis = Array.from(new Set(sharesPositions.map((p) => p.figi)));
    yield all(
      uniqueBondsFigis.map((figi) =>
        call(function* () {
          yield* fetchBondForPositionWorker({ accountId, figi, token: token.data, });
        })
      )
    );
    yield all(
      uniqueEtfsFigis.map((figi) =>
        call(function* () {
          yield* fetchEtfForPositionWorker({ accountId, figi, token: token.data, });
        })
      )
    );
    yield all(
      uniqueSharesFigis.map((figi) =>
        call(function* () {
          yield* fetchShareForPositionWorker({ accountId, figi, token: token.data, });
        })
      )
    );
    // успех — выключаем лоадер
    yield put(fetchPositionsSuccess({ accountId }));
  } catch (e: any) {
    yield put(fetchPositionsFailure(e.message));
  }
}

export function* accountsSaga() {
  yield takeLatest(fetchAccountsRequest.type, fetchAccountsWorker);
  // запускаем отдельный "координатор"
  yield fork(function* watchAccountsAndPositions() {
    while (true) {
      // ждем пока аккаунты загрузятся
      yield take(fetchAccountsSuccess.type);

      // ждем запрос позиций и получаем action
      const action: ReturnType<typeof fetchPositionsRequest> = yield take(fetchPositionsRequest.type);

      // передаем action в сагу
      yield call(fetchAccountByIdSaga, action);
    }
  });
}

export function* watchAccountsLoaded() {
  yield takeEvery(fetchAccountsSuccess.type, fetchPortfoliosSaga);
  yield takeEvery(fetchAccountsSuccess.type, fetchOperationsSaga);
}
