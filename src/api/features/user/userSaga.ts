import { call, put, takeLatest } from 'redux-saga/effects';
import {
  registerRequest,
  registerSuccess,
  registerFailure,
  loginRequest,
  loginSuccess,
  loginFailure,
  logout,
} from './userSlice';
import { PayloadAction } from '@reduxjs/toolkit';
import { User } from './userTypes';
import { User as FirebaseUser, UserCredential } from 'firebase/auth';
import { firebaseLogin, firebaseLogout, firebaseRegister } from 'api/requests/userApi';
import { SagaIterator } from 'redux-saga';
import { parseFirebaseError } from 'utils/parseFirebaseError';

function mapFirebaseUser(user: FirebaseUser): User {
  return {
    email: user.email ?? '',
  };
}

function* handleRegister(action: PayloadAction<{ email: string; password: string }>) {
  try {
    const { email, password } = action.payload;
    const response: UserCredential = yield call(firebaseRegister, email, password);
    const user = mapFirebaseUser(response.user);
    yield put(registerSuccess(user));
  } catch (error: any) {
    const message = parseFirebaseError(error);
    yield put(registerFailure(message));
  }
}

function* handleLogin(action: PayloadAction<{ email: string; password: string }>): SagaIterator {
  try {
    const { email, password } = action.payload;
    const response = yield call(firebaseLogin, email, password);
    const user = mapFirebaseUser(response.user);
    yield put(loginSuccess(user));
  } catch (error: any) {
    const message = parseFirebaseError(error);
    yield put(loginFailure(message));
  }
}

function* handleLogout() {
  try {
    yield call(firebaseLogout);
  } catch (error) {
    console.error('Logout error', error);
  }
}

export function* userSaga() {
  yield takeLatest(registerRequest.type, handleRegister);
  yield takeLatest(loginRequest.type, handleLogin);
  yield takeLatest(logout.type, handleLogout);
}
