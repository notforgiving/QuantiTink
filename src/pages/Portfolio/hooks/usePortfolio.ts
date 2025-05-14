import { useSelector } from "react-redux";
import { StateType } from "../../../store/root-reducer";
import { calcSummOfAllDeposits, formattedMoneySupply, getNumberMoney, searchPortfolioInArrayData } from "../../../utils";
import { TFAccount } from "../../../types/accounts.type";
import { TFPortfolio } from "../../../types/portfolio.type";
import { useEffect, useState } from "react";
import { TFFormattPrice } from "../../../types/common";
import moment from "moment";

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
    differencePercent: string;
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
    currentProfitability: string;
}

export const usePortfolio: TUsePortfolio = ({ accountId }) => {
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
    const [currentProfitability, setCurrentProfitability] = useState<string>('0');
    const [differencePercent, setDifferencePercent] = useState<string>('0');
    const [portfolioStart, setPortfolioStart] = useState<string>('0');
    const [investmentPeriod, setInvestmentPeriod] = useState<number | null>(null);

    const account = useSelector((state: StateType) => {
        if (state.accounts.data && !!state.accounts.data?.length) {
            return searchPortfolioInArrayData(
                state.accounts.data,
                "id",
                accountId || "0"
            );
        }
        return null;
    });
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
    const operations = useSelector((state: StateType) => {
        if (state.operations.data && !!state.operations.data?.length) {
            return searchPortfolioInArrayData(
                state.operations.data,
                "accountId",
                accountId || "0"
            )?.operations;
        }
        return null;
    });

    useEffect(() => {
        if (portfolio) {
            setCurrentPrice(formattedMoneySupply(
                getNumberMoney(portfolio.totalAmountPortfolio)
            ))
            setDifferencePercent((((currentPrice.value - amountInvestments.value) / amountInvestments.value) * 100).toFixed(2))
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
                if (el.type === 'Удержание налога') {
                    temptax += getNumberMoney(el.payment);
                }
                if (el.type === 'Удержание комиссии за операцию') {
                    tempcom += getNumberMoney(el.payment);
                }
                if (el.type === 'Выплата купонов') {
                    tempcoup += getNumberMoney(el.payment);
                }
                if (el.type === 'Выплата дивидендов' || el.type === 'Выплата дивидендов на карту') {
                    tempdiv += getNumberMoney(el.payment);
                }
            })
            setCommissions(formattedMoneySupply(tempcom))
            setTaxes(formattedMoneySupply(temptax))
            setCoupons(formattedMoneySupply(tempcoup))
            setDividends(formattedMoneySupply(tempdiv))
        }
    }, [operations])

    useEffect(() => {
        setCurrentProfitability((((coupons.value + dividends.value) / amountInvestments.value) * 100).toFixed(2))
    }, [amountInvestments.value, coupons, dividends])

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
    }
}