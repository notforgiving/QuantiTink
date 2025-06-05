import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IListState } from "../../types/common";
import { OPERATIONS, OPERATIONS_LOCALSTORAGE_NAME, TFOperation } from "../../types/operations.types";
import { TFAccount } from "../../types/accounts.type";
import { writeDataInlocalStorage } from "utils";

export type TFUnionOperations = { accountId: string, operations: TFOperation[] };
export type TFOperationsState = IListState<TFUnionOperations>

const operationsInitialState: TFOperationsState = {
    data: [],
    isLoading: false,
    errors: '' as unknown,
};

export const operationsSlice = createSlice({
    name: OPERATIONS,
    initialState: operationsInitialState,
    reducers: {
        getOperationsListAction: (state: TFOperationsState, { payload: _ }: PayloadAction<TFAccount[]>) => {
            state.isLoading = true;
            state.errors = '';
        },
        getOperationsListSuccessAction: (
            state: TFOperationsState,
            { payload }: PayloadAction<TFUnionOperations[]>
        ) => {
            state.data = payload;
            writeDataInlocalStorage({
                localStorageName: OPERATIONS_LOCALSTORAGE_NAME, response: payload,
            });
            state.isLoading = false;
        },
        getOperationsListSuccessOnly: (
            state: TFOperationsState,
            { payload }: PayloadAction<TFUnionOperations[]>
        ) => {
            state.data = payload;
            state.isLoading = false;
        },
        getOperationsListErrorAction: (
            state: TFOperationsState,
            { payload: error }: PayloadAction<unknown>
        ) => {
            state.isLoading = false;
            state.errors = error;
        },
    },
});

export const { getOperationsListAction, getOperationsListSuccessAction, getOperationsListSuccessOnly, getOperationsListErrorAction } = operationsSlice.actions;

export default operationsSlice.reducer;