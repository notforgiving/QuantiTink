import { all, fork } from 'redux-saga/effects';
import { watchGetAccounts } from './sagas/accounts.saga';
import { watchGetPortfolios } from './sagas/portfolios.saga';
import { watchGetOperations } from './sagas/operations.saga';
import { watchGetCurrencys } from './sagas/currencys.saga';

const rootSaga = function* () {
  yield all([
    fork(watchGetAccounts),
    fork(watchGetPortfolios),
    fork(watchGetOperations),
    fork(watchGetCurrencys)
  ]);
};

export default rootSaga;
