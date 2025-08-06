import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TokenState {
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: TokenState = {
  token: null,
  loading: false,
  error: null,
};

const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    // === Чтение токена ===
    fetchTokenRequest: (state, _action: PayloadAction<string>) => {
      state.loading = true;
      state.error = null;
    },
    fetchTokenSuccess: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.token = action.payload;
    },
    fetchTokenFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // === Запись токена ===
    writeTokenRequest: (state, _action: PayloadAction<{ token: string; userId: string }>) => {
      state.loading = true;
      state.error = null;
    },
    writeTokenSuccess: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.token = action.payload;
    },
    writeTokenFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // === Удаление токена ===
    deleteTokenRequest: (state, _action: PayloadAction<string>) => {
      state.loading = true;
      state.error = null;
    },
    deleteTokenSuccess: (state) => {
      state.loading = false;
      state.token = null;
    },
    deleteTokenFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // === Очистка локального состояния ===
    clearToken: (state) => {
      state.token = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  fetchTokenRequest,
  fetchTokenSuccess,
  fetchTokenFailure,
  writeTokenRequest,
  writeTokenSuccess,
  writeTokenFailure,
  deleteTokenRequest,
  deleteTokenSuccess,
  deleteTokenFailure,
  clearToken,
} = tokenSlice.actions;

export default tokenSlice.reducer;