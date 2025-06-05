import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IEntityState } from "../../types/common";
import { ALL_BONDS, ALL_BONDS_LOCALSTORAGE_NAME } from "types/calculationBonds.type";
import { TInstrumentObject } from "types/bonds.type";

export type TFAllBondsState = IEntityState<{
    instruments: TInstrumentObject['instrument'],
    dateApi: TInstrumentObject['dateApi'],
}>

const allBondsInitialState: TFAllBondsState = {
    data: {
        instruments: [],
        dateApi: '0',
    },
    isLoading: false,
    errors: '' as unknown,
};

export const allBondsSlice = createSlice({
    name: ALL_BONDS,
    initialState: allBondsInitialState,
    reducers: {
        getAllBondsListAction: (state: TFAllBondsState) => {
            state.isLoading = true;
            state.errors = '';
        },
        getAllBondsListSuccessAction: (
            state: TFAllBondsState,
            { payload: response }: PayloadAction<{
                instruments: TInstrumentObject['instrument'],
                dateApi: TInstrumentObject['dateApi'],
            }>
        ) => {
            state.data = response;
            state.isLoading = false;
        },
        getAllBondsListErrorAction: (
            state: TFAllBondsState,
            { payload: error }: PayloadAction<unknown>
        ) => {
            state.errors = error;
            state.isLoading = false;
        },
        getAllBondsListSuccessOnly: (state: TFAllBondsState, { payload: object }: PayloadAction<{
            instruments: TInstrumentObject['instrument'],
            dateApi: TInstrumentObject['dateApi'],
        }>) => {
            console.log(object, 'object');

            state.data = object;
            state.errors = '';
            state.isLoading = false;
        }
    },
});

export const { getAllBondsListAction, getAllBondsListSuccessAction, getAllBondsListErrorAction, getAllBondsListSuccessOnly } = allBondsSlice.actions;

export default allBondsSlice.reducer;