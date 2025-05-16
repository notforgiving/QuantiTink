import { put, takeEvery } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import { eventsSlice } from "../slices/events.slice";
import { GET_EVENTS_LIST, TEventsState, TPortfolioEvents } from "../../types/event.type";
import { fetchAllGetEventsAPI } from "../Api/events.api";
import { TFPosition } from "../../types/portfolio.type";
import moment from "moment";

function* getEventsListSaga({ payload: { positions, accountId } }: PayloadAction<{ positions: TFPosition[], accountId: string }>) {
    try {
        const response: TPortfolioEvents[][] = yield fetchAllGetEventsAPI(positions);
        const newRsponse: TEventsState = {
            accountId,
            portfolioEvents: [],
            dateApi: moment().utc().toString(),
        };
        response.forEach(events => {
            events.forEach(event => {
                newRsponse.portfolioEvents.push(event)
            })
        })
        yield put(eventsSlice.actions.getEventsListSuccessAction(newRsponse));
    } catch (error) {
        yield put(eventsSlice.actions.getEventsListErrorAction(error as string));
    }
}

export function* watchGetEvents() {
    yield takeEvery(GET_EVENTS_LIST, getEventsListSaga);
}
