import { RootState } from "api/store";

import { createTypedHook } from "hooks/selectors";

export const useAccounts = createTypedHook((state: RootState) => state.accounts);