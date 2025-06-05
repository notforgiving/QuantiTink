import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IListState } from "../../types/common";
import { PORTFOLIOS, PORTFOLIOS_LOCALSTORAGE_NAME, TFPortfolio } from "../../types/portfolio.type";
import { TFAccount } from "../../types/accounts.type";
import { writeDataInlocalStorage } from "utils";

type TFUnionPortfolios = TFPortfolio;
export type TFPortfolioState = IListState<TFUnionPortfolios>

const portfoliosInitialState: TFPortfolioState = {
    data: [],
    isLoading: false,
    errors: '' as unknown,
};

export const portfoliosSlice = createSlice({
    name: PORTFOLIOS,
    initialState: portfoliosInitialState,
    reducers: {
        getPortfoliosListAction: (state: TFPortfolioState, { payload: _ }: PayloadAction<TFAccount[]>) => {
            state.isLoading = true;
            state.errors = '';
        },
        getPortfoliosListSuccessAction: (
            state: TFPortfolioState,
            { payload: { accounts, portfolios } }: PayloadAction<{
                accounts: TFAccount[],
                portfolios: TFPortfolio[],
            }>
        ) => {
            let newState: TFUnionPortfolios[] = [];
            accounts.forEach(account => {
                if (!!portfolios.length) {
                    const found = portfolios.find((element) => element.accountId === account.id);
                    newState.push(found as TFUnionPortfolios)
                }
            })
            writeDataInlocalStorage({
                localStorageName: PORTFOLIOS_LOCALSTORAGE_NAME, response: {
                    accountId: '0',
                    response: newState,
                }
            });
            state.data = newState;
            state.isLoading = false;
        },
        getPortfoliosListSuccessOnly: (
            state: TFPortfolioState,
            { payload: data }: PayloadAction<TFUnionPortfolios[]>
        ) => {
            state.isLoading = true;
            state.data = data;
            state.isLoading = false;
        },
        getPortfoliosListErrorAction: (
            state: TFPortfolioState,
            { payload: error }: PayloadAction<unknown>
        ) => {
            state.isLoading = false;
            state.errors = error;
        }
    },
});

export const { getPortfoliosListAction, getPortfoliosListSuccessAction, getPortfoliosListSuccessOnly, getPortfoliosListErrorAction } = portfoliosSlice.actions;

export default portfoliosSlice.reducer;