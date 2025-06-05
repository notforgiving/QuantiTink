import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IEntityState } from "../../types/common";
import { TFPosition } from "../../types/portfolio.type";
import { ETFS, ETFS_LOCALSTORAGE_NAME, TEtfsInstrumentObject } from "../../types/etfs.type";
import { writeDataInlocalStorage } from "utils";

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
            if (object.instrument.length !== 0) writeDataInlocalStorage({ localStorageName: ETFS_LOCALSTORAGE_NAME, response: object });
            state.data = object;
            state.isLoading = false;
        },
        getEtfsListErrorAction: (
            state: TFEtfsState,
            { payload: error }: PayloadAction<unknown>
        ) => {
            state.errors = error;
            state.isLoading = false;
        },
        getEtfsListSuccessOnly: (state: TFEtfsState, { payload: object }: PayloadAction<TEtfsInstrumentObject>) => {
            state.data = object;
            state.errors = '';
            state.isLoading = false;
        }
    },
});

export const { getEtfsListAction, getEtfsListSuccessOnly } = etfsSlice.actions;

export default etfsSlice.reducer;