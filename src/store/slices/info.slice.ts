import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IEntityState } from "../../types/common";
import { INFO, INFO_LOCALSTORAGE_NAME, TInfoState } from "../../types/info.type";
import { writeDataInlocalStorage } from "utils";

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
            writeDataInlocalStorage({
                localStorageName: INFO_LOCALSTORAGE_NAME, response: {
                    accountId: '0',
                    response: data,
                }
            });
            state.data = data;
            state.isLoading = false;
        },
        getInfoSuccessOnly: (state: TFInfoState, { payload: object }: PayloadAction<TInfoState>) => {
            state.isLoading = true;
            state.data = object;
            state.isLoading = false;
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

export const { getInfoAction, getInfoSuccessAction, getInfoSuccessOnly } = infoSlice.actions;

export default infoSlice.reducer;