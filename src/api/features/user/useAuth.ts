import { createTypedHook } from 'hooks/createTypedHook';
import { RootState } from '../../store';

export const useAuth = createTypedHook((state: RootState) => state.user);
