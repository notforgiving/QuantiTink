import { useSelector } from 'react-redux';
import { RootState } from 'api/store';

export function createTypedHook<T>(selector: (state: RootState) => T) {
  return () => useSelector(selector);
}