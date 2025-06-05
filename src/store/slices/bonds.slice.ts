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
            state.data = response;
            if (response.instrument.length !== 0) writeDataInlocalStorage({ localStorageName: BONDS_LOCALSTORAGE_NAME, response });
            state.isLoading = false;
        },
        getBondsListErrorAction: (
            state: TFBondsState,
            { payload: error }: PayloadAction<unknown>
        ) => {
            state.errors = error;
            state.isLoading = false;
        },
        getBondsListSuccessOnly: (state: TFBondsState, { payload: object }: PayloadAction<TInstrumentObject>) => {

            state.data = object;
            state.errors = '';
            state.isLoading = false;
        }
    },
});

export const { getBondsListAction, getBondsListSuccessOnly } = bondsSlice.actions;

export default bondsSlice.reducer;