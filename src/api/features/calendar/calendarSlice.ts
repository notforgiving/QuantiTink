import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { TCalendarEvent } from "./calendarType";

type AccountCalendarState = {
    loading: boolean;
    error: string | null;
    events: TCalendarEvent[];
};

export type CalendarState = Record<string, AccountCalendarState>;

const initialState: CalendarState = {};

export const calendarSlice = createSlice({
    name: "calendar",
    initialState,
    reducers: {
        fetchCalendarRequest(
            state,
            action: PayloadAction<{ accountId: string }>
        ) {
            const { accountId } = action.payload;
            if (!state[accountId]) {
                state[accountId] = { loading: true, error: null, events: [] };
            } else {
                state[accountId].loading = true;
                state[accountId].error = null;
            }
        },
        fetchCalendarSuccess(
            state,
            action: PayloadAction<{ accountId: string; events: TCalendarEvent[] }>
        ) {
            const { accountId, events } = action.payload;
            state[accountId] = {
                loading: false,
                error: null,
                events,
            };
        },
        fetchCalendarFailure(
            state,
            action: PayloadAction<{ accountId: string; error: string }>
        ) {
            const { accountId, error } = action.payload;
            if (!state[accountId]) {
                state[accountId] = { loading: false, error, events: [] };
            } else {
                state[accountId].loading = false;
                state[accountId].error = error;
            }
        },
    },
});

export const {
    fetchCalendarRequest,
    fetchCalendarSuccess,
    fetchCalendarFailure,
} = calendarSlice.actions;

export default calendarSlice.reducer;
