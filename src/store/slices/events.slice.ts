import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IEntityState, IListState } from "../../types/common";
import { EVENTS, EVENTS_LOCALSTORAGE_NAME, TEventsState } from "../../types/event.type";
import { TFPosition } from "../../types/portfolio.type";
import { writeDataInlocalStorage } from "utils";

export type TFEventsState = IEntityState<TEventsState>

const eventsInitialState: TFEventsState = {
    data: {
        accountId: '0',
        portfolioEvents: [],
        dateApi: '0',
    },
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
            { payload }: PayloadAction<TEventsState>
        ) => {
            state.isLoading = false;
            writeDataInlocalStorage({ localStorageName: EVENTS_LOCALSTORAGE_NAME, response: payload });
            state.data = payload
        },
        getEventsListErrorAction: (
            state: TFEventsState,
            { payload: error }: PayloadAction<unknown>
        ) => {
            state.isLoading = false;
            state.errors = error;
        },
        getEventsListSuccessOnly: (state: TFEventsState, { payload }: PayloadAction<TEventsState>) => {
            state.isLoading = false;
            state.data = payload;
            state.errors = '';
        }
    },
});

export const { getEventsListAction, getEventsListSuccessOnly } = eventsSlice.actions;

export default eventsSlice.reducer;