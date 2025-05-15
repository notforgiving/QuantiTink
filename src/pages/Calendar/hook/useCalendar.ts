import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { eventsSlice } from "../../../store/slices/events.slice";
import { StateType } from "../../../store/root-reducer";
import { getOnlyBondPositionsByPortfolio, searchInLocalStorageByKey, searchPortfolioInArrayData } from "../../../utils";
import { TEventsState } from "../../../types/event.type";
import moment from "moment";

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
            return searchPortfolioInArrayData(
                state.portfolios.data,
                "accountId",
                accountId || "0"
            );
        }
        return null;
    });

    useEffect(() => {
        const bondPositions = getOnlyBondPositionsByPortfolio(portfolio?.positions || [])
        const localData: TEventsState[] | null = searchInLocalStorageByKey('eventsSlice');
        // Если совсем пусто в локале
        // if (localData === null) {
        //     console.log('Локал сторадж совсем пустой, запрашиваем данные по портфелю');
        //     dispatch(eventsSlice.actions.getEventsListAction({ bondPositions, accountId: accountId || '0', empty: true }));
        // } else {
        //     const data = searchPortfolioInArrayData(localData, 'accountId', accountId || '0');
        //     if (data) {
        //         const updateTime = moment().diff(moment(data?.dateApi), 'minutes');
        //         console.log('Нашли данные по текущему портфолио');
        //         if (updateTime >= 60) {
        //             console.log(data, 'Прошел час, пора обновить портфель');
        //         } else {
        //             console.log('Просто записываем в стейт данные из localstorage');
        //             dispatch(eventsSlice.actions.getEventsListSuccessOnly([data]))
        //         }
        //     } else {
        //         dispatch(eventsSlice.actions.getEventsListAction({ bondPositions, accountId: accountId || '0', empty: false }));
        //         console.log(data, 'Не нашли данные по текущему портфолио');
        //     }
        // }
    }, [accountId, dispatch, portfolio?.positions])

    return {
        test: '123'
    }
}