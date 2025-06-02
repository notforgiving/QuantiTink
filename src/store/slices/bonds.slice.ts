import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IEntityState } from "../../types/common";
import { TFPosition } from "../../types/portfolio.type";
import { BONDS, BONDS_LOCALSTORAGE_NAME, TInstrumentObject } from "../../types/bonds.type";
import { writeDataInlocalStorage } from "utils";

export type TFBondsState = IEntityState<TInstrumentObject>

const bondsInitialState: TFBondsState = {
    data: {
        accountId: '0',
        instrument: [],
        dateApi: '0',
    },
    isLoading: false,
    errors: '' as unknown,
};

export const bondsSlice = createSlice({
    name: BONDS,
    initialState: bondsInitialState,
    reducers: {
        getBondsListAction: (state: TFBondsState, { payload: _ }: PayloadAction<{ bondPositions: TFPosition[], accountId: string, }>) => {
            state.isLoading = true;
            state.errors = '';
        },
        getBondsListSuccessAction: (
            state: TFBondsState,
            { payload: response }: PayloadAction<TInstrumentObject>
        ) => {
            state.isLoading = false;
            writeDataInlocalStorage({ localStorageName: BONDS_LOCALSTORAGE_NAME, response });
            state.data = response;
        },
        getBondsListErrorAction: (
            state: TFBondsState,
            { payload: error }: PayloadAction<unknown>
        ) => {
            state.isLoading = false;
            state.errors = error;
        },
        getBondsListSuccessOnly: (state: TFBondsState, { payload: object }: PayloadAction<TInstrumentObject>) => {
            state.isLoading = false;
            state.data = object;
            state.errors = '';
        }
    },
});

export const { getBondsListAction, getBondsListSuccessOnly } = bondsSlice.actions;

export default bondsSlice.reducer;