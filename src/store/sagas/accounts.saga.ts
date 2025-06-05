import { put, takeEvery } from "redux-saga/effects";
import { fetchGetAccountsAPI } from "../Api/accounts.api";
import { GET_ACCOUNTS_LIST, TFAccount } from "../../types/accounts.type";
import { getAccountsListErrorAction, getAccountsListSuccessAction } from "store/slices/accoutns.slice";

function* getAccountsListSaga() {
    try {
        const response: TFAccount[] = yield fetchGetAccountsAPI();
        yield put(getAccountsListSuccessAction(response));
    } catch (error) {
        yield put(getAccountsListErrorAction(error as string));
    }
}

export function* watchGetAccounts() {
    yield takeEvery(GET_ACCOUNTS_LIST, getAccountsListSaga);
}
