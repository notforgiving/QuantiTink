import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IEntityState } from "../../types/common";
import { TFPosition } from "../../types/portfolio.type";
import { BONDS, TInstrumentObject } from "../../types/bonds.type";

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
            { payload: object }: PayloadAction<TInstrumentObject>
        ) => {
            state.isLoading = false;
            localStorage.setItem('bondsSlice', JSON.stringify(object))
            state.data = object
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

export default bondsSlice.reducer;