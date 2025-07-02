import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IListState } from "../../types/common";
import { ACCOUNTS, ACCOUNTS_LOCALSTORAGE_NAME, TFAccount } from "../../types/accounts.type";
import { writeDataInlocalStorage } from "utils";

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
        getAccountsListAction: (state: TFAccountsState) => {
            state.isLoading = true;
            state.errors = '';
        },
        getAccountsListSuccessAction: (
            state: TFAccountsState,
            { payload: list }: PayloadAction<TFAccount[]>
        ) => {
            // const localData = localStorage.getItem("Tbalance_hiddenAccoutns");
            // const localDataJSON: string[] = localData ? JSON.parse(localData) : [];
            const filterList = list.filter(el => el.type !== 'ACCOUNT_TYPE_INVEST_BOX');
            if (filterList.length !== 0) writeDataInlocalStorage({
                localStorageName: ACCOUNTS_LOCALSTORAGE_NAME, response: {
                    accountId: '0',
                    response: filterList,
                }
            });
            state.data = filterList;
            state.isLoading = false;
        },
        getAccountsSuccessOnly: (state: TFAccountsState,
            { payload: list }: PayloadAction<TFAccount[]>) => {
            state.isLoading = true;
            state.data = list;
            state.isLoading = false;
        },
        getAccountsListErrorAction: (
            state: TFAccountsState,
            { payload: error }: PayloadAction<unknown>
        ) => {
            state.isLoading = false;
            state.errors = error;
        },
    },
});

export const { getAccountsListAction, getAccountsListSuccessAction, getAccountsListErrorAction, getAccountsSuccessOnly } = accountsSlice.actions;

export default accountsSlice.reducer;