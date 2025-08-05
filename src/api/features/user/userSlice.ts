import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from './userTypes';

interface UserState {
  currentUser: User | null;
  isAuth: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  currentUser: null,
  isAuth: false,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // --- Регистрация ---
    registerRequest(state, _action: PayloadAction<{ email: string; password: string }>) {
      state.loading = true;
      state.error = null;
    },
    registerSuccess(state, action: PayloadAction<User>) {
      state.currentUser = action.payload;
      state.isAuth = true;
      state.loading = false;
    },
    registerFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },

    // --- Логин ---
    loginRequest(state, _action: PayloadAction<{ email: string; password: string }>) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action: PayloadAction<User>) {
      state.currentUser = action.payload;
      state.isAuth = true;
      state.loading = false;
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },

    // --- Установка пользователя вручную ---
    setUser(state, action: PayloadAction<User>) {
      state.currentUser = action.payload;
      state.isAuth = true;
    },

    // --- Выход ---
    logout(state) {
      state.currentUser = null;
      state.isAuth = false;
      state.error = null;
      state.loading = false;
    },
  },
});

export const {
  registerRequest,
  registerSuccess,
  registerFailure,
  loginRequest,
  loginSuccess,
  loginFailure,
  setUser,
  logout,
} = userSlice.actions;

export default userSlice.reducer;
