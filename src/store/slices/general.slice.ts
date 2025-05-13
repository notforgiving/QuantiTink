import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TFFormattPrice } from "../../types/common";
import { GENERAL } from "../../types/general.type";

export type TFGeneralState = {
    totalAmountDepositsAllPortfolios: TFFormattPrice,
    totalAmountAllPortfolio: TFFormattPrice,
}

const generalInitialState: TFGeneralState = {
    totalAmountDepositsAllPortfolios: {
        formatt: '',
        value: 0,
    },
    totalAmountAllPortfolio: {
        formatt: '',
        value: 0,
    }
};

export const generalSlice = createSlice({
    name: GENERAL,
    initialState: generalInitialState,
    reducers: {
        /** Сумма пополнений всех брокерстких счетов */
        setTotalAmountDepositsAllPortfolios: (
            state: TFGeneralState,
            { payload }: PayloadAction<TFFormattPrice>
        ) => {
            return {
                ...state,
                totalAmountDepositsAllPortfolios: payload,
            }
        },
        /** Размер тела всех брокерских счетов */
        setTotalAmountAllPortfolio: (
            state: TFGeneralState,
            { payload }: PayloadAction<TFFormattPrice>
        ) => {
            return {
                ...state,
                totalAmountAllPortfolio: payload,
            }
        }

    },
});

export const { setTotalAmountDepositsAllPortfolios, setTotalAmountAllPortfolio } = generalSlice.actions

export default generalSlice.reducer;