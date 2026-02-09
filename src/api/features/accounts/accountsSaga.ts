import { fetchGetAccountsAPI, fetchGetAssetByAPI, fetchGetOperationsAPI, fetchGetPortfolioAPI, fetchGetPositionBondAPI, fetchGetPositionEtfAPI, fetchGetPositionShareAPI } from "api/requests/accountsApi";
import { fetchGetBondCouponsAPI } from "api/requests/favoritesBondsApi";
import { getUserGoals, saveUserGoals } from "api/requests/goalsApi";
import { RootState } from "api/store";
import { all, call, fork, put, select, take, takeEvery, takeLatest } from "redux-saga/effects";
import { InstrumentType } from "types/common";

import { IGetBondCouponsEvents } from "../favoritesBonds/favoritesBondsTypes";
import { TTokenState } from "../token/tokenSlice";
import { selectTokenData } from "../token/useToken";
import { User } from "../user/userTypes";

import { accountsSliceFailure, fetchAccountsRequest, fetchAccountsSuccess, fetchAssetFailure, fetchAssetRequest, fetchAssetSuccess, fetchEventsForBond, fetchEventsForBondFailure, fetchEventsForBondSuccess, fetchGoalsRequest, fetchGoalsSuccess, fetchPositionsFailure, fetchPositionsRequest, fetchPositionsSuccess, saveGoalsRequest, saveGoalsSuccess, setAssetForAccount, setInstrumentPositionForAccount, setOperationsForAccount, setPortfolioForAccount, setShareInstrumentPositionForAccount, TAccount } from "./accountsSlice";
import { TAssetResponse, TBondsInstrumentResponse, TEtfsInstrumentResponse, TOperationsResponse, TPortfolioResponse, TSharesInstrumentResponse } from "./accountsTypes";
import { selectAccountById } from "./useAccounts";

export function* fetchAccountsWorker() {
  try {
    const token: TTokenState = yield select(selectTokenData);

    if (!token?.data) {
      throw new Error("Токен не найден");
    }

    const accounts: TAccount[] = yield call(fetchGetAccountsAPI, token.data);

    const firstAccount = accounts?.[0];

    if (firstAccount?.accessLevel !== 'ACCOUNT_ACCESS_LEVEL_READ_ONLY') {
      yield put(
        accountsSliceFailure(
          'Вы не можете использовать токен для торговли. Выпустите токен повторно, только для чтения'
        )
      );
      return;
    }

    yield put(accountsSliceFailure(null));

    const filteredAccounts = accounts.filter(
      (account) => account.type !== 'ACCOUNT_TYPE_INVEST_BOX'
    );

    yield put(fetchAccountsSuccess(filteredAccounts));
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Ошибка загрузки аккаунтов';
    yield put(accountsSliceFailure(message));
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
        () => fetchGetOperationsAPI({ token: token.data, accountId: account.id, from: account.openedDate })
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
    yield put(accountsSliceFailure(err.message));
  }
}

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
    yield put(accountsSliceFailure(err.message));
  }
}

function* loadEventByBondWorker(action: ReturnType<typeof fetchEventsForBond>) {
  try {
    const targetFigi = action.payload.figi;
    const startPeriod = action.payload.startPeriod;
    const finishPeriod = action.payload.finishPeriod;

    if (!targetFigi && !finishPeriod && !startPeriod) {
      return;
    }
    const tokenState: { data: string } = yield select(selectTokenData);
    const token = tokenState.data;

    const eventsArray: IGetBondCouponsEvents[] = [];

    try {
      const { events } = yield call(fetchGetBondCouponsAPI, { token, figi: targetFigi, from: startPeriod, to: finishPeriod });
      eventsArray.push(...events);
    } catch (e) {
      console.warn(`Не удалось получить данные для ${targetFigi}:`, e);
    }

    yield put(fetchEventsForBondSuccess({
      accountId: action.payload.accountId,
      figi: targetFigi,
      events: eventsArray
    }));

  } catch (error: any) {
    console.error("Ошибка загрузки избранных облигаций:", error);
    yield put(fetchEventsForBondFailure(error));
  }
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

function* watchAccountsAndPositions() {
  yield take(fetchAccountsSuccess.type); // ждём пока аккаунты загрузятся
  yield takeEvery(fetchPositionsRequest.type, fetchAccountByIdSaga);
  yield takeEvery(fetchEventsForBond.type, loadEventByBondWorker);
}

export function* watchGoalsSaga() {
  yield takeLatest(fetchGoalsRequest.type, fetchGoalsSaga);
  yield takeLatest(saveGoalsRequest.type, saveGoalsSaga);
}
