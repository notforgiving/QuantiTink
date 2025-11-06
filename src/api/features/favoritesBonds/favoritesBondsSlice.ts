import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { TFavoriteBond } from "./favoritesBondsTypes";

export interface TFavoritesBondsState {
  data: TFavoriteBond[];
  loading: boolean;
  error: string | null;
}

const initialState: TFavoritesBondsState = {
  data: [],
  loading: false,
  error: null,
};

export const favoritesBondsSlice = createSlice({
  name: "favoritesBonds",
  initialState,
  reducers: {
    addFavoriteBondRequest(state, _action: PayloadAction<string>) {
      state.loading = true;
      state.error = null;
    },
    addFavoriteBondSuccess(state, action: PayloadAction<TFavoriteBond>) {
      state.loading = false;
      state.data.push(action.payload);
    },
    addFavoriteBondFailure(state, action: PayloadAction<string | null>) {
      state.loading = false;
      state.error = action.payload;
    },
    removeFavoriteBond(state, action: PayloadAction<string>) {
      state.data = state.data.filter((bond) => bond.isin !== action.payload);
    },
    clearFavorites(state) {
      state.data = [];
    },
    setFavorites(state, action: PayloadAction<TFavoriteBond[]>) {
      state.data = action.payload;
      state.loading = false;
    },
    loadFavorites(state) {
      state.loading = true;
      state.error = null;
    },
    loadFavoritesSuccess(state, action: PayloadAction<TFavoriteBond[]>) {
      state.loading = false;
      state.data = action.payload;
    },
    loadFavoritesFailure(state, action: PayloadAction<string | null>) {
      state.loading = false;
      state.error = action.payload;
    },
    removeFavoriteBondRequest(state, action: PayloadAction<string>) {
      state.loading = true;
      state.error = null;
    },
    removeFavoriteBondSuccess(state, action: PayloadAction<string>) {
      state.loading = false;
      state.data = state.data.filter((bond) => bond.isin !== action.payload);
    },
    removeFavoriteBondFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  addFavoriteBondRequest,
  addFavoriteBondSuccess,
  addFavoriteBondFailure,
  removeFavoriteBond,
  clearFavorites,
  setFavorites,
  loadFavorites,
  loadFavoritesSuccess,
  loadFavoritesFailure,
  removeFavoriteBondRequest,
  removeFavoriteBondSuccess,
  removeFavoriteBondFailure,
} = favoritesBondsSlice.actions;

export default favoritesBondsSlice.reducer;
