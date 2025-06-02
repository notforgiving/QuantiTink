import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IEntityState } from "../../types/common";
import { TUserState, USER } from "types/user.type";

export type TFUserState = IEntityState<TUserState>

const userInitialState: TFUserState = {
    data: {
        email: null,
        accesstoken: null,
        id: null,
    },
    isLoading: false,
    errors: null,
};

type TPayloadGetUser = {
    email: string,
    password: string;
}

export const USER_LOCALSTORAGE_NAME = 'Tbalance_user';

export const userSlice = createSlice({
    name: USER,
    initialState: userInitialState,
    reducers: {
        createUserAction: (state: TFUserState, { payload: _ }: PayloadAction<TPayloadGetUser>) => {
            state.isLoading = true;
            state.errors = '';
        },
        loginUserAction: (state: TFUserState, { payload: _ }: PayloadAction<TPayloadGetUser>) => {
            state.isLoading = true;
            state.errors = '';
        },
        userSuccessAction: (
            state: TFUserState,
            { payload: user }: PayloadAction<TUserState>
        ) => {
            state.data = {
                ...user,
            }
            localStorage.setItem(USER_LOCALSTORAGE_NAME, JSON.stringify(user));
            state.isLoading = false;
        },
        userErrorAction: (
            state: TFUserState,
            { payload: error }: PayloadAction<unknown>
        ) => {
            state.isLoading = false;
            state.errors = error;
        },
        removeUserAction: (state: TFUserState,) => {
            state.data.email = null;
            state.data.accesstoken = null;
            state.data.id = null;
            // localStorage.removeItem(USER_LOCALSTORAGE_NAME);
            localStorage.clear();
        },
    },
});

export default userSlice.reducer;