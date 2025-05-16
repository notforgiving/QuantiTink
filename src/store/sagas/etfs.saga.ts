import { put, takeEvery } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import { TFPosition } from "../../types/portfolio.type";
import moment from "moment";
import { GET_ETFS_LIST, TEtfInstrument } from "../../types/etfs.type";
import { etfsSlice } from "../slices/etfs.slice";
import { fetchAllGetEtfsAPI } from "../Api/etfs.api";

function* getEtfsListSaga({ payload: { etfPositions, accountId } }: PayloadAction<{ etfPositions: TFPosition[], accountId: string }>) {
    try {
        const response: TEtfInstrument[] = yield fetchAllGetEtfsAPI(etfPositions);
        const newResponse = {
            accountId,
            instrument: response,
            dateApi: moment().utc().toString(),
        }
        yield put(etfsSlice.actions.getEtfsListSuccessAction(newResponse));
    } catch (error) {
        yield put(etfsSlice.actions.getEtfsListErrorAction(error as string));
    }
}

export function* watchGetEtfs() {
    yield takeEvery(GET_ETFS_LIST, getEtfsListSaga);
}
