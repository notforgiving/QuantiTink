import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IListState } from "../../types/common";
import { EVENTS, TEventsState } from "../../types/event.type";
import { TFPosition } from "../../types/portfolio.type";
import { searchInLocalStorageByKey, searchPortfolioInArrayData } from "../../utils";
import moment from "moment";

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
        getEventsListAction: (state: TFEventsState, { payload: _ }: PayloadAction<{ bondPositions: TFPosition[], accountId: string, empty: boolean }>) => {
            state.isLoading = true;
            state.errors = '';
        },
        getEventsListSuccessAction: (
            state: TFEventsState,
            { payload: list }: PayloadAction<TEventsState>
        ) => {
            state.isLoading = false;
            const localData: TEventsState[] | null = searchInLocalStorageByKey('eventsSlice');
            if (localData) {
                const data = searchPortfolioInArrayData(localData, 'accountId', list.accountId || '0');
                if (data) {
                    const updateTime = moment().diff(moment(data?.dateApi), 'minutes');
                    if (updateTime >= 60) {
                        console.log('Обновляем локалсторадж только этого портфолио и стейт');
                    }
                } else {
                    console.log('Добавляем в локалсторадж это портфолио и в стейт');
                }
            } else {
                localStorage.setItem('eventsSlice', JSON.stringify([list]))
                state.data = [list]
            }
        },
        getEventsListSuccessActionAdditional: (
            state: TFEventsState,
            { payload: list }: PayloadAction<TEventsState>
        ) => {
            const localData: TEventsState[] | null = searchInLocalStorageByKey('eventsSlice');
            if (localData) {
                const data = searchPortfolioInArrayData(localData, 'accountId', list.accountId || '0');
                if (!data) {
                    const newState = [...localData, list]
                    console.log(newState, 'newState');
                    localStorage.setItem('eventsSlice', JSON.stringify(newState))
                    state.data = newState
                    console.log('Запись в существующие данные');
                }
            }
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