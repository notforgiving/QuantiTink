import { put, takeEvery } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import { GET_OPERATIONS_LIST } from "../../types/operations.types";
import { fetchAllGetOperationsAPI } from "../Api/operations.api";
import { getOperationsListErrorAction, getOperationsListSuccessAction, TFUnionOperations } from "../slices/operations.slice";
import { TFAccount } from "../../types/accounts.type";

function* getOperationsListSaga({ payload }: PayloadAction<TFAccount[]>) {
    try {
        const response: TFUnionOperations[] = yield fetchAllGetOperationsAPI(payload);
        yield put(getOperationsListSuccessAction(response));
    } catch (error) {
        yield put(getOperationsListErrorAction(error as string));
    }
}

export function* watchGetOperations() {
    yield takeEvery(GET_OPERATIONS_LIST, getOperationsListSaga);
}
