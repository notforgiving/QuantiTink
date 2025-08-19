import { PayloadAction } from '@reduxjs/toolkit';
import { firebaseLogin, firebaseLogout, firebaseRegister, getUserData, saveUserData, updateUserTheme } from 'api/requests/userApi';
import { RootState } from 'api/store';
import { User as FirebaseUser, UserCredential } from 'firebase/auth';
import { SagaIterator } from 'redux-saga';
import { call, put, select, takeLatest } from 'redux-saga/effects';

import { parseFirebaseError } from 'utils/parseFirebaseError';

import {
  loginFailure,
  loginRequest,
  loginSuccess,
  logout,
  registerFailure,
  registerRequest,
  registerSuccess,
  setThemeFailure,
  setThemeRequest,
  setThemeSuccess,
} from './userSlice';
import { TTheme, User } from './userTypes';

function mapFirebaseUser(user: FirebaseUser, theme: TTheme = 'light'): User {
  return {
    id: user.uid ?? '',
    email: user.email ?? '',
    theme,
  };
}

function* handleRegister(action: PayloadAction<{ email: string; password: string }>) {
  try {
    const { email, password } = action.payload;
    const response: UserCredential = yield call(firebaseRegister, email, password);

    const user = mapFirebaseUser(response.user);
    yield call(saveUserData, user.id, { email: user.email, theme: user.theme }); // ⬅️ сохраняем в базу
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

    const firebaseUser = response.user;
    const userData: Partial<User> = yield call(getUserData, firebaseUser.uid); // ⬅️ читаем из Firestore
    const user = mapFirebaseUser(firebaseUser, userData.theme); // передаём тему из базы

    yield put(loginSuccess(user));
  } catch (error: any) {
    const message = parseFirebaseError(error);
    yield put(loginFailure(message));
  }
}

function* handleSetTheme(action: PayloadAction<TTheme>) {
  const theme = action.payload;
  const state: RootState = yield select();
  const userId = state.user.currentUser?.id;

  if (userId) {
    try {
      yield call(updateUserTheme, userId, theme);
      yield put(setThemeSuccess(theme));
    } catch (error: any) {
      console.error("Failed to update theme in Firestore:", error);
      const message = error?.message || "Не удалось обновить тему";
      yield put(setThemeFailure(message));
    }
  } else {
    yield put(setThemeFailure("Пользователь не авторизован"));
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
  yield takeLatest(setThemeRequest.type, handleSetTheme);
}