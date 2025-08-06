import { createTypedHook } from 'hooks/createTypedHook';

import { RootState } from '../../store';

export const useUser = createTypedHook((state: RootState) => state.user);