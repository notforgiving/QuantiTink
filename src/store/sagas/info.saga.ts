import { put, takeEvery } from "redux-saga/effects";
import { fetchGetInfoAPI } from "../Api/info.api";
import { infoSlice } from "../slices/info.slice";
import { GET_INFO, TInfoState } from "../../types/info.type";

function* getInfoSaga() {
    try {
        const response: TInfoState = yield fetchGetInfoAPI();
        yield put(infoSlice.actions.getInfoSuccessAction(response));
    } catch (error) {
        yield put(infoSlice.actions.getInfoErrorAction(error as string));
    }
}

export function* watchGetInfo() {
    yield takeEvery(GET_INFO, getInfoSaga);
}
