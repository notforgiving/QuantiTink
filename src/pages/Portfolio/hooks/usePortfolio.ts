import { useSelector } from "react-redux";
import { StateType } from "../../../store/root-reducer";
import { calcSummOfAllDeposits, formattedMoneySupply, getNumberMoney, getPercentByTarget, searchInLocalStorageByKey, searchItemInArrayData } from "../../../utils";
import { TFAccount } from "../../../types/accounts.type";
import { TFPortfolio } from "../../../types/portfolio.type";
import { useEffect, useState } from "react";
import { TFFormattPrice } from "../../../types/common";
import moment from "moment";
import { useDispatch } from "react-redux";
import { bondsSlice } from "../../../store/slices/bonds.slice";
import { TInstrumentObject } from "../../../types/bonds.type";
import { etfsSlice } from "../../../store/slices/etfs.slice";
import { sharesSlice } from "../../../store/slices/share.slice";

interface IUsePortfolio {
    accountId: string;
}

type TUsePortfolio = (props: IUsePortfolio) => {
    account: TFAccount | null
    portfolio: TFPortfolio | null,
    /** Сумма вложенных денег */
    amountInvestments: TFFormattPrice
    /** Текущая цена портфеля */
    currentPrice: TFFormattPrice
    /** Доходность в проентах */
    differencePercent: number;
    /** Дата начала инвестирования */
    portfolioStart: string;
    /** Срок инвестирования */
    investmentPeriod: number | null;
    /** Уплаченно комисиий */
    commissions: TFFormattPrice;
    /** Уплачено налогов */
    taxes: TFFormattPrice;
    /** Получено купонов */
    coupons: TFFormattPrice;
    /** Получено дивидендов */
    dividends: TFFormattPrice;
    /** Текущая доходность */
    currentProfitability: number;
    /** Сумма всех акций и процент от портфеля */
    shares: TFFormattPrice & { percent: number }
    /** Сумма всех рублевых облигаций и процент от портфеля */
    rubBonds: TFFormattPrice & { percent: number }
    /** Сумма всех валютых облигаций и процент от портфеля */
    usdBonds: TFFormattPrice & { percent: number }
    /** Все фонды */
    etfArray: (TFFormattPrice & { percent: number, name: string, ticker: string; })[]
}

export const usePortfolio: TUsePortfolio = ({ accountId }) => {
    const dispatch = useDispatch()
    const [currentPrice, setCurrentPrice] = useState<TFFormattPrice>({
        formatt: '',
        value: 0,
    })
    const [amountInvestments, setAmountInvestments] = useState<TFFormattPrice>({
        formatt: '',
        value: 0,
    })
    const [commissions, setCommissions] = useState<TFFormattPrice>({
        formatt: '',
        value: 0,
    })
    const [taxes, setTaxes] = useState<TFFormattPrice>({
        formatt: '',
        value: 0,
    })
    const [coupons, setCoupons] = useState<TFFormattPrice>({
        formatt: '',
        value: 0,
    })
    const [dividends, setDividends] = useState<TFFormattPrice>({
        formatt: '',
        value: 0,
    })
    const [shares, setShares] = useState<TFFormattPrice & { percent: number }>({
        formatt: '',
        value: 0,
        percent: 0,
    })
    const [rubBonds, setRubBonds] = useState<TFFormattPrice & { percent: number }>({
        formatt: '',
        value: 0,
        percent: 0,
    })
    const [usdBonds, setUsdBonds] = useState<TFFormattPrice & { percent: number }>({
        formatt: '',
        value: 0,
        percent: 0,
    })
    const [etfArray, setEtfArray] = useState<(TFFormattPrice & { percent: number, name: string, ticker: string; })[]>([])
    const [currentProfitability, setCurrentProfitability] = useState<number>(0);
    const [differencePercent, setDifferencePercent] = useState<number>(0);
    const [portfolioStart, setPortfolioStart] = useState<string>('0');
    const [investmentPeriod, setInvestmentPeriod] = useState<number | null>(null);

    const account = useSelector((state: StateType) => {
        if (state.accounts.data && !!state.accounts.data?.length) {
            return searchItemInArrayData(
                state.accounts.data,
                "id",
                accountId || "0"
            );
        }
        return null;
    });
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
    const operations = useSelector((state: StateType) => {
        if (state.operations.data && !!state.operations.data?.length) {
            return searchItemInArrayData(
                state.operations.data,
                "accountId",
                accountId || "0"
            )?.operations;
        }
        return null;
    });
    const { data: etfData } = useSelector((state: StateType) => state.etfs);
    const { data: bondsData } = useSelector((state: StateType) => state.bonds);

    useEffect(() => {
        if (portfolio) {
            setCurrentPrice(formattedMoneySupply(
                getNumberMoney(portfolio.totalAmountPortfolio)
            ))
            setDifferencePercent(getPercentByTarget(currentPrice.value - amountInvestments.value, amountInvestments.value))
            const formatShares = formattedMoneySupply(
                getNumberMoney(portfolio?.totalAmountShares)
            )
            setShares({
                formatt: formatShares.formatt,
                value: formatShares.value,
                percent: getPercentByTarget(formatShares.value, currentPrice.value),
            })
        }
    }, [amountInvestments.value, currentPrice.value, portfolio])

    useEffect(() => {
        if (operations && !!operations.length) {
            const summ = formattedMoneySupply(calcSummOfAllDeposits([{
                accountId: accountId,
                operations,
            }]))
            setAmountInvestments(summ)
            setPortfolioStart(moment(operations[operations.length - 1].date).format("DD.MM.YYYY"))
            setInvestmentPeriod(moment().diff(moment(operations[operations.length - 1].date), "months"))
        }

    }, [accountId, operations])

    useEffect(() => {
        if (operations) {
            let tempcom = 0;
            let temptax = 0;
            let tempcoup = 0;
            let tempdiv = 0;

            operations.forEach((el) => {
                if (el.type === 'Удержание налога' || el.type === 'Удержание налога по дивидендам') {
                    temptax += getNumberMoney(el.payment);
                }
                if (el.type === 'Удержание комиссии за операцию') {
                    tempcom += getNumberMoney(el.payment);
                }
                if (el.type === 'Выплата купонов') {
                    tempcoup += getNumberMoney(el.payment);
                }
                if (el.type === 'Выплата дивидендов' || el.type === 'Выплата дивидендов на карту') { 
                    tempdiv += getNumberMoney(el.payment) * 0.87;
                }
            })

            setCommissions(formattedMoneySupply(tempcom === 0 ? 0 : tempcom * (-1)))
            setTaxes(formattedMoneySupply(temptax === 0 ? 0 : temptax * (-1)))
            setCoupons(formattedMoneySupply(tempcoup))
            setDividends(formattedMoneySupply(tempdiv))
        }
    }, [operations])

    useEffect(() => {
        setCurrentProfitability(getPercentByTarget(coupons.value + dividends.value, amountInvestments.value))
    }, [amountInvestments.value, coupons, dividends])

    useEffect(() => {
        if (portfolio?.positions.length !== 0) {
            const bondPositions = portfolio?.positions.filter((el) => el.instrumentType === "bond") || []
            const localDataBondsSlice: TInstrumentObject | null = searchInLocalStorageByKey('bondsSlice');
            if (localDataBondsSlice === null) {
                dispatch(bondsSlice.actions.getBondsListAction({ bondPositions, accountId }))
            } else {
                const data = searchItemInArrayData([localDataBondsSlice], 'accountId', accountId || '0');
                if (data) {
                    dispatch(bondsSlice.actions.getBondsListSuccessOnly(localDataBondsSlice))
                } else {
                    dispatch(bondsSlice.actions.getBondsListAction({ bondPositions, accountId }))
                }
            }
            const etfPositions = portfolio?.positions.filter((el) => el.instrumentType === 'etf') || [];
            const localDataEtfsSlice: TInstrumentObject | null = searchInLocalStorageByKey('etfsSlice');
            if (localDataEtfsSlice === null) {
                dispatch(etfsSlice.actions.getEtfsListAction({ etfPositions, accountId }))
            } else {
                const data = searchItemInArrayData([localDataEtfsSlice], 'accountId', accountId || '0');
                if (data) {
                    dispatch(etfsSlice.actions.getEtfsListSuccessOnly(localDataEtfsSlice))
                } else {
                    dispatch(etfsSlice.actions.getEtfsListAction({ etfPositions, accountId }))
                }
            }
            const sharesPositions = portfolio?.positions.filter((el) => el.instrumentType === 'share') || [];
            const localDataSharesSlice: TInstrumentObject | null = searchInLocalStorageByKey('sharesSlice');
            if (localDataSharesSlice === null) {
                dispatch(sharesSlice.actions.getSharesListAction({ sharesPositions, accountId }))
            } else {
                const data = searchItemInArrayData([localDataEtfsSlice], 'accountId', accountId || '0');
                if (data) {
                    dispatch(sharesSlice.actions.getSharesListSuccessOnly(localDataSharesSlice))
                } else {
                    dispatch(sharesSlice.actions.getSharesListAction({ sharesPositions, accountId }))
                }
            }
        }
    }, [accountId, dispatch, portfolio])

    useEffect(() => {
        if (bondsData) {
            let rubBonds = 0;
            let usdBonds = 0;
            bondsData.instrument.forEach((bond) => {
                const positionItem = searchItemInArrayData(portfolio?.positions || [], 'figi', bond.figi)
                const quantity = Number(positionItem?.quantity.units);
                const currentPrice = getNumberMoney(positionItem?.currentPrice || null)
                if (bond.nominal.currency === 'rub') {
                    rubBonds += quantity * currentPrice
                } else {
                    usdBonds += quantity * currentPrice
                }
            })
            setUsdBonds({
                formatt: formattedMoneySupply(usdBonds).formatt,
                value: usdBonds,
                percent: getPercentByTarget(usdBonds, currentPrice.value)
            })
            setRubBonds({
                formatt: formattedMoneySupply(rubBonds).formatt,
                value: rubBonds,
                percent: getPercentByTarget(rubBonds, currentPrice.value)
            })
        }
    }, [bondsData, currentPrice.value, portfolio?.positions])

    useEffect(() => {
        if (etfData && etfData.instrument) {
            const formattEtfs = etfData.instrument.map(etf => {
                const etfAsPortfolioPosition = searchItemInArrayData(portfolio?.positions || [], 'figi', etf.figi)
                const currentPriceLot = formattedMoneySupply(getNumberMoney(etfAsPortfolioPosition?.currentPrice || null))
                const quantityLots = Number(etfAsPortfolioPosition?.quantityLots.units);
                const totalPrice = formattedMoneySupply(currentPriceLot.value * quantityLots)
                const resultObj = {
                    name: etf.name,
                    ticker: etf.ticker,
                    formatt: totalPrice.formatt,
                    value: totalPrice.value,
                    percent: getPercentByTarget(totalPrice.value, currentPrice.value),
                }
                return resultObj;
            })
            setEtfArray(formattEtfs)
        }
    }, [currentPrice.value, etfData, portfolio?.positions])

    return {
        account,
        portfolio,
        amountInvestments,
        currentPrice,
        differencePercent,
        portfolioStart,
        investmentPeriod,
        commissions,
        taxes,
        coupons,
        dividends,
        currentProfitability,
        shares,
        rubBonds,
        usdBonds,
        etfArray,
    }
}