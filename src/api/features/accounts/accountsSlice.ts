import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { TAssetResponse, TBondsInstrumentResponse, TEtfsInstrumentResponse, TOperationsResponse, TPortfolioResponse, TSharesInstrumentResponse } from "./accountsTypes";

type TFlattenedPortfolio = Omit<TPortfolioResponse, 'accountId'>;

type TFlattenedOperations = Omit<TOperationsResponse, 'accountId'>;

// Тип одного аккаунта
export type TAccount = {
  id: string;
  type: string;
  name: string;
  status: string;
  openedDate: string;
  closedDate: string;
  accessLevel: string;
  operations?: TFlattenedOperations['operations'];
  goals?: Record<string, number>; // ✅ добавлено
} & TFlattenedPortfolio;

// Стейт слайса
interface AccountsState {
  data: TAccount[];
  loading: boolean;
  error: string | null;
}

const initialState: AccountsState = {
  data: [],
  loading: false,
  error: null,
};

const accountsSlice = createSlice({
  name: "accounts",
  initialState,
  reducers: {
    fetchAccountsRequest(state, _action: PayloadAction<void>) {
      state.loading = true;
    },
    fetchAccountsSuccess(state, action: PayloadAction<TAccount[]>) {
      state.data = action.payload;
      state.loading = false;
    },
    fetchAccountsFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    setPortfolioForAccount: (
      state,
      action: PayloadAction<{ accountId: TAccount['id']; portfolio: TPortfolioResponse }>
    ) => {
      const { accountId, portfolio } = action.payload;
      return {
        ...state,
        data: state.data.map((acc) =>
          acc.id === accountId ? { ...acc, ...portfolio } : acc
        ),
      };
    },
    setOperationsForAccount: (
      state,
      action: PayloadAction<{ accountId: TAccount['id']; response: TOperationsResponse }>
    ) => {
      const { accountId, response } = action.payload;
      return {
        ...state,
        data: state.data.map((acc) =>
          acc.id === accountId ? { ...acc, operations: response.operations } : acc
        ),
      };
    },
    fetchPositionsRequest(
      state,
      action: PayloadAction<{ accountId: TAccount["id"] }>
    ) {
      state.loading = true;
      state.error = null;
    },
    fetchPositionsSuccess(
      state,
      action: PayloadAction<{ accountId: TAccount["id"] }>
    ) {
      state.loading = false;
      state.error = null;
    },
    fetchPositionsFailure(
      state,
      action: PayloadAction<{ accountId: TAccount["id"]; error: string }>
    ) {
      state.loading = false;
      state.error = action.payload.error;
    },
    setInstrumentPositionForAccount: (
      state,
      action: PayloadAction<{
        accountId: TAccount["id"];
        figi: string;
        instrumentType: "bond" | "etf";
        instrument: Partial<TBondsInstrumentResponse["instrument"] & TEtfsInstrumentResponse["instrument"]>;
      }>
    ) => {
      const { accountId, figi, instrumentType, instrument } = action.payload;

      return {
        ...state,
        data: state.data.map((acc) =>
          acc.id === accountId && acc.positions
            ? {
              ...acc,
              positions: acc.positions.map((pos) => {
                if (pos.instrumentType === instrumentType && pos.figi === figi) {
                  const { figi: _f, ticker: _t, ...rest } = instrument;
                  return { ...pos, ...rest };
                }
                return pos;
              }),
            }
            : acc
        ),
      };
    },
    setShareInstrumentPositionForAccount: (
      state,
      action: PayloadAction<{
        accountId: TAccount["id"];
        figi: string;
        instrumentType: "share";
        instrument: TSharesInstrumentResponse["instrument"];
      }>
    ) => {
      const { accountId, figi, instrumentType, instrument } = action.payload;
      return {
        ...state,
        data: state.data.map((acc) =>
          acc.id === accountId && acc.positions
            ? {
              ...acc,
              positions: acc.positions.map((pos) => {
                if (pos.instrumentType === instrumentType && pos.figi === figi) {
                  // const { figi: _f, ticker: _t, ...rest } = instrument;
                  return { ...pos, ...instrument };
                }
                return pos;
              }),
            }
            : acc
        ),
      };
    },
    fetchAssetRequest(state, action: PayloadAction<{ accountId: TAccount["id"], currency: string }>) {
      state.loading = true;
    },
    fetchAssetSuccess(
      state,
      action: PayloadAction<{ accountId: TAccount["id"] }>
    ) {
      state.loading = false;
      state.error = null;
    },
    fetchAssetFailure(
      state,
      action: PayloadAction<{ accountId: TAccount["id"], error: string }>
    ) {
      state.loading = false;
      state.error = action.payload.error;
    },
    setAssetForAccount: (
      state,
      action: PayloadAction<{
        accountId: TAccount["id"];
        figi: string;
        asset: TAssetResponse['asset'];
      }>
    ) => {
      const { accountId, figi, asset } = action.payload;
      return {
        ...state,
        data: state.data.map((acc) =>
          acc.id === accountId && acc.positions
            ? {
              ...acc,
              positions: acc.positions.map((pos) => {
                if (pos.figi === figi) {
                  return { ...pos, asset: asset };
                }
                return pos;
              }
              ),
            }
            : acc
        ),
      };
    },
    // --- Fetch goals from Firebase ---
    fetchGoalsRequest(state, action: PayloadAction<{ accountId: string }>) {
      state.loading = true;
      state.error = null;
    },
    fetchGoalsSuccess(
      state,
      action: PayloadAction<{ accountId: string; goals: Record<string, number> }>
    ) {
      const { accountId, goals } = action.payload;
      state.data = state.data.map((acc) =>
        acc.id === accountId ? { ...acc, goals } : acc
      );
      state.loading = false;
    },
    fetchGoalsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    // --- Update (set) goals manually ---
    setGoalsForAccount(
      state,
      action: PayloadAction<{ accountId: string; goals: Record<string, number> }>
    ) {
      const { accountId, goals } = action.payload;
      state.data = state.data.map((acc) =>
        acc.id === accountId ? { ...acc, goals } : acc
      );
    },

    // --- Save goals to Firebase ---
    saveGoalsRequest(
      state,
      action: PayloadAction<{ accountId: string; goals: Record<string, number> }>
    ) {
      state.loading = true;
      state.error = null;
    },
    saveGoalsSuccess(
      state,
      action: PayloadAction<{ accountId: string; goals: Record<string, number> }>
    ) {
      const { accountId, goals } = action.payload;
      state.data = state.data.map((acc) =>
        acc.id === accountId ? { ...acc, goals } : acc
      );
      state.loading = false;
    },
    saveGoalsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchAccountsRequest,
  fetchAccountsSuccess,
  fetchAccountsFailure,
  setPortfolioForAccount,
  setOperationsForAccount,
  fetchPositionsRequest,
  fetchPositionsSuccess,
  fetchPositionsFailure,
  setInstrumentPositionForAccount,
  setShareInstrumentPositionForAccount,
  fetchAssetRequest,
  fetchAssetSuccess,
  fetchAssetFailure,
  setAssetForAccount,
  fetchGoalsRequest,
  fetchGoalsSuccess,
  fetchGoalsFailure,
  setGoalsForAccount,
  saveGoalsRequest,
  saveGoalsSuccess,
  saveGoalsFailure,
} = accountsSlice.actions;


export default accountsSlice.reducer;
