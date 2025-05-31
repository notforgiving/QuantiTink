import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IEntityState } from "../../types/common";
import { CURRENCY, TCurrency, TCurrencyResponse } from "../../types/currency.type";

export type TFCurrencyState = IEntityState<TCurrency>

const currencyInitialState: TFCurrencyState = {
    data: 80,
    isLoading: false,
    errors: '' as unknown,
};

export const currencySlice = createSlice({
    name: CURRENCY,
    initialState: currencyInitialState,
    reducers: {
        getCurrencyListAction: (state: TFCurrencyState) => {
            state.isLoading = true;
            state.errors = '';
        },
        getCurrencyListSuccessAction: (
            state: TFCurrencyState,
            { payload: data }: PayloadAction<TCurrencyResponse[]>
        ) => {
            state.isLoading = false;
            const currency = data.filter(el => el.category === 'DebitCardsTransfers')[0]
            state.data = currency.buy || 80;
        },
        getCurrencyListErrorAction: (
            state: TFCurrencyState,
            { payload: error }: PayloadAction<unknown>
        ) => {
            state.isLoading = false;
            state.errors = error;
        },
    },
});

export default currencySlice.reducer;