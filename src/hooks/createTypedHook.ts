import { RootState } from 'api/store/rootReducer';
import { useSelector } from 'react-redux';

export function createTypedHook<T>(selector: (state: RootState) => T) {
  return () => useSelector(selector);
}