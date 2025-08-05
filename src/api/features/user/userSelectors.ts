import { RootState } from "api/store";

export const selectUsers = (state: RootState) => state.user;
export const selectUserLoading = (state: RootState) => state.user.loading;
export const selectUserError = (state: RootState) => state.user.error;
