import { createTypedHook } from 'hooks/selectors';

import { RootState } from '../../store';

export const useCurrency = createTypedHook((state: RootState) => state.currency);
