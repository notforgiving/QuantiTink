import { fetchGetBondCouponsAPI, fetchGetLastPriceAPI, getUserFavoritesIsin, saveFavoriteIsin } from "api/requests/favoritesBondsApi";
import { RootState } from "api/store";
import { all, call, put, select, takeLatest } from "redux-saga/effects";

import { selectTokenData } from "../token/useToken";
import { User } from "../user/userTypes";

import { addFavoriteBondFailure, addFavoriteBondRequest, addFavoriteBondSuccess, loadFavorites, setFavorites } from "./favoritesBondsSlice";
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
            const bond = bonds.find((b) => b.ticker === isin);
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
        if (favorites.some((b) => b.isin === isin)) {
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

/**
 * Watcher — слушает addFavoriteBondRequest
 */
export function* favoritesBondsSaga() {
    yield all([
        takeLatest(addFavoriteBondRequest.type, addFavoriteBondWorker),
        takeLatest(loadFavorites.type, loadFavoritesWorker),
    ]);
}