import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IEntityState } from "../../types/common";
import { TFPosition } from "../../types/portfolio.type";
import { SHARES, TShareState } from "../../types/share.type";
export type TFSharesState = IEntityState<TShareState>

const sharesInitialState: TFSharesState = {
    data: {
        accountId: '0',
        instrument: [],
        dateApi: '0',
    },
    isLoading: false,
    errors: '' as unknown,
};

export const sharesSlice = createSlice({
    name: SHARES,
    initialState: sharesInitialState,
    reducers: {
        getSharesListAction: (state: TFSharesState, { payload: _ }: PayloadAction<{ sharesPositions: TFPosition[], accountId: string, }>) => {
            state.isLoading = true;
            state.errors = '';
        },
        getSharesListSuccessAction: (
            state: TFSharesState,
            { payload: object }: PayloadAction<TShareState>
        ) => {
            state.isLoading = false;
            localStorage.setItem('sharesSlice', JSON.stringify(object))
            state.data = object
        },
        getSharesListErrorAction: (
            state: TFSharesState,
            { payload: error }: PayloadAction<unknown>
        ) => {
            state.isLoading = false;
            state.errors = error;
        },
        getSharesListSuccessOnly: (state: TFSharesState, { payload: object }: PayloadAction<TShareState>) => {
            state.isLoading = false;
            state.data = object;
            state.errors = '';
        }
    },
});

export default sharesSlice.reducer;