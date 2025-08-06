import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { TPortfolioResponse } from "./accountsTypes";

type TFlattenedPortfolio = Omit<TPortfolioResponse, 'accountId'>;

// Тип одного аккаунта
export type TAccount = {
  id: string;
  type: string;
  name: string;
  status: string;
  openedDate: string;
  closedDate: string;
  accessLevel: string;
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
  },
});

export const {
  fetchAccountsRequest,
  fetchAccountsSuccess,
  fetchAccountsFailure,
  clearAccounts,
  setPortfolioForAccount,
} = accountsSlice.actions;

// Оборачиваем с redux-persist
export default accountsSlice.reducer;
