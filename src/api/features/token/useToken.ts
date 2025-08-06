import { createTypedHook } from 'hooks/createTypedHook';

import { RootState } from '../../store';

export const useToken = createTypedHook((state: RootState) => state.token);
