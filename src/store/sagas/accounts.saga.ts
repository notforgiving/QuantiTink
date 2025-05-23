import { put, takeEvery } from "redux-saga/effects";
import { fetchGetAccountsAPI } from "../Api/accounts.api";
import { accountsSlice } from "../slices/accoutns.slice";
import { GET_ACCOUNTS_LIST, TFAccount } from "../../types/accounts.type";

function* getAccountsListSaga() {
    try {
        const response: TFAccount[] = yield fetchGetAccountsAPI();
        yield put(accountsSlice.actions.getaccountsListSuccessAction(response));
    } catch (error) {
        yield put(accountsSlice.actions.getaccountsListErrorAction(error as string));
    }
}

export function* watchGetAccounts() {
    yield takeEvery(GET_ACCOUNTS_LIST, getAccountsListSaga);
}
