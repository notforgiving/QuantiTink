import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IListState } from "../../types/common";
import { PORTFOLIOS, TFPortfolio } from "../../types/portfolio.type";
import { TFAccount } from "../../types/accounts.type";

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
            { payload: object }: PayloadAction<{
                accounts: TFAccount[],
                portfolios: TFPortfolio[],
            }>
        ) => {
            state.isLoading = false;
            let newState: TFUnionPortfolios[] = [];

            object.accounts.forEach(account => {
                const found = object.portfolios.find((element) => element.accountId === account.id);
                newState.push(found as TFUnionPortfolios)
            })
            state.data = newState;
        },
        getPortfoliosListErrorAction: (
            state: TFPortfolioState,
            { payload: error }: PayloadAction<unknown>
        ) => {
            state.isLoading = false;
            state.errors = error;
        },
        setPortfolioTotalAmountDeposits: (
            state: TFPortfolioState,
            { payload: portfolioId }: PayloadAction<string>
        ) => {
            console.log(state, portfolioId, 'portfolioId');

        }
    },
});

export const { setPortfolioTotalAmountDeposits } = portfoliosSlice.actions

export default portfoliosSlice.reducer;