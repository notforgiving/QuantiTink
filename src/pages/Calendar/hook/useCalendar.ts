import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getEventsListAction, getEventsListSuccessOnly } from "../../../store/slices/events.slice";
import { StateType } from "../../../store/root-reducer";
import {
  calcLotsForDividends,
  forkDispatch,
  formattedMoneySupply,
  getNumberMoney,
  getOnlyEventsPositionsByPortfolio,
  searchItemInArrayData,
} from "../../../utils";
import { EVENTS_LOCALSTORAGE_NAME, TPayOutsEvent } from "../../../types/event.type";
import moment from "moment";
import { TFPosition } from "../../../types/portfolio.type";
import { TInstrument } from "../../../types/bonds.type";
import { TShareInstrument } from "../../../types/share.type";
import "moment/locale/ru";
import { TFFormattPrice } from "../../../types/common";

interface IUseCalendar {
  accountId: string | undefined;
}

type TUseCalendar = (props: IUseCalendar) => {
  payOuts: TPayOutsEvent[];
  monthPayBonds: TFFormattPrice;
  monthPayDiv: TFFormattPrice;
  yearAllPay: TFFormattPrice;
  isLoadingCalc: boolean;
  filterFunction: (el: TPayOutsEvent) => boolean | TPayOutsEvent;
  currentFilter: TFFilterKey,
  setCurrentFilter: React.Dispatch<React.SetStateAction<TFFilterKey>>;
};

type TFFilterKey = "DEFAULT" | "DIVIDENDS" | "YEAR" | "MONTH";

export const useCalendar: TUseCalendar = ({ accountId }) => {
  moment.locale("ru");
  const [isLoadingCalc, setIsLoadingCalc] = useState<boolean>(false);
  const [currentFilter, setCurrentFilter] = useState<TFFilterKey>('DEFAULT');
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
  const currency = useSelector((state: StateType) => state.currency.data) || 1;
  const { data: bondsData } = useSelector((state: StateType) => state.bonds);
  const [payOuts, setPayOuts] = useState<TPayOutsEvent[]>([]);
  const [payOutsFiltred, setPayOutsFiltred] = useState<TPayOutsEvent[]>([]);
  const [monthPayBonds, setMonthPayBonds] = useState<TFFormattPrice>({
    formatt: "0",
    value: 0,
  });
  const [monthPayDiv, setMonthPayDiv] = useState<TFFormattPrice>({
    formatt: "0",
    value: 0,
  });
  const [yearAllPay, setYearAllPay] = useState<TFFormattPrice>({
    formatt: "0",
    value: 0,
  });
  const { data: eventsData } = useSelector((state: StateType) => state.events);
  const { data: sharesData } = useSelector((state: StateType) => state.shares);

  const portfolioOperations = useSelector((state: StateType) => {
    if (state.operations.data && !!state.operations.data?.length) {
      return searchItemInArrayData(
        state.operations.data,
        "accountId",
        accountId || "0"
      )?.operations;
    }
    return null;
  });

  useEffect(() => {
    const eventsPositions = getOnlyEventsPositionsByPortfolio(
      portfolio?.positions || []
    );
    const forkDispatchDataEvents = forkDispatch({ localStorageName: EVENTS_LOCALSTORAGE_NAME, accountId: accountId || '0' });
    forkDispatchDataEvents ? dispatch(getEventsListSuccessOnly(forkDispatchDataEvents)) : dispatch(getEventsListAction({ positions: eventsPositions, accountId: accountId || "0" }));

  }, [accountId, dispatch, portfolio?.positions]);

  useEffect(() => {
    setIsLoadingCalc(true);
    const resultArray: TPayOutsEvent[] = [];
    if (eventsData.portfolioEvents.length !== 0) {
      let bondInfo: TInstrument | null = null;
      let positionInfo: TFPosition | null = null;
      let shareInfo: TShareInstrument | null = null;
      eventsData.portfolioEvents.forEach((event) => {
        let tempObject: TPayOutsEvent = {} as TPayOutsEvent;

        if (bondInfo?.figi !== event.figi)
          bondInfo = searchItemInArrayData(
            bondsData?.instrument || [],
            "figi",
            event.figi
          );
        if (positionInfo?.figi !== event.figi)
          positionInfo = searchItemInArrayData(
            portfolio?.positions || [],
            "figi",
            event.figi
          );
        if (shareInfo?.figi !== event.figi)
          shareInfo = searchItemInArrayData(
            sharesData?.instrument || [],
            "figi",
            event.figi
          );

        tempObject.figi = event.figi;
        tempObject.quantity = {
          units: positionInfo?.quantityLots.units || "0",
          nano: positionInfo?.quantityLots.nano || 0,
        };

        if (
          event.hasOwnProperty("dividendNet") &&
          event.dividendNet.currency === "rub"
        ) {
          // Надо проверить, что событие уже прошло и найти такую же выплату в операциях после отсечки
          // Если нет такой выплаты смотрим сколько у нас было активов на эту дату, считаем лоты
          // Выдаем количество лотов для учета дивидендов конкретной выплаты
          const waitEventDividends = calcLotsForDividends(
            portfolioOperations || [],
            event
          );

          tempObject.paymentDate = event.paymentDate;
          tempObject.payOneLot = event.dividendNet;
          tempObject.operationType = "Дивиденды";
          tempObject.name = shareInfo?.name || "Акция";
          tempObject.oneLot = shareInfo?.lot || 1;
          tempObject.brand = {
            logoName: shareInfo?.brand.logoName || "",
            logoBaseColor: shareInfo?.brand.logoBaseColor || "",
            textColor: shareInfo?.brand.textColor || "",
          };
          tempObject.totalAmount = formattedMoneySupply(
            getNumberMoney(event.dividendNet) *
            Number(waitEventDividends.quantity) *
            0.87
          );
          // добавляем выплату в массив только если проверки пройдены или выплата все еще идет
          if (!waitEventDividends.receivedPayment && waitEventDividends.quantity !== 0) {
            resultArray.push(tempObject);
          }
        } else {
          if (event.hasOwnProperty("payOneBond")) {
            tempObject.paymentDate = event.payDate;
            tempObject.payOneLot = event.payOneBond;
            tempObject.operationType =
              event.eventType === "EVENT_TYPE_CPN"
                ? "Купоны"
                : event.operationType === "OA"
                  ? "Амортизация"
                  : "Погашение";
            tempObject.name = bondInfo?.name || "";
            tempObject.oneLot = 1;
            tempObject.brand = {
              logoName: bondInfo?.brand.logoName || "",
              logoBaseColor: bondInfo?.brand.logoBaseColor || "",
              textColor: bondInfo?.brand.textColor || "",
            };
            const currencyValue =
              event.payOneBond.currency === "rub" ? 1 : currency;
            tempObject.totalAmount = formattedMoneySupply(
              getNumberMoney(event.payOneBond) *
              Number(positionInfo?.quantityLots.units) *
              currencyValue,
              bondInfo?.currency
            );
            resultArray.push(tempObject);
          }
        }
      });

      const sortArray = resultArray.sort((a, b) => {
        return (
          new Date(a.paymentDate).getTime() -
          new Date(b.paymentDate).getTime()
        );
      });
      setPayOuts(sortArray);
    }
  }, [
    bondsData?.instrument,
    currency,
    eventsData,
    portfolio?.positions,
    portfolioOperations,
    sharesData?.instrument,
  ]);

  useEffect(() => {
    if (payOuts && !!payOuts.length) {
      let monthBonds = 0;
      let monthDiv = 0;
      let year = 0;
      // Так как выплаты пропадают из выдачи мы записываем те, которые предназначены на следующий день
      const nextYearDate = moment().add(1, "y");
      const nextMonthDate = moment().add(1, "M");
      payOuts.forEach((item) => {
        if (
          item.operationType === "Дивиденды" &&
          moment(item.paymentDate) < nextMonthDate
        ) {
          monthDiv += item.totalAmount.value;
        }
        if (
          item.operationType === "Купоны" &&
          moment(item.paymentDate) < nextMonthDate
        ) {
          monthBonds += item.totalAmount.value;
        }
        if (moment(item.paymentDate) < nextYearDate) {
          year += item.totalAmount.value;
        }
      });

      setMonthPayBonds(formattedMoneySupply(monthBonds));
      setMonthPayDiv(formattedMoneySupply(monthDiv));
      setYearAllPay(formattedMoneySupply(year));
      setIsLoadingCalc(false);
    }
  }, [accountId, payOuts]);

  const filterFunction = useCallback((el: TPayOutsEvent) => {
    if (currentFilter === 'DIVIDENDS') {
      return el.operationType === "Дивиденды";
    }

    if (currentFilter === 'YEAR') {
      return el;
    }

    if (currentFilter === 'MONTH') {
      return el;
    }

    if (currentFilter === 'DEFAULT') {
      return moment(el.paymentDate).year() === moment().year();
    }

    return el;
  }, [currentFilter])


  useEffect(() => {
    setIsLoadingCalc(true);
    let monthBonds = 0;
    let monthDiv = 0;
    let year = 0;
    let newPayOuts: TPayOutsEvent[] = [];
    const nextYearDate = moment().add(1, "y");
    const nextMonthDate = moment().add(1, "M");

    payOuts.forEach((item) => {
      if (currentFilter === 'DIVIDENDS' && item.operationType === "Дивиденды") {
        monthDiv += item.totalAmount.value;
        year += item.totalAmount.value;
        newPayOuts.push(item);
      }
      if (currentFilter === 'MONTH' && moment(item.paymentDate) < nextMonthDate) {
        if (
          item.operationType === "Дивиденды" &&
          moment(item.paymentDate) < nextMonthDate
        ) {
          monthDiv += item.totalAmount.value;
        }
        if (
          item.operationType === "Купоны" &&
          moment(item.paymentDate) < nextMonthDate
        ) {
          monthBonds += item.totalAmount.value;
        }
        if (moment(item.paymentDate) < nextYearDate) {
          year += item.totalAmount.value;
        }
        newPayOuts.push(item);
      }
      if (currentFilter === 'DEFAULT' && moment(item.paymentDate).year() === moment().year()) {
        if (
          item.operationType === "Дивиденды" &&
          moment(item.paymentDate) < nextMonthDate
        ) {
          monthDiv += item.totalAmount.value;
        }
        if (
          item.operationType === "Купоны" &&
          moment(item.paymentDate) < nextMonthDate
        ) {
          monthBonds += item.totalAmount.value;
        }
        if (moment(item.paymentDate) < nextYearDate) {
          year += item.totalAmount.value;
        }
        newPayOuts.push(item);
      }
      if (currentFilter === 'YEAR') {
        if (
          item.operationType === "Дивиденды" &&
          moment(item.paymentDate) < nextMonthDate
        ) {
          monthDiv += item.totalAmount.value;
        }
        if (
          item.operationType === "Купоны" &&
          moment(item.paymentDate) < nextMonthDate
        ) {
          monthBonds += item.totalAmount.value;
        }
        if (moment(item.paymentDate) < nextYearDate) {
          year += item.totalAmount.value;
        }
        newPayOuts.push(item);
      }
    })

    console.log(newPayOuts, 'newPayOuts');

    setMonthPayBonds(formattedMoneySupply(monthBonds));
    setMonthPayDiv(formattedMoneySupply(monthDiv));
    setYearAllPay(formattedMoneySupply(year));
    setPayOutsFiltred(newPayOuts);
    setIsLoadingCalc(false);
  }, [currentFilter, filterFunction, payOuts])

  return {
    payOuts: payOutsFiltred,
    monthPayBonds,
    monthPayDiv,
    yearAllPay,
    isLoadingCalc,
    filterFunction,
    currentFilter,
    setCurrentFilter,
  };
};
