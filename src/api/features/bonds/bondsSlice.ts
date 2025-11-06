import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { TBondsItem } from "./bondsTypes";

interface BondsState {
  data: TBondsItem[] | null;
  loading: boolean;
  error: string | null;
}

const initialState: BondsState = {
  data: null,
  loading: false,
  error: null,
};

const bondsSlice = createSlice({
  name: "bonds",
  initialState,
  reducers: {
    fetchBondsRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchBondsSuccess(state, action: PayloadAction<TBondsItem[]>) {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchBondsFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  fetchBondsRequest,
  fetchBondsSuccess,
  fetchBondsFailure,
} = bondsSlice.actions;

export default bondsSlice.reducer;
