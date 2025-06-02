import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IListState } from "../../types/common";
import { EVENTS, EVENTS_LOCALSTORAGE_NAME, TEventsState } from "../../types/event.type";
import { TFPosition } from "../../types/portfolio.type";

export type TFEventsState = IListState<TEventsState>

const eventsInitialState: TFEventsState = {
    data: [],
    isLoading: false,
    errors: '' as unknown,
};

export const eventsSlice = createSlice({
    name: EVENTS,
    initialState: eventsInitialState,
    reducers: {
        getEventsListAction: (state: TFEventsState, { payload: _ }: PayloadAction<{ positions: TFPosition[], accountId: string }>) => {
            state.isLoading = true;
            state.errors = '';
        },
        getEventsListSuccessAction: (
            state: TFEventsState,
            { payload: list }: PayloadAction<TEventsState>
        ) => {
            state.isLoading = false;
            localStorage.setItem(EVENTS_LOCALSTORAGE_NAME, JSON.stringify([list]))
            state.data = [list]
        },
        getEventsListErrorAction: (
            state: TFEventsState,
            { payload: error }: PayloadAction<unknown>
        ) => {
            state.isLoading = false;
            state.errors = error;
        },
        getEventsListSuccessOnly: (state: TFEventsState, { payload: list }: PayloadAction<TEventsState[]>) => {
            state.isLoading = false;
            state.data = list;
            state.errors = '';
        }
    },
});

export default eventsSlice.reducer;