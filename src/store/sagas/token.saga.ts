import { put, takeEvery } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import { GET_TOKEN, SET_TOKEN } from "types/token.type";
import { fetchReadTokenAPI, fetchWriteTokenAPI } from "store/Api/token.api";
import { tokenSlice } from "store/slices/token.slice";

function* writeTokenSaga({ payload }: PayloadAction<{token:string,userId:string}>) {
    try {
        const response: string | null = yield fetchWriteTokenAPI(payload);
        yield put(tokenSlice.actions.tokenSuccessAction(response));
    } catch (error) {
        console.log('writeTokenSaga', error);
    }
}

function* readTokenSaga({ payload }: PayloadAction<string>) {
    try {
        const response: string = yield fetchReadTokenAPI(payload);
        yield put(tokenSlice.actions.tokenSuccessAction(response === '' ? null : response));
    } catch (error) {
        console.log('readTokenSaga', error);
    }
}


export function* watchToken() {
    yield takeEvery(SET_TOKEN, writeTokenSaga);
    yield takeEvery(GET_TOKEN, readTokenSaga);
}
