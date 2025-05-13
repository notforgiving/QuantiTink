import { put, takeEvery } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import { GET_OPERATIONS_LIST } from "../../types/operations.types";
import { fetchAllGetOperationsAPI } from "../Api/operations.api";
import { operationsSlice, TFUnionOperations } from "../slices/operations.slice";
import { TFAccount } from "../../types/accounts.type";

function* getOperationsListSaga(list: PayloadAction<TFAccount[]>) {
    try {
        const response: TFUnionOperations[] = yield fetchAllGetOperationsAPI(list.payload);
        yield put(operationsSlice.actions.getOperationsListSuccessAction({
            operations: response,
        }));
    } catch (error) {
        yield put(operationsSlice.actions.getOperationsListErrorAction(error as string));
    }
}

export function* watchGetOperations() {
    yield takeEvery(GET_OPERATIONS_LIST, getOperationsListSaga);
}
