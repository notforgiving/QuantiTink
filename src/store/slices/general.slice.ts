import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TFFormattPrice } from "../../types/common";
import { GENERAL } from "../../types/general.type";

export type TFGeneralState = {
    totalAmountDepositsAllPortfolios: TFFormattPrice,
    totalAmountAllPortfolio: TFFormattPrice,
    amountOfDepositsPortfolios: {
        [x: string]: TFFormattPrice,
    }
}

const generalInitialState: TFGeneralState = {
    totalAmountDepositsAllPortfolios: {
        formatt: '',
        value: 0,
    },
    totalAmountAllPortfolio: {
        formatt: '',
        value: 0,
    },
    amountOfDepositsPortfolios: {},
};

export const generalSlice = createSlice({
    name: GENERAL,
    initialState: generalInitialState,
    reducers: {
        /** Сумма пополнений всех брокерстких счетов */
        setTotalAmountDepositsAllPortfolios: (
            state: TFGeneralState,
            { payload }: PayloadAction<TFGeneralState['totalAmountDepositsAllPortfolios']>
        ) => {
            return {
                ...state,
                totalAmountDepositsAllPortfolios: payload,
            }
        },
        /** Размер тела всех брокерских счетов */
        setTotalAmountAllPortfolio: (
            state: TFGeneralState,
            { payload }: PayloadAction<TFGeneralState['totalAmountAllPortfolio']>
        ) => {
            return {
                ...state,
                totalAmountAllPortfolio: payload,
            }
        },
        /** Размер пополнений для каждого брокерского счета */
        setAmountOfDepositsPortfolios: (
            state: TFGeneralState,
            { payload }: PayloadAction<TFGeneralState['amountOfDepositsPortfolios']>
        ) => {
            return {
                ...state,
                amountOfDepositsPortfolios: payload,
            }
        }
    },
});

export const { setTotalAmountDepositsAllPortfolios, setTotalAmountAllPortfolio, setAmountOfDepositsPortfolios } = generalSlice.actions

export default generalSlice.reducer;