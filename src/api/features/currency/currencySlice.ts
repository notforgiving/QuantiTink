import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CurrencyRates {
    USD: number;
    CNY: number;
}

interface CurrencyState {
    rates: CurrencyRates;
    loading: boolean;
    error: string | null;
}

const initialState: CurrencyState = {
    rates: {
        USD: 0,
        CNY: 0,
    },
    loading: false,
    error: null,
};

const currencySlice = createSlice({
    name: "currency",
    initialState,
    reducers: {
        fetchCurrencyRatesRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchCurrencyRatesSuccess: (state, action: PayloadAction<CurrencyRates>) => {
            state.rates = action.payload;
            state.loading = false;
        },
        fetchCurrencyRatesFailure: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.loading = false;
        },
    },
});

export const {
    fetchCurrencyRatesRequest,
    fetchCurrencyRatesSuccess,
    fetchCurrencyRatesFailure,
} = currencySlice.actions;

export default currencySlice.reducer;
