import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { eventsSlice } from "../../../store/slices/events.slice";
import { StateType } from "../../../store/root-reducer";
import { getOnlyEventsPositionsByPortfolio, searchInLocalStorageByKey, searchItemInArrayData } from "../../../utils";
import { TEventsState } from "../../../types/event.type";
import moment from "moment";
import { TFPosition } from "../../../types/portfolio.type";

interface IUseCalendar {
    accountId: string | undefined;
}

type TUseCalendar = (props: IUseCalendar) => {
    test: string;
}

export const useCalendar: TUseCalendar = ({ accountId }) => {
    const dispatch = useDispatch();
    const portfolio = useSelector((state: StateType) => {
        if (state.portfolios.data && !!state.portfolios.data?.length) {
            return searchItemInArrayData(
                state.portfolios.data,
                "accountId",
                accountId || "0"
            );
        }
        return null;
    });

    const handleDispatchEventsData = useCallback((positions: TFPosition[]) => {
        dispatch(eventsSlice.actions.getEventsListAction({ positions, accountId: accountId || '0' }));
    }, [accountId, dispatch])

    useEffect(() => {
        const eventsPositions = getOnlyEventsPositionsByPortfolio(portfolio?.positions || [])
        const localData: TEventsState[] | null = searchInLocalStorageByKey('eventsSlice');
        if (localData === null) {
            handleDispatchEventsData(eventsPositions)
        } else {
            const data = searchItemInArrayData(localData, 'accountId', accountId || '0');
            if (data && moment().diff(moment(data.dateApi), 'hours') <= 6) {
                dispatch(eventsSlice.actions.getEventsListSuccessOnly(localData))
            } else {
                handleDispatchEventsData(eventsPositions)
            }
        }

    }, [accountId, dispatch, handleDispatchEventsData, portfolio?.positions])

    return {
        test: '123'
    }
}