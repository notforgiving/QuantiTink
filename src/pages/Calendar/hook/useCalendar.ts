import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { eventsSlice } from "../../../store/slices/events.slice";
import { StateType } from "../../../store/root-reducer";
import { getOnlyEventsPositionsByPortfolio, searchInLocalStorageByKey, searchItemInArrayData } from "../../../utils";
import { TEventsState, TPayOutsEvent } from "../../../types/event.type";
import moment from "moment";
import { TFPosition } from "../../../types/portfolio.type";
import { TInstrument } from "../../../types/bonds.type";
import { TShareInstrument } from "../../../types/share.type";

interface IUseCalendar {
    accountId: string | undefined;
}

type TUseCalendar = (props: IUseCalendar) => {
    payOuts: TPayOutsEvent[]
}

export const useCalendar: TUseCalendar = ({ accountId }) => {
    moment.locale("ru");
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
    const { data: bondsData } = useSelector((state: StateType) => state.bonds)
    const [payOuts, setPayOuts] = useState<TPayOutsEvent[]>([]);
    const { data: eventsData } = useSelector((state: StateType) => state.events);
    const { data: sharesData } = useSelector((state: StateType) => state.shares);
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


    useEffect(() => {
        const resultArray: TPayOutsEvent[] = [];
        if (eventsData?.length !== 0) {
            console.log(eventsData, 'eventsData');
            if (eventsData && eventsData[0].portfolioEvents) {
                let bondInfo: TInstrument | null = null;
                let positionInfo: TFPosition | null = null;
                let shareInfo: TShareInstrument | null = null;
                eventsData[0].portfolioEvents.forEach(event => {
                    let tempObject: TPayOutsEvent = {} as TPayOutsEvent;
                    if (bondInfo?.figi !== event.figi) bondInfo = searchItemInArrayData(bondsData?.instrument || [], 'figi', event.figi);
                    if (positionInfo?.figi !== event.figi) positionInfo = searchItemInArrayData(portfolio?.positions || [], 'figi', event.figi)
                    if (shareInfo?.figi !== event.figi) shareInfo = searchItemInArrayData(sharesData?.instrument || [], 'figi', event.figi)
                    if (event.hasOwnProperty('dividendNet') && event.dividendNet.currency === 'rub') {
                        tempObject.figi = event.figi;
                        tempObject.paymentDate = event.paymentDate;
                        tempObject.payOneLot = event.dividendNet;
                        tempObject.operationType = 'Дивиденды';
                        tempObject.name = shareInfo?.name || 'Акция';
                        tempObject.quantity = {
                            units: positionInfo?.quantityLots.units || '0',
                            nano: positionInfo?.quantityLots.nano || 0,
                        };
                        tempObject.oneLot = shareInfo?.lot || 1;
                        tempObject.brand = {
                            logoName: shareInfo?.brand.logoName || '',
                            logoBaseColor: shareInfo?.brand.logoBaseColor || '',
                            textColor: shareInfo?.brand.textColor || '',
                        }
                        resultArray.push(tempObject)
                    } else {
                        if (event.hasOwnProperty('payOneBond')) {
                            tempObject.figi = event.figi;
                            tempObject.paymentDate = event.payDate;
                            tempObject.payOneLot = event.payOneBond;
                            tempObject.operationType = 'Купоны'
                            tempObject.name = bondInfo?.name || '';
                            tempObject.quantity = {
                                units: positionInfo?.quantity.units || '0',
                                nano: positionInfo?.quantityLots.nano || 0,
                            };
                            tempObject.oneLot = 1;
                            tempObject.brand = {
                                logoName: bondInfo?.brand.logoName || '',
                                logoBaseColor: bondInfo?.brand.logoBaseColor || '',
                                textColor: bondInfo?.brand.textColor || '',
                            }
                            resultArray.push(tempObject)
                        }
                    }

                })

                const sortArray = resultArray.sort((a, b) => {
                    return new Date(a.paymentDate).getTime() - new Date(b.paymentDate).getTime();
                });
                setPayOuts(sortArray)
            }

        }
    }, [bondsData?.instrument, eventsData, portfolio?.positions, sharesData?.instrument])

    return {
        payOuts,
    }
}