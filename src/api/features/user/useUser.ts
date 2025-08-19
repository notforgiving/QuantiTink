import { createTypedHook } from 'hooks/selectors';

import { RootState } from '../../store';

export const useUser = createTypedHook((state: RootState) => state.user);
export const useTheme = createTypedHook((state: RootState) => state.user.currentUser?.theme);