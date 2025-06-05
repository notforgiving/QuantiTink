import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IEntityState } from "../../types/common";
import { TFPosition } from "../../types/portfolio.type";
import { SHARE_LOCALSTORAGE_NAME, SHARES, TShareState } from "../../types/share.type";
import { writeDataInlocalStorage } from "utils";
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
            if (object.instrument.length !== 0) writeDataInlocalStorage({ localStorageName: SHARE_LOCALSTORAGE_NAME, response: object });
            state.data = object;
            state.isLoading = false;
        },
        getSharesListErrorAction: (
            state: TFSharesState,
            { payload: error }: PayloadAction<unknown>
        ) => {
            state.errors = error;
            state.isLoading = false;
        },
        getSharesListSuccessOnly: (state: TFSharesState, { payload: object }: PayloadAction<TShareState>) => {
            state.data = object;
            state.errors = '';
            state.isLoading = false;
        }
    },
});

export const { getSharesListAction, getSharesListSuccessOnly } = sharesSlice.actions;

export default sharesSlice.reducer;