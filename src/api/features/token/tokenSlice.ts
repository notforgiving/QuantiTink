import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type TTokenState = {
  data: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: TTokenState = {
  data: null,
  loading: false,
  error: null,
};

const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    fetchTokenRequest: (state, _action: PayloadAction<string>) => {
      state.loading = true;
      state.error = null;
    },
    fetchTokenSuccess: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.data = action.payload;
    },
    fetchTokenFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    writeTokenRequest: (state, _action: PayloadAction<{ token: string; userId: string }>) => {
      state.loading = true;
      state.error = null;
    },
    writeTokenSuccess: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.data = action.payload;
    },
    writeTokenFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    deleteTokenRequest: (state, _action: PayloadAction<string>) => {
      state.loading = true;
      state.error = null;
    },
    deleteTokenSuccess: () => initialState,
    deleteTokenFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    clearToken: () => initialState,
  },
  extraReducers: (builder) => {
    // Можно использовать если нужно сбрасывать еще по другим actions
    // builder.addCase(someOtherSlice.actions.logout, () => initialState);
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