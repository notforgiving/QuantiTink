import { useSelector } from "react-redux";
import { RootState } from "api/store";

export const selectCalendarByAccount = (state: RootState, accountId: string) =>
  state.calendar[accountId]?.events ?? [];

export const selectCalendarLoading = (state: RootState, accountId: string) =>
  state.calendar[accountId]?.loading ?? false;

export const selectCalendarError = (state: RootState, accountId: string) =>
  state.calendar[accountId]?.error ?? null;

export function useCalendar(accountId: string) {
  const events = useSelector((state: RootState) => selectCalendarByAccount(state, accountId));
  const loading = useSelector((state: RootState) => selectCalendarLoading(state, accountId));
  const error = useSelector((state: RootState) => selectCalendarError(state, accountId));

  return { events, loading, error };
}