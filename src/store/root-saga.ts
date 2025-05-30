import { all, fork } from 'redux-saga/effects';
import { watchGetAccounts } from './sagas/accounts.saga';
import { watchGetPortfolios } from './sagas/portfolios.saga';
import { watchGetOperations } from './sagas/operations.saga';
import { watchGetCurrencys } from './sagas/currencys.saga';
import { watchGetEvents } from './sagas/events.saga';
import { watchGetBonds } from './sagas/bonds.saga';
import { watchGetEtfs } from './sagas/etfs.saga';
import { watchGetShares } from './sagas/shares.saga';
import { watchGetInfo } from './sagas/info.saga';
import { watchSetUser } from './sagas/user.saga';

const rootSaga = function* () {
  yield all([
    fork(watchGetAccounts),
    fork(watchGetPortfolios),
    fork(watchGetOperations),
    fork(watchGetCurrencys),
    fork(watchGetEvents),
    fork(watchGetBonds),
    fork(watchGetEtfs),
    fork(watchGetShares),
    fork(watchGetInfo),
    fork(watchSetUser),
  ]);
};

export default rootSaga;
