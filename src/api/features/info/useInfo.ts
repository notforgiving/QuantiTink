import { RootState } from "api/store";

import { createTypedHook } from "hooks/selectors";

export const useInfo = createTypedHook((state: RootState) => state.info);