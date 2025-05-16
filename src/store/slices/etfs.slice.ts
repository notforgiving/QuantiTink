import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IEntityState } from "../../types/common";
import { TFPosition } from "../../types/portfolio.type";
import { ETFS, TEtfsInstrumentObject } from "../../types/etfs.type";

export type TFEtfsState = IEntityState<TEtfsInstrumentObject>

const eventsInitialState: TFEtfsState = {
    data: {
        accountId: '0',
        instrument: [],
        dateApi: '0',
    },
    isLoading: false,
    errors: '' as unknown,
};

export const etfsSlice = createSlice({
    name: ETFS,
    initialState: eventsInitialState,
    reducers: {
        getEtfsListAction: (state: TFEtfsState, { payload: _ }: PayloadAction<{ etfPositions: TFPosition[], accountId: string, }>) => {
            state.isLoading = true;
            state.errors = '';
        },
        getEtfsListSuccessAction: (
            state: TFEtfsState,
            { payload: object }: PayloadAction<TEtfsInstrumentObject>
        ) => {
            state.isLoading = false;
            localStorage.setItem('etfsSlice', JSON.stringify(object))
            state.data = object
        },
        getEtfsListErrorAction: (
            state: TFEtfsState,
            { payload: error }: PayloadAction<unknown>
        ) => {
            state.isLoading = false;
            state.errors = error;
        },
        getEtfsListSuccessOnly: (state: TFEtfsState, { payload: object }: PayloadAction<TEtfsInstrumentObject>) => {
            state.isLoading = false;
            state.data = object;
            state.errors = '';
        }
    },
});

export default etfsSlice.reducer;