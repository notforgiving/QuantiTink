import { put, takeEvery } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import { TFPosition } from "../../types/portfolio.type";
import { bondsSlice } from "../slices/bonds.slice";
import { GET_BONDS_LIST, TInstrument } from "../../types/bonds.type";
import { fetchAllGetBondsAPI } from "../Api/bonds.api";
import moment from "moment";

function* getBondsListSaga({ payload: { bondPositions, accountId } }: PayloadAction<{ bondPositions: TFPosition[], accountId: string }>) {
    try {
        const response: TInstrument[] = yield fetchAllGetBondsAPI(bondPositions);
        const newResponse = {
            accountId,
            instrument: response,
            dateApi: moment().utc().toString(),
        }
        yield put(bondsSlice.actions.getBondsListSuccessAction(newResponse));
    } catch (error) {
        yield put(bondsSlice.actions.getBondsListErrorAction(error as string));
    }
}

export function* watchGetBonds() {
    yield takeEvery(GET_BONDS_LIST, getBondsListSaga);
}
