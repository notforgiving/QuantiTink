import { RootState } from "api/store";

import { createTypedHook } from "hooks/selectors";

export const useDemo = createTypedHook((state: RootState) => state.demo);