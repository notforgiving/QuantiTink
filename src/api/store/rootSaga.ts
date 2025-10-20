import { accountsSaga, watchAccountsLoaded, wztchGoalsSaga } from 'api/features/accounts/accountsSaga';
import { calendarSaga } from 'api/features/calendar/calendarSaga';
import { currencySaga } from 'api/features/currency/currencySaga';
import { infoSaga } from 'api/features/info/infoSaga';
import { tokenSaga } from 'api/features/token/tokenSaga';
import { userSaga } from 'api/features/user/userSaga';
import { all } from 'redux-saga/effects';

export default function* rootSaga() {
  yield all([
    userSaga(),
    tokenSaga(),
    currencySaga(),
    accountsSaga(),
    watchAccountsLoaded(),
    infoSaga(),
    calendarSaga(),
    wztchGoalsSaga(),
  ]);
}
