import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IEntityState } from "../../types/common";
import { TUserState, USER } from "types/user.type";

export type TFUserState = IEntityState<TUserState>

const userInitialState: TFUserState = {
    data: {
        email: null,
        token: null,
        id: null,
    },
    isLoading: false,
    errors: '' as unknown,
};

export const userSlice = createSlice({
    name: USER,
    initialState: userInitialState,
    reducers: {
        getUserAction: (state: TFUserState) => {
            state.isLoading = true;
            state.errors = '';
        },
        getUserSuccessAction: (
            state: TFUserState,
            { payload: list }: PayloadAction<TUserState>
        ) => {
            // const filterList = list.filter((el:any) => el.type !== 'ACCOUNT_TYPE_INVEST_BOX')
            // state.isLoading = false;
            // state.data = filterList;
        },
        getUserErrorAction: (
            state: TFUserState,
            { payload: error }: PayloadAction<unknown>
        ) => {
            state.isLoading = false;
            state.errors = error;
        },
        removeUserAction: (state: TFUserState,) => {
            state.data.email = null;
            state.data.token = null;
            state.data.id = null;
        }
    },
});

export default userSlice.reducer;