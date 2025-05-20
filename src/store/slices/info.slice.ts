import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IEntityState } from "../../types/common";
import { INFO, TInfoState } from "../../types/info.type";

export type TFInfoState = IEntityState<TInfoState>

const infoInitialState: TFInfoState = {
    data: {} as TInfoState,
    isLoading: false,
    errors: '' as unknown,
};

export const infoSlice = createSlice({
    name: INFO,
    initialState: infoInitialState,
    reducers: {
        getInfoAction: (state: TFInfoState) => {
            state.isLoading = true;
            state.errors = '';
        },
        getInfoSuccessAction: (
            state: TFInfoState,
            { payload: data }: PayloadAction<TInfoState>
        ) => {
            state.isLoading = false;
            state.data = data;
        },
        getInfoErrorAction: (
            state: TFInfoState,
            { payload: error }: PayloadAction<unknown>
        ) => {
            state.isLoading = false;
            state.errors = error;
        },
    },
});

export default infoSlice.reducer;