import { RootState } from "api/store";

import { createTypedHook } from "hooks/selectors";

export const selectAccountById = (state: RootState, id: string) =>
    state.accounts.data.find((acc) => acc.id === id);
export const useAccounts = createTypedHook((state: RootState) => state.accounts);
export const selectAccountData = (state: RootState) => state.accounts.data;