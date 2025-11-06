import { RootState } from "api/store";

import { createTypedHook } from "hooks/selectors";

export const selectBondsData = (state: RootState) => state.bonds;
export const useBonds = createTypedHook((state: RootState) => state.bonds);