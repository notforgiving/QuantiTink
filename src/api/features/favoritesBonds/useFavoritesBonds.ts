import { RootState } from "api/store";

import { createTypedHook } from "hooks/selectors";

export const useFavoritesBonds = createTypedHook((state: RootState) => state.favoritesBonds);