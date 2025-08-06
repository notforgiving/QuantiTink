import { createTypedHook } from 'hooks/selectors';

import { RootState } from '../../store';

export const useAuth = createTypedHook((state: RootState) => state.user);
