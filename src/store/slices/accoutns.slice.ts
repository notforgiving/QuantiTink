import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IListState } from "../../types/common";
import { ACCOUNTS, TFAccount } from "../../types/accounts.type";

export type TFAccountsState = IListState<TFAccount>

const accountsInitialState: TFAccountsState = {
    data: [],
    isLoading: false,
    errors: '' as unknown,
};

export const accountsSlice = createSlice({
    name: ACCOUNTS,
    initialState: accountsInitialState,
    reducers: {
        getaccountsListAction: (state: TFAccountsState) => {
            state.isLoading = true;
            state.errors = '';
        },
        getaccountsListSuccessAction: (
            state: TFAccountsState,
            { payload: list }: PayloadAction<TFAccount[]>
        ) => {
            const filterList = list.filter(el => el.type !== 'ACCOUNT_TYPE_INVEST_BOX')
            state.isLoading = false;
            state.data = filterList;
        },
        getaccountsListErrorAction: (
            state: TFAccountsState,
            { payload: error }: PayloadAction<unknown>
        ) => {
            state.isLoading = false;
            state.errors = error;
        },
    },
});

export default accountsSlice.reducer;