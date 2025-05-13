import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IListState } from "../../types/common";
import { OPERATIONS, TFOperation } from "../../types/operations.types";
import { TFAccount } from "../../types/accounts.type";

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
            { payload }: PayloadAction<{
                operations: TFUnionOperations[],
            }>
        ) => {
            state.isLoading = false;
            state.data = payload.operations;
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

export default operationsSlice.reducer;