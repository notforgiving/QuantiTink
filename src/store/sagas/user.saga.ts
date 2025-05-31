import { put, takeEvery } from "redux-saga/effects";
import { CREATE_USER, LOGIN_USER } from "types/user.type";
import { fetchCreateUserAPI, fetchLoginUserAPI } from "store/Api/user.api";
import { PayloadAction } from "@reduxjs/toolkit";
import { userSlice } from "store/slices/user.slice";

function* createUserSaga({ payload: { email, password } }: PayloadAction<{ email: string, password: string }>) {
    try {
        const response: {
            error: string;
            email: string;
            id: string;
            accesstoken: string;
        } = yield fetchCreateUserAPI(email, password);
        if (response.error !== '') {
            yield put(userSlice.actions.userErrorAction(response.error));
        } else {
            yield put(userSlice.actions.userSuccessAction(response));
        }
    } catch (error) {
        console.log('createUserSaga', error);

    }
}

function* loginUserSaga({ payload: { email, password } }: PayloadAction<{ email: string, password: string }>) {
    try {
        const response: {
            error: string;
            email: string;
            id: string;
            accesstoken: string;
        } = yield fetchLoginUserAPI(email, password);
        if (response.error !== '') {
            yield put(userSlice.actions.userErrorAction(response.error));
        } else {
            yield put(userSlice.actions.userSuccessAction(response));
        }
    } catch (error) {
        console.log('loginUserSaga', error);

    }
}


export function* watchSetUser() {
    yield takeEvery(CREATE_USER, createUserSaga);
    yield takeEvery(LOGIN_USER, loginUserSaga);
}
