import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { TInstrumentResponse, TOperationsResponse, TPortfolioResponse } from "./accountsTypes";

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
    fetchAccountsRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchAccountsSuccess(state, action: PayloadAction<TAccount[]>) {
      state.data = action.payload;
      state.loading = false;
    },
    fetchAccountsFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    clearAccounts(state) {
      state.data = [];
      state.error = null;
      state.loading = false;
    },
    setPortfolioForAccount: (
      state,
      action: PayloadAction<{ accountId: TAccount['id']; portfolio: TPortfolioResponse }>
    ) => {
      const { accountId, portfolio } = action.payload;
      const account = state.data.find((acc) => acc.id === accountId);
      if (account) {
        const { accountId, ...restPortfolio } = portfolio;

        Object.assign(account, restPortfolio);
      }
    },
    setOperationsForAccount: (
      state,
      action: PayloadAction<{ accountId: TAccount['id']; response: TOperationsResponse }>
    ) => {
      const { accountId, response } = action.payload;
      const account = state.data.find((acc) => acc.id === accountId);
      if (account) {
        account.operations = response.operations;
      }
    },
    fetchBondPositionsRequest(
      state,
      action: PayloadAction<{ accountId: TAccount["id"] }>
    ) {
      state.loading = true;
    },
    fetchBondPositionsSuccess(
      state,
      action: PayloadAction<{ accountId: TAccount["id"] }>
    ) {
      state.loading = false;
    },
    fetchBondPositionsFailure(
      state,
      action: PayloadAction<{ accountId: TAccount["id"]; error: string }>
    ) {
      state.loading = false;
      state.error = action.payload.error;
    },
    setBondForAccount: (
      state,
      action: PayloadAction<{
        accountId: TAccount["id"];
        figi: string;
        bond: TInstrumentResponse["instrument"];
      }>
    ) => {
      const { accountId, figi, bond } = action.payload;
      const account = state.data.find((acc) => acc.id === accountId);
      if (account && account.positions) {
        account.positions = account.positions.map((pos) =>
          pos.instrumentType === "bond" && pos.figi === figi
            ? { ...pos, instrument: bond }
            : pos
        );
      }
    },
  },
});

export const {
  fetchAccountsRequest,
  fetchAccountsSuccess,
  fetchAccountsFailure,
  clearAccounts,
  setPortfolioForAccount,
  setOperationsForAccount,
  fetchBondPositionsRequest,
  fetchBondPositionsSuccess,
  fetchBondPositionsFailure,
  setBondForAccount,
} = accountsSlice.actions;


export default accountsSlice.reducer;
