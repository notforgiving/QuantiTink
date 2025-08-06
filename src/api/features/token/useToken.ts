import { RootState } from "api/store";

import { createTypedHook } from "hooks/selectors";

export const selectTokenData = (state: RootState) => state.token;
export const useToken = createTypedHook(selectTokenData);

