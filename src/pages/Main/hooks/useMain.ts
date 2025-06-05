import { useEffect, useState } from "react";
import { calcSummOfAllDeposits, calcSummOfTotalAmountPortfolio, formattedMoneySupply, getPercentByTarget } from "../../../utils";
import { TFFormattPrice } from "../../../types/common";
import { TFUnionOperations } from "../../../store/slices/operations.slice";
import { useDispatch, useSelector } from "react-redux";
import { setTotalAmountAllPortfolio, setTotalAmountDepositsAllPortfolios } from "../../../store/slices/general.slice";
import { StateType } from "../../../store/root-reducer";
import { TFPortfolio } from "../../../types/portfolio.type";

interface IUseMainProps {
    portfolios: TFPortfolio[] | null,
    operations: TFUnionOperations[] | null,
}

type TFPricePercent = {
    percent: string;
}

type TFUseMain = (props: IUseMainProps) => {
    /** Сумма всех пополнений */
    totalAmountDepositsAllPortfolios: TFFormattPrice
    /** Сумма всех брокерсих счетов */
    totalAmountAllPortfolio: TFFormattPrice
    /** Насколько портфель обгоняет пополнения или не догоняет */
    portfoliosReturns: TFFormattPrice & TFPricePercent,
    tinkoffToken: string,
    setTinkoffToken: React.Dispatch<React.SetStateAction<string>>,
}

export const useMain: TFUseMain = ({ portfolios, operations }) => {
    const dispatch = useDispatch();
    const general = useSelector((state: StateType) => state.general);
    const [portfoliosReturns, setPortfoliosReturns] = useState<TFFormattPrice>({
        formatt: '',
        value: 0,
    })

    const [differentPercent, setDifferentPercent] = useState<string>('0%');
    const [tinkoffToken, setTinkoffToken] = useState<string>("");

    useEffect(() => {
        if (operations && !!operations.length && portfolios) {
            const allDepositsData: TFFormattPrice[] = [];
            const summ = operations.reduce((acc, item) => {
                const temp = formattedMoneySupply(calcSummOfAllDeposits([item]))
                allDepositsData.push(temp)
                return acc + temp.value;
            }, 0)
            /** Считаем сумму всех пополнений для всех брокерских счетов */
            dispatch(setTotalAmountDepositsAllPortfolios(formattedMoneySupply(summ)))
            /** Считаем цену всех брокерских счетов */
            dispatch(setTotalAmountAllPortfolio(formattedMoneySupply(calcSummOfTotalAmountPortfolio(portfolios || []))))
        }
    }, [dispatch, operations, portfolios])

    useEffect(() => {
        setPortfoliosReturns(formattedMoneySupply(general.totalAmountAllPortfolio.value - general.totalAmountDepositsAllPortfolios.value))
    }, [general.totalAmountDepositsAllPortfolios, general.totalAmountAllPortfolio])

    useEffect(() => {
        if (portfoliosReturns.value !== 0 || general.totalAmountDepositsAllPortfolios.value !== 0) {
            setDifferentPercent(`${getPercentByTarget(portfoliosReturns.value, general.totalAmountDepositsAllPortfolios.value)}%`)
        }
    }, [portfoliosReturns, general.totalAmountDepositsAllPortfolios])

    return {
        totalAmountDepositsAllPortfolios: general.totalAmountDepositsAllPortfolios,
        totalAmountAllPortfolio: general.totalAmountAllPortfolio,
        portfoliosReturns: {
            formatt: portfoliosReturns.formatt,
            value: portfoliosReturns.value,
            percent: differentPercent,
        }, 
        tinkoffToken,
        setTinkoffToken,
    }
}