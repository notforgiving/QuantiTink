import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IEntityState } from "../../types/common";
import { TCurrency, TCurrencyResponse } from "../../types/currency.type";

export type TFCurrencyState = IEntityState<TCurrency>

const currencyInitialState: TFCurrencyState = {
    data: 1,
    isLoading: false,
    errors: '' as unknown,
};

export const currencySlice = createSlice({
    name: 'currency',
    initialState: currencyInitialState,
    reducers: {
        getCurrencyListAction: (state: TFCurrencyState) => {
            state.isLoading = true;
            state.errors = '';
        },
        getCurrencyListSuccessAction: (
            state: TFCurrencyState,
            { payload: data }: PayloadAction<TCurrencyResponse>
        ) => {
            state.isLoading = false;
            state.data = data.conversion_rates['RUB'];
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