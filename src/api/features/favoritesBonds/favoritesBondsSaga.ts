import { fetchGetBondCouponsAPI, fetchGetLastPriceAPI, getUserFavoritesIsin, removeFavoriteIsin, saveFavoriteIsin } from "api/requests/favoritesBondsApi";
import { RootState } from "api/store";
import { call, put, select, takeLatest } from "redux-saga/effects";

import { selectTokenData } from "../token/useToken";
import { User } from "../user/userTypes";

import { addFavoriteBondFailure, addFavoriteBondRequest, addFavoriteBondSuccess, loadFavorites, removeFavoriteBondFailure, removeFavoriteBondRequest, removeFavoriteBondSuccess, setFavorites } from "./favoritesBondsSlice";
import { TFavoriteBond } from "./favoritesBondsTypes";

/**
 * Загружаем все избранные облигации при открытии страницы
 */
function* loadFavoritesWorker() {
    try {
        const user: User = yield select((state: RootState) => state.user.currentUser);
        const favoritesIsin: string[] = yield call(getUserFavoritesIsin, user.id);

        if (!favoritesIsin.length) {
            yield put(setFavorites([]));
            return;
        }

        // Берем все облигации из bondsSlice
        const bonds: TFavoriteBond[] = yield select((state: RootState) => state.bonds.data);

        const tokenState: { data: string } = yield select(selectTokenData);
        const token = tokenState.data;

        const favorites: TFavoriteBond[] = [];

        for (const isin of favoritesIsin) {
            const bond = bonds.find((b) => b.ticker === isin || b.isin === isin);
            if (!bond) continue;

            try {
                const lastPrice: number = yield call(fetchGetLastPriceAPI, { token, instrumentId: bond.figi });
                const { events } = yield call(fetchGetBondCouponsAPI, { token, figi: bond.figi, to: bond.maturityDate });
                favorites.push({ ...bond, lastPrice, events });
            } catch (e) {
                console.warn(`Не удалось получить данные для ${isin}:`, e);
            }
        }

        yield put(setFavorites(favorites));
    } catch (error: any) {
        console.error("Ошибка загрузки избранных облигаций:", error);
        yield put(setFavorites([]));
    }
}

/**
 * Добавление облигации в избранное
 */
function* addFavoriteBondWorker(action: { type: string; payload: string }) {
    try {
        const user: User = yield select((state: RootState) => state.user.currentUser);
        const isin = action.payload;
        const favorites: TFavoriteBond[] = yield select((state: RootState) => state.favoritesBonds.data);

        // Проверяем наличие
        if (favorites.some((b) => b.ticker === isin || b.isin === isin)) {
            yield put(addFavoriteBondFailure("Облигация уже добавлена"));
            return;
        }

        // Берем облигацию из bondsSlice
        const bonds: TFavoriteBond[] = yield select((state: RootState) => state.bonds.data);
        const bond = bonds.find((b) => b.ticker === isin);
        if (!bond) {
            yield put(addFavoriteBondFailure("Облигация не найдена"));
            return;
        }

        const tokenState: { data: string } = yield select(selectTokenData);
        const token = tokenState.data;

        const lastPrice: number = yield call(fetchGetLastPriceAPI, { token, instrumentId: bond.figi });
        const { events } = yield call(fetchGetBondCouponsAPI, { token, figi: bond.figi, to: bond.maturityDate });

        const favoriteBond: TFavoriteBond = { ...bond, lastPrice, events };

        // Сохраняем только ISIN в Firebase
        yield call(saveFavoriteIsin, user.id, isin);

        yield put(addFavoriteBondSuccess(favoriteBond));
    } catch (error: any) {
        yield put(addFavoriteBondFailure(error.message || "Ошибка при добавлении"));
    }
}

function* removeFavoriteBondWorker(action: { type: string; payload: string }) {
  try {
    const user: User = yield select((state: RootState) => state.user.currentUser);
    const identifier = action.payload; // может быть isin или ticker

    // Находим облигацию в избранном или в общем списке
    const favorites: TFavoriteBond[] = yield select((state: RootState) => state.favoritesBonds.data);
    let bond = favorites.find((b) => b.isin === identifier || b.ticker === identifier);
    
    // Если не нашли в избранном, ищем в общем списке облигаций
    if (!bond) {
      const bonds: TFavoriteBond[] = yield select((state: RootState) => state.bonds.data);
      bond = bonds.find((b) => b.isin === identifier || b.ticker === identifier);
    }

    if (bond) {
      // При добавлении сохраняется ticker (см. addFavoriteBondWorker, строка 84)
      // Поэтому удаляем по ticker
      const success: boolean = yield call(removeFavoriteIsin, user.id, bond.ticker);
      
      if (success) {
        yield put(removeFavoriteBondSuccess(identifier));
      } else {
        // Если не удалось по ticker, пробуем по isin (на случай, если данные были сохранены по-другому)
        const successByIsin: boolean = yield call(removeFavoriteIsin, user.id, bond.isin);
        if (successByIsin) {
          yield put(removeFavoriteBondSuccess(identifier));
        } else {
          yield put(removeFavoriteBondFailure("Не удалось удалить облигацию из Firebase"));
        }
      }
    } else {
      // Облигация не найдена, пробуем удалить по переданному идентификатору
      const success: boolean = yield call(removeFavoriteIsin, user.id, identifier);
      
      if (success) {
        yield put(removeFavoriteBondSuccess(identifier));
      } else {
        yield put(removeFavoriteBondFailure("Облигация не найдена или не удалось удалить из Firebase"));
      }
    }
  } catch (error: any) {
    yield put(removeFavoriteBondFailure(error.message || "Ошибка при удалении"));
  }
}

/**
 * Watcher — слушает addFavoriteBondRequest
 */
export function* favoritesBondsSaga() {
  yield takeLatest(addFavoriteBondRequest.type, addFavoriteBondWorker);
  yield takeLatest(loadFavorites.type, loadFavoritesWorker);
  yield takeLatest(removeFavoriteBondRequest.type, removeFavoriteBondWorker);
}