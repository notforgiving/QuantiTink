import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { TTheme, User } from "./userTypes";

const initialState: {
  currentUser: User | null;
  isAuth: boolean;
  loading: boolean;
  error: string | null;
} = {
  currentUser: null,
  isAuth: false,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
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

    authStateCheckRequest(state) {
      state.loading = true;
      state.error = null;
    },
    authStateCheckSuccess(state, action: PayloadAction<User | null>) {
      state.currentUser = action.payload;
      state.isAuth = !!action.payload;
      state.loading = false;
    },
    authStateCheckFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    logout() {
      // не нужно вручную обнулять, делаем сброс ниже
    },
    setThemeRequest(state, _action: PayloadAction<TTheme>) {
      state.loading = true;
      state.error = null;
    },
    setThemeSuccess(state, action: PayloadAction<TTheme>) {
      if (state.currentUser) {
        state.currentUser.theme = action.payload;
      }
      state.loading = false;
    },
    setThemeFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(userSlice.actions.logout, () => initialState);
  },
});

export const {
  registerRequest,
  registerSuccess,
  registerFailure,
  loginRequest,
  loginSuccess,
  loginFailure,
  authStateCheckRequest,
  authStateCheckSuccess,
  authStateCheckFailure,
  logout,
  setThemeRequest,
  setThemeSuccess,
  setThemeFailure,
} = userSlice.actions;

export default userSlice.reducer;