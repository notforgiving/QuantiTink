import { tokenSaga } from 'api/features/token/tokenSaga';
import { userSaga } from 'api/features/user/userSaga';
import { all } from 'redux-saga/effects';

export default function* rootSaga() {
  yield all([
    userSaga(),
    tokenSaga(),
  ]);
}
