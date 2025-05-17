import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { eventsSlice } from "../../../store/slices/events.slice";
import { StateType } from "../../../store/root-reducer";
import { formattedMoneySupply, getNumberMoney, getOnlyEventsPositionsByPortfolio, searchInLocalStorageByKey, searchItemInArrayData } from "../../../utils";
import { TEventsState, TPayOutsEvent } from "../../../types/event.type";
import moment from "moment";
import { TFPosition } from "../../../types/portfolio.type";
import { TInstrument } from "../../../types/bonds.type";
import { TShareInstrument } from "../../../types/share.type";
import 'moment/locale/ru';
import { TFFormattPrice } from "../../../types/common";

interface IUseCalendar {
    accountId: string | undefined;
}

type TUseCalendar = (props: IUseCalendar) => {
    payOuts: TPayOutsEvent[],
    monthPayBonds: TFFormattPrice,
    monthPayDiv: TFFormattPrice,
    yearAllPay: TFFormattPrice,
    additionalPayOuts: TPayOutsEvent[],
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
    const currency = useSelector((state: StateType) => state.currency.data) || 1
    const { data: bondsData } = useSelector((state: StateType) => state.bonds)
    const [payOuts, setPayOuts] = useState<TPayOutsEvent[]>([]);
    const [additionalPayOuts, setAdditionalPayOuts] = useState<TPayOutsEvent[]>([]);
    const [monthPayBonds, setMonthPayBonds] = useState<TFFormattPrice>({
        formatt: '0',
        value: 0,
    })
    const [monthPayDiv, setMonthPayDiv] = useState<TFFormattPrice>({
        formatt: '0',
        value: 0,
    })
    const [yearAllPay, setYearAllPay] = useState<TFFormattPrice>({
        formatt: '0',
        value: 0,
    })
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

                    tempObject.figi = event.figi;
                    tempObject.quantity = {
                        units: positionInfo?.quantityLots.units || '0',
                        nano: positionInfo?.quantityLots.nano || 0,
                    };

                    if (event.hasOwnProperty('dividendNet') && event.dividendNet.currency === 'rub') {
                        tempObject.paymentDate = event.paymentDate;
                        tempObject.payOneLot = event.dividendNet;
                        tempObject.operationType = 'Дивиденды';
                        tempObject.name = shareInfo?.name || 'Акция';
                        tempObject.oneLot = shareInfo?.lot || 1;
                        tempObject.brand = {
                            logoName: shareInfo?.brand.logoName || '',
                            logoBaseColor: shareInfo?.brand.logoBaseColor || '',
                            textColor: shareInfo?.brand.textColor || '',
                        }
                        tempObject.totalAmount = formattedMoneySupply(getNumberMoney(event.dividendNet) * Number(positionInfo?.quantityLots.units) * 0.87)
                        resultArray.push(tempObject)
                    } else {
                        if (event.hasOwnProperty('payOneBond')) {
                            tempObject.paymentDate = event.payDate;
                            tempObject.payOneLot = event.payOneBond;
                            tempObject.operationType = event.eventType === 'EVENT_TYPE_CPN' ? 'Купоны' : event.operationType === 'OA' ? 'Амортизация' : 'Погашение'
                            tempObject.name = bondInfo?.name || '';
                            tempObject.oneLot = 1;
                            tempObject.brand = {
                                logoName: bondInfo?.brand.logoName || '',
                                logoBaseColor: bondInfo?.brand.logoBaseColor || '',
                                textColor: bondInfo?.brand.textColor || '',
                            }
                            const currencyValue = event.payOneBond.currency === 'rub' ? 1 : currency
                            tempObject.totalAmount = formattedMoneySupply(getNumberMoney(event.payOneBond) * Number(positionInfo?.quantityLots.units) * currencyValue, bondInfo?.currency)
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
    }, [bondsData?.instrument, currency, eventsData, portfolio?.positions, sharesData?.instrument])

    useEffect(() => {
        if (payOuts && !!payOuts.length) {
            let monthBonds = 0;
            let monthDiv = 0;
            let year = 0;
            // Так как выплаты пропадают из выдачи мы записываем те, которые предназначены на следующий день
            const nextDayPayOuts: TPayOutsEvent[] = [];
            const nextYearDate = moment().add(1, 'y');
            const nextMonthDate = moment().add(1, 'M');
            const nextDay = moment().add(1, 'd').format('DD.MM.YYYY');
            payOuts.forEach(item => {
                if (item.operationType === 'Дивиденды' && moment(item.paymentDate) < nextMonthDate) {
                    monthDiv += item.totalAmount.value
                }
                if (item.operationType === 'Купоны' && moment(item.paymentDate) < nextMonthDate) {
                    monthBonds += item.totalAmount.value
                }
                if (moment(item.paymentDate) < nextYearDate) {
                    year += item.totalAmount.value
                }
                if (moment(item.paymentDate).format('DD.MM.YYYY') === nextDay) {
                    nextDayPayOuts.push(item)
                }
            })
            const nextDayPayOutsObj: { [x: string]: TPayOutsEvent[] } = {
                [accountId || '0']: nextDayPayOuts
            }
            const currentDayPayOuts: { [x: string]: TPayOutsEvent[] } | null = searchInLocalStorageByKey('currentDayPayOuts')
            if (currentDayPayOuts) {
                if (accountId && accountId in currentDayPayOuts) {
                    setAdditionalPayOuts(currentDayPayOuts[accountId])
                    delete currentDayPayOuts[accountId];
                    const temp = {
                        ...currentDayPayOuts,
                        ...nextDayPayOutsObj,
                    }
                    localStorage.setItem('currentDayPayOuts', JSON.stringify(temp))
                } else {
                    const temp = {
                        ...currentDayPayOuts,
                        ...nextDayPayOutsObj,
                    }
                    localStorage.setItem('currentDayPayOuts', JSON.stringify(temp))
                }
            } else {
                localStorage.setItem('currentDayPayOuts', JSON.stringify(nextDayPayOutsObj))
            }

            setMonthPayBonds(formattedMoneySupply(monthBonds))
            setMonthPayDiv(formattedMoneySupply(monthDiv))
            setYearAllPay(formattedMoneySupply(year))
        }
    }, [accountId, payOuts])

    return {
        payOuts,
        monthPayBonds,
        monthPayDiv,
        yearAllPay,
        additionalPayOuts,
    }
}