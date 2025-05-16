import { put, takeEvery } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import { TFPosition } from "../../types/portfolio.type";
import moment from "moment";
import { sharesSlice } from "../slices/share.slice";
import { fetchAllGetSharesAPI } from "../Api/shares.api";
import { GET_SHARES_LIST, TShareInstrument } from "../../types/share.type";

function* getSharesListSaga({ payload: { sharesPositions, accountId } }: PayloadAction<{ sharesPositions: TFPosition[], accountId: string }>) {
    try {
        const response: TShareInstrument[] = yield fetchAllGetSharesAPI(sharesPositions);
        const newResponse = {
            accountId,
            instrument: response,
            dateApi: moment().utc().toString(),
        }
        yield put(sharesSlice.actions.getSharesListSuccessAction(newResponse));
    } catch (error) {
        yield put(sharesSlice.actions.getSharesListErrorAction(error as string));
    }
}

export function* watchGetShares() {
    yield takeEvery(GET_SHARES_LIST, getSharesListSaga);
}
