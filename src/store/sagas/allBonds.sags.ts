import moment from "moment";
import { put, takeEvery } from "redux-saga/effects";
import { fetchGetAllBondsAPI } from "store/Api/allBonds.api";
import { getAllBondsListErrorAction, getAllBondsListSuccessAction } from "store/slices/allBonds.slice";
import { TInstrument } from "types/bonds.type";
import { GET_ALL_BONDS_LIST } from "types/calculationBonds.type";

function* getAllBondsSaga() {
    try {
        const response: TInstrument[] = yield fetchGetAllBondsAPI();
        const newResponse = {
            instruments: response,
            dateApi: moment().utc().toString(),
        }
        yield put(getAllBondsListSuccessAction(newResponse));
    } catch (error) {
        yield put(getAllBondsListErrorAction(error as string));
    }
}

export function* watchGetAllBonds() {
    yield takeEvery(GET_ALL_BONDS_LIST, getAllBondsSaga);
}
