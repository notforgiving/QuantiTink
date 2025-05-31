import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IEntityState } from "../../types/common";
import { TFToken, TOKEN, TOKEN_LOCALSTORAGE_NAME } from "types/token.type";

export type TFTokenState = IEntityState<TFToken>

const tokenInitialState: TFTokenState = {
    data: {
        token: null,
    },
    isLoading: false,
    errors: null,
};

export const tokenSlice = createSlice({
    name: TOKEN,
    initialState: tokenInitialState,
    reducers: {
        setTokenAction: (state: TFTokenState, { payload: _ }: PayloadAction<{ token: string, userId: string }>) => {
            state.isLoading = true;
            state.errors = '';
        },
        getTokenAction: (state: TFTokenState, { payload: _ }: PayloadAction<string>) => {
            state.isLoading = true;
            state.errors = '';
        },
        tokenSuccessAction: (
            state: TFTokenState,
            { payload: token }: PayloadAction<string | null>
        ) => {
            localStorage.setItem(TOKEN_LOCALSTORAGE_NAME, JSON.stringify(token));
            state.data = {
                token,
            }
            state.isLoading = false;
        },
        tokenErrorAction: (
            state: TFTokenState,
            { payload: error }: PayloadAction<unknown>
        ) => {
            state.isLoading = false;
            state.errors = error;
        },
        removeTokenAction: (state: TFTokenState,) => {
            state.data.token = null;
            localStorage.removeItem(TOKEN_LOCALSTORAGE_NAME);
        },
    },
});

export default tokenSlice.reducer;