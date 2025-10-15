import { fetchGetBondCouponsAPI, fetchGetDividendsAPI, } from "api/requests/calendarApi";
import { all, call, put, select, takeLatest } from "redux-saga/effects";
import { InstrumentType } from "types/common";

import { selectAccountById } from "../accounts/useAccounts";
import { selectTokenData } from "../token/useToken";

import { fetchCalendarFailure, fetchCalendarRequest, fetchCalendarSuccess } from "./calendarSlice";
import { TBondCoupon, TBondCouponsResponse, TCalendarEvent, TDividend, TDividendsResponse } from "./calendarType";


function* fetchCalendarSaga(action: ReturnType<typeof fetchCalendarRequest>) {
    const { accountId } = action.payload;
    try {
        // 1) берём строку токена
        const tokenState: { data: string } = yield select(selectTokenData);
        const token = tokenState.data;

        // 2) позиции аккаунта
        const account: { positions?: Array<{ figi: string; instrumentType: InstrumentType }> } =
            yield select(selectAccountById, accountId);
        const positions = account?.positions ?? [];

        // 3) фильтруем только акции и облигации
        const filtered = positions.filter(
            (p) => p.instrumentType === InstrumentType.Share || p.instrumentType === InstrumentType.Bond
        );

        // 4) подготавливаем эффекты
        const tasks = filtered.map((pos) =>
            pos.instrumentType === InstrumentType.Share
                ? call(fetchGetDividendsAPI, { token, figi: pos.figi })
                : call(fetchGetBondCouponsAPI, { token, figi: pos.figi })
        );
        // 5) параллельно исполняем
        const responses: Array<TDividendsResponse | TBondCouponsResponse> = yield all(tasks);


        // 6) нормализуем → массив событий календаря
        const events: TCalendarEvent[] = responses.flatMap<TCalendarEvent>((resp, idx): TCalendarEvent[] => {
            const pos = filtered[idx];
            if ("dividends" in resp) {
                // дивиденды по акции
                return resp.dividends.map<TCalendarEvent>((d: TDividend) => ({
                    figi: pos.figi,
                    instrumentType: InstrumentType.Share,
                    eventType: "dividend",
                    raw: d,
                }));
            }

            if ("events" in resp) {
                // купоны/амортизации по облигации (если в ответе именно купоны — ставим coupon)
                return resp.events.map<TCalendarEvent>((c: TBondCoupon) => ({
                    figi: pos.figi,
                    instrumentType: InstrumentType.Bond,
                    eventType: "coupon",
                    raw: c,
                }));
            }

            return [];
        });

        yield put(fetchCalendarSuccess({ accountId, events }));
    } catch (err: any) {
        yield put(
            fetchCalendarFailure({
                accountId,
                error: err.message ?? "Ошибка загрузки событий календаря",
            })
        );
    }
}


export function* calendarSaga() {
    yield takeLatest(fetchCalendarRequest.type, fetchCalendarSaga);
}