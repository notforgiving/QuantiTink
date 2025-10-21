import { fetchGetAccountsAPI, fetchGetAssetByAPI, fetchGetOperationsAPI, fetchGetPortfolioAPI, fetchGetPositionBondAPI, fetchGetPositionEtfAPI, fetchGetPositionShareAPI } from "api/requests/accountsApi";
import { getUserGoals, saveUserGoals } from "api/requests/goalsApi";
import { RootState } from "api/store";
import { all, call, fork, put, select, take, takeEvery, takeLatest } from "redux-saga/effects";
import { InstrumentType } from "types/common";

import { TTokenState } from "../token/tokenSlice";
import { selectTokenData } from "../token/useToken";
import { User } from "../user/userTypes";

import { fetchAccountsFailure, fetchAccountsRequest, fetchAccountsSuccess, fetchAssetFailure, fetchAssetRequest, fetchAssetSuccess, fetchGoalsFailure, fetchGoalsRequest, fetchGoalsSuccess, fetchPositionsFailure, fetchPositionsRequest, fetchPositionsSuccess, saveGoalsFailure, saveGoalsRequest, saveGoalsSuccess, setAssetForAccount, setInstrumentPositionForAccount, setOperationsForAccount, setPortfolioForAccount, setShareInstrumentPositionForAccount, TAccount } from "./accountsSlice";
import { TAssetResponse, TBondsInstrumentResponse, TEtfsInstrumentResponse, TOperationsResponse, TPortfolioResponse, TSharesInstrumentResponse } from "./accountsTypes";
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
        call(fetchBondForPositionWorker, { accountId, figi, token: token.data })
      )
    );
    yield all(
      uniqueEtfsFigis.map((figi) =>
        call(fetchEtfForPositionWorker, { accountId, figi, token: token.data })
      )
    );
    yield all(
      uniqueSharesFigis.map((figi) =>
        call(fetchShareForPositionWorker, { accountId, figi, token: token.data })
      )
    );
    // успех — выключаем лоадер
    yield put(fetchPositionsSuccess({ accountId }));
  } catch (e: any) {
    yield put(fetchPositionsFailure(e.message));
  }
}

function* fetchAssetSaga(action: ReturnType<typeof fetchAssetRequest>) {
  const { accountId, currency } = action.payload;

  try {
    const account: TAccount | undefined = yield select(selectAccountById, accountId);
    if (!account) {
      yield put(
        fetchAssetFailure({ accountId, error: `Аккаунт ${accountId} не найден` })
      );
      return;
    }

    const token: TTokenState = yield select(selectTokenData);
    if (!token?.data) {
      yield put(
        fetchAssetFailure({ accountId, error: "Токен отсутствует" })
      );
      return;
    }

    // берём только bond-позиции, устраняем дубликаты по FIGI
    const targetBondPositions = (account.positions ?? []).filter(
      (p) => p.instrumentType === "bond" && p.initialNominal.currency === currency
    );
    const uniqueBondsByAssetUid = Array.from(
      new Map(
        targetBondPositions.map((p) => [p.assetUid, p]) // ключ = assetUid, значение = позиция
      ).values()
    );

    yield all(
      uniqueBondsByAssetUid.map((bond) =>
        call(fetchAssetForPositionWorker, {
          accountId,
          assetUid: bond.assetUid,
          figi: bond.figi,
          token: token.data,
        })
      )
    );

    yield put(fetchAssetSuccess({ accountId }));
  } catch (e: any) {
    yield put(fetchAssetFailure({ accountId, error: e.message }));
  }
}

// воркер для одной облигации (с перехватом ошибки, чтобы не падала вся пачка)
function* fetchAssetForPositionWorker({
  accountId,
  assetUid,
  token,
  figi,
}: {
  accountId: string;
  assetUid: string;
  figi: string;
  token: TTokenState['data'];
}) {
  try {
    const assetResp: TAssetResponse = yield call(fetchGetAssetByAPI, {
      token,
      assetUid,
    });

    // обновляем конкретную позицию
    yield put(
      setAssetForAccount({
        accountId,
        figi,
        asset: assetResp.asset,
      })
    );
  } catch (err: any) {
    yield put(
      fetchPositionsFailure({
        accountId,
        error: `${`Не удалось загрузить asset по ${assetUid}:` || err?.message || err}`,
      })
    );
    return;
  }
}

// --- Получение целей из Firebase ---
function* fetchGoalsSaga(action: ReturnType<typeof fetchGoalsRequest>) {
  const user: User = yield select((state: RootState) => state.user.currentUser);
  try {
    const { accountId } = action.payload; // accountId = userId
    const goals: Record<string, number> = yield call(getUserGoals, user.id, accountId);
    yield put(fetchGoalsSuccess({ accountId, goals }));
  } catch (err: any) {
    yield put(fetchGoalsFailure(err.message));
  }
}

// --- Сохранение целей в Firebase ---
function* saveGoalsSaga(action: ReturnType<typeof saveGoalsRequest>) {
  try {
    const user: User = yield select((state: RootState) => state.user.currentUser);
    const { accountId, goals } = action.payload;
    // вызываем API для записи целей в Firestore
    yield call(saveUserGoals, user.id, goals, accountId);
    // после успешной записи — обновляем состояние Redux
    yield put(
      saveGoalsSuccess({
        accountId,
        goals,
      })
    );
  } catch (err: any) {
    yield put(saveGoalsFailure(err.message));
  }
}

function* watchAccountsAndPositions() {
  yield take(fetchAccountsSuccess.type); // ждём пока аккаунты загрузятся
  yield takeEvery(fetchPositionsRequest.type, fetchAccountByIdSaga);
}

export function* accountsSaga() {
  yield takeLatest(fetchAccountsRequest.type, fetchAccountsWorker);
  yield takeLatest(fetchAssetRequest.type, fetchAssetSaga);
  yield fork(watchAccountsAndPositions);
}

export function* watchAccountsLoaded() {
  yield takeEvery(fetchAccountsSuccess.type, fetchPortfoliosSaga);
  yield takeEvery(fetchAccountsSuccess.type, fetchOperationsSaga);
}

// --- watcher ---
export function* wztchGoalsSaga() {
  yield takeLatest(fetchGoalsRequest.type, fetchGoalsSaga);
  yield takeLatest(saveGoalsRequest.type, saveGoalsSaga);
}
