import { useAuth } from "hooks/useAuth";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { fetchGetOrderBookBondAPI } from "store/Api/allBonds.api";
import { fetchGetBondCouponsAPI, fetchReadBondsDataAPI, fetchWriteBondsDataAPI } from "store/Api/bonds.api";
import { StateType } from "store/root-reducer";
import { getAllBondsListAction, getAllBondsListSuccessOnly } from "store/slices/allBonds.slice";
import { TFloatingCouponFlagText, TInstrument } from "types/bonds.type";
import { ALL_BONDS_LOCALSTORAGE_NAME } from "types/calculationBonds.type";
import { TFFormattPrice } from "types/common";
import { accordanceTariffAndComissions } from "types/info.type";
import { TFAmount, TFQuantity } from "types/portfolio.type";
import { forkDispatch, formattedMoneySupply, getNumberMoney } from "utils";

interface IUseCalcBonds {

}

export interface IBondsTable {
    isin: string;
    comission: string;
    value: number;
    name: string;
    currentPrice: TFQuantity;
    figi: string;
    initialNominal: TFAmount;
    priceInPercent: number;
    formattInitialNominal: TFFormattPrice;
    nkd: TFFormattPrice,
    maturityDate: {
        value: TInstrument['maturityDate'],
        formatt: string,
    };
    eventsLength: number;
    payOneBond: TFFormattPrice;
    daysToMaturity: number;
    yearsToMaturity: string;
    commissionForPurchase: number;
    priceInCurrencyView: TFFormattPrice;
    fullPrice: TFFormattPrice;
    aboveNominal: boolean;
    sumAllCouponsReceived: TFFormattPrice;
    marginFromBondRepayment: TFFormattPrice;
    couponTax: TFFormattPrice;
    taxOnBondRepayment: TFFormattPrice;
    netAmountInTheEnd: TFFormattPrice;
    netProfit: TFFormattPrice;
    annualProfitability: number;
    bondRepaymentAmount: TFFormattPrice;
    totalNkd: TFFormattPrice;
    payOneBondTotal: TFFormattPrice;
    typeOfBond: TFloatingCouponFlagText;
}

type TUseCalcBonds = (props: IUseCalcBonds) => {
    inputField: string;
    setInputField: React.Dispatch<React.SetStateAction<string>>;
    handleAddBond: () => void;
    handleRemoveBond: (isin: string) => void;
    isLoading: boolean;
    error: string | null;
    bondsTable: IBondsTable[];
    handleChangeValueBonds: (isin: string, newValue: number) => void;
    isLoadingBonds: boolean;
    handleChangeCurrentPrice: (isin: string, newPrice: number) => void;
    setSortByProfitability: React.Dispatch<React.SetStateAction<{
        key: "income" | "alfabet";
        value: 'ASC' | 'DESC' | null;
    }>>
    sortFunction: (a: IBondsTable, b: IBondsTable) => number;
    sortByProfitability: {
        key: "income" | "alfabet";
        value: 'ASC' | 'DESC' | null;
    }
}
export const useCalcBonds: TUseCalcBonds = () => {
    const UPDATETIME = process.env.NODE_ENV === 'development' ? 60 : 5 * 60;
    const { id: userId } = useAuth();
    const dispatch = useDispatch();
    const [sortByProfitability, setSortByProfitability] = useState<{
        key: 'income' | 'alfabet',
        value: 'ASC' | 'DESC' | null;
    }>({
        key: 'income',
        value: null,
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [bonds, setBonds] = useState<string[]>([]);
    const [bondsTable, setBondsTable] = useState<IBondsTable[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [inputField, setInputField] = useState<string>('');
    const { info: { data: { tariff } },
        all: { data: { instruments: allBondsData }, isLoading: isLoadingBonds },
        currency: { data: currencyExchangeRate }
    } = useSelector((state: StateType) => state);

    const comission = accordanceTariffAndComissions[tariff] || 0;

    const getLocalData = (): Promise<any> => {
        return fetchReadBondsDataAPI(userId || '0');
    }

    const searchBond = (isin: string) => {
        if (allBondsData.length) {
            return allBondsData.filter(el => el.ticker === isin)[0]
        }
        return null
    }

    const clculationInnerDataInBond = ({ eventsLength, formattInitialNominal, priceInPercent, payOneBond, quantity, nkd, yearsToMaturity, daysToMaturity, initialNominal }: {
        eventsLength: any,
        formattInitialNominal: TFFormattPrice,
        priceInPercent: number,
        payOneBond: TFFormattPrice,
        quantity: number;
        nkd: TFFormattPrice;
        yearsToMaturity: string;
        daysToMaturity: number;
        initialNominal: TFAmount
    }) => {
        const priceInCurrencyView = formattedMoneySupply(formattInitialNominal.value * quantity * (priceInPercent / 100));
        const aboveNominal = formattInitialNominal.value * (priceInPercent / 100) > formattInitialNominal.value;
        ///////////////
        const priceWithoutCommission = formattedMoneySupply(priceInCurrencyView.value);
        const payOneBondTotal = formattedMoneySupply(payOneBond.value * quantity);
        ///////////////
        const commissionForPurchase = Number((priceWithoutCommission.value * (comission / 100)).toFixed(2));
        ///////////////
        const totalNkd = formattedMoneySupply(nkd.value * quantity);
        const fullPrice = formattedMoneySupply(priceWithoutCommission.value + commissionForPurchase + totalNkd.value);
        ///////////////
        const sumAllCouponsReceived = formattedMoneySupply(payOneBond.value * eventsLength * quantity);
        ///////////////
        const marginFromBondRepayment = aboveNominal ? formattedMoneySupply(0) : formattedMoneySupply(formattInitialNominal.value * quantity - priceInCurrencyView.value);
        ///////////////
        // const couponTax = formattedMoneySupply(sumAllCouponsReceived.value * 0.13);
        const couponTax = formattedMoneySupply(0);
        ///////////////
        // const taxOnBondRepayment = Number(yearsToMaturity) >= 3 ? formattedMoneySupply(0) : formattedMoneySupply(marginFromBondRepayment.value * 0.13);
        const taxOnBondRepayment = formattedMoneySupply(0);
        ///////////////
        const bondRepaymentAmount = formattedMoneySupply(formattInitialNominal.value * quantity);
        ///////////////
        const netAmountInTheEnd = formattedMoneySupply(bondRepaymentAmount.value + sumAllCouponsReceived.value - couponTax.value - taxOnBondRepayment.value);
        ///////////////
        const netProfit = formattedMoneySupply(netAmountInTheEnd.value - fullPrice.value);
        ///////////////
        const annualProfitability = Number(((netProfit.value / fullPrice.value) * (365 / daysToMaturity) * 100).toFixed(2));
        return {
            eventsLength,
            priceInCurrencyView,
            aboveNominal,
            payOneBondTotal,
            commissionForPurchase,
            fullPrice,
            sumAllCouponsReceived,
            marginFromBondRepayment,
            couponTax,
            taxOnBondRepayment,
            bondRepaymentAmount,
            netAmountInTheEnd,
            netProfit,
            annualProfitability,
            totalNkd,
        }
    }

    const createUpdateItem = async (isin: string): Promise<IBondsTable | { code: number }> => {
        const found = searchBond(isin);
        if (found) {
            const prices = await fetchGetOrderBookBondAPI(found.figi);
            const events = await fetchGetBondCouponsAPI(found.figi, moment().utc(), moment(found.maturityDate).add(3, 'd').utc());

            const currencyExchangeRateCorrection = found.initialNominal.currency === 'usd' ? currencyExchangeRate : 1;
            const currentPrice = prices;

            const priceInPercent = getNumberMoney({
                currency: found.currency,
                nano: currentPrice.lastPrice.nano,
                units: currentPrice.lastPrice.units,
            });

            const quantity = 1;
            const nkd = formattedMoneySupply(getNumberMoney(found.aciValue));
            const payOneBond = formattedMoneySupply(Number((getNumberMoney(events[0].payOneBond) * currencyExchangeRateCorrection).toFixed(2)));
            const formattInitialNominal = formattedMoneySupply(getNumberMoney(found.initialNominal) * currencyExchangeRateCorrection);
            const daysToMaturity = Math.ceil((moment(found.maturityDate).unix() - moment().unix()) / 86400);
            const yearsToMaturity = (daysToMaturity / 365).toFixed(2);
            const eventsLength = events.length;
            const { priceInCurrencyView,
                aboveNominal,
                payOneBondTotal,
                commissionForPurchase,
                fullPrice,
                sumAllCouponsReceived,
                marginFromBondRepayment,
                couponTax,
                taxOnBondRepayment,
                bondRepaymentAmount,
                netAmountInTheEnd,
                netProfit,
                annualProfitability, totalNkd } = clculationInnerDataInBond({ eventsLength, formattInitialNominal, priceInPercent, payOneBond, quantity, nkd, yearsToMaturity, daysToMaturity, initialNominal: found.initialNominal });
            return {
                value: quantity,
                isin,
                comission: String(comission),
                name: found.name,
                currentPrice: currentPrice.lastPrice,
                figi: found.figi,
                initialNominal: found.initialNominal,
                priceInPercent: priceInPercent,
                formattInitialNominal,
                nkd,
                maturityDate: {
                    value: found.maturityDate,
                    formatt: moment(found.maturityDate).format('DD.MM.YYYY'),
                },
                eventsLength,
                payOneBond,
                daysToMaturity,
                yearsToMaturity,
                commissionForPurchase: commissionForPurchase,
                priceInCurrencyView,
                fullPrice,
                aboveNominal,
                sumAllCouponsReceived,
                marginFromBondRepayment,
                couponTax,
                taxOnBondRepayment,
                netAmountInTheEnd,
                netProfit,
                annualProfitability,
                bondRepaymentAmount,
                totalNkd,
                payOneBondTotal,
                typeOfBond: found.floatingCouponFlag ? "Плавающий" : "Фиксированный",
            }
        } else {
            return new Promise<{ code: number }>(function (resolve) {
                return resolve({
                    code: 404
                })
            })
        }
    };

    const handleAddBond = () => {
        setError('');
        setIsLoading(true)
        if (!bonds.includes(inputField)) {
            setTimeout(() => {
                const creatingItem = createUpdateItem(inputField);
                creatingItem.then((res: any) => {
                    if (res.code === 404) {
                        setError('Такой isin еще не добавлен в базу T банка');
                        setIsLoading(false)
                    } else {
                        setBonds([...bonds, inputField])
                        setBondsTable([...bondsTable, res])
                        if (userId) fetchWriteBondsDataAPI({ userId, data: [...bondsTable, res] })
                        setInputField('')
                        setIsLoading(false)
                    }
                })
            }, 500)
        } else {
            setError('Такой isin уже добавлен');
            setInputField('')
            setIsLoading(false)
        }
    }

    const handleChangeCurrentPrice = (isin: string, newPrice: number) => {
        if (newPrice >= 1) {
            const newBondsTable = bondsTable.map((item) => {
                if (item.isin === isin) {
                    const { priceInCurrencyView,
                        aboveNominal,
                        payOneBondTotal,
                        commissionForPurchase,
                        fullPrice,
                        sumAllCouponsReceived,
                        marginFromBondRepayment,
                        couponTax,
                        taxOnBondRepayment,
                        bondRepaymentAmount,
                        netAmountInTheEnd,
                        netProfit,
                        annualProfitability, totalNkd } = clculationInnerDataInBond({
                            eventsLength: item.eventsLength, formattInitialNominal: item.formattInitialNominal, priceInPercent: newPrice, payOneBond: item.payOneBond, quantity: item.value, nkd: item.nkd, yearsToMaturity: item.yearsToMaturity, daysToMaturity: item.daysToMaturity, initialNominal: item.initialNominal,
                        })
                    return {
                        ...item,
                        priceInCurrencyView,
                        aboveNominal,
                        payOneBondTotal,
                        commissionForPurchase,
                        fullPrice,
                        sumAllCouponsReceived,
                        marginFromBondRepayment,
                        couponTax,
                        taxOnBondRepayment,
                        bondRepaymentAmount,
                        netAmountInTheEnd,
                        netProfit,
                        annualProfitability,
                        totalNkd,
                        priceInPercent: newPrice,
                    }
                }
                return item
            })
            if (userId) fetchWriteBondsDataAPI({ userId, data: newBondsTable })
            setBondsTable(newBondsTable)
        }
    }

    const handleChangeValueBonds = (isin: string, newValue: number) => {
        if (newValue >= 1) {
            const newBondsTable = bondsTable.map((item) => {
                if (item.isin === isin) {
                    const { priceInCurrencyView,
                        aboveNominal,
                        payOneBondTotal,
                        commissionForPurchase,
                        fullPrice,
                        sumAllCouponsReceived,
                        marginFromBondRepayment,
                        couponTax,
                        taxOnBondRepayment,
                        bondRepaymentAmount,
                        netAmountInTheEnd,
                        netProfit,
                        annualProfitability, totalNkd } = clculationInnerDataInBond({
                            eventsLength: item.eventsLength, formattInitialNominal: item.formattInitialNominal, priceInPercent: item.priceInPercent, payOneBond: item.payOneBond, quantity: newValue, nkd: item.nkd, yearsToMaturity: item.yearsToMaturity, daysToMaturity: item.daysToMaturity, initialNominal: item.initialNominal
                        })
                    return {
                        ...item,
                        value: newValue,
                        priceInCurrencyView,
                        aboveNominal,
                        payOneBondTotal,
                        commissionForPurchase,
                        fullPrice,
                        sumAllCouponsReceived,
                        marginFromBondRepayment,
                        couponTax,
                        taxOnBondRepayment,
                        bondRepaymentAmount,
                        netAmountInTheEnd,
                        netProfit,
                        annualProfitability,
                        totalNkd,
                    }
                }
                return item
            })
            if (userId) fetchWriteBondsDataAPI({ userId, data: newBondsTable })
            setBondsTable(newBondsTable)
        }

    }

    const handleRemoveBond = (isin: string) => {
        const newBonds = bonds.filter(el => el !== isin);
        const newBondsTable = bondsTable.filter(el => el.isin !== isin);
        setBonds(newBonds);
        setBondsTable(newBondsTable)
        if (userId) fetchWriteBondsDataAPI({ userId, data: newBondsTable })
    }

    const sortFunction = (a: IBondsTable, b: IBondsTable) => {
        if (sortByProfitability.key === 'income') {
            if (sortByProfitability.value === null) {
                return a.name.localeCompare(b.name);
            } else if (sortByProfitability.value === 'ASC') {
                return a.annualProfitability - b.annualProfitability;
            } else {
                return b.annualProfitability - a.annualProfitability;
            }
        }
        if (sortByProfitability.key === 'alfabet') {
            if (sortByProfitability.value === null) {
                return a.name.localeCompare(b.name);
            } else if (sortByProfitability.value === 'ASC') {
                return a.name.localeCompare(b.name);
            } else {
                return b.name.localeCompare(a.name);
            }
        }
        return a.name.localeCompare(b.name);
    }

    useEffect(() => {
        if (!!allBondsData.length && !isLoadingBonds && userId) {
            setIsLoading(true);
            const dataFromDB = getLocalData();
            dataFromDB.then(res => {
                if (res.values.length !== 0) {
                    const valuesJSON = JSON.parse(res.values)
                    const canWeUpdateData = moment().unix() -
                        moment(
                            res.date
                        ).unix() >
                        UPDATETIME
                    if (canWeUpdateData) {
                        console.log('Обновляемся');
                        const promisesUpdateItems: Promise<IBondsTable | { code: number }>[] = [];
                        valuesJSON.forEach((item: IBondsTable) => {
                            const creatingItem = createUpdateItem(item.isin);
                            promisesUpdateItems.push(creatingItem)
                        })
                        Promise.all(promisesUpdateItems).then((res) => {
                            const temp: IBondsTable[] = [];
                            res.forEach((el: any) => {
                                if (el.code === 404) {
                                    console.log('Не найден элемент');
                                } else {
                                    setBonds([...bonds, el.isin])
                                    temp.push(el)
                                }
                            })
                            setBondsTable(temp)
                            fetchWriteBondsDataAPI({ userId, data: temp })
                            setIsLoading(false)
                        })
                    } else {
                        setBonds(valuesJSON.map((el: IBondsTable) => el.isin))
                        setBondsTable(valuesJSON)
                        setIsLoading(false)
                    }
                } else {
                    console.log('В базе данные не найдены');
                    setIsLoading(false);
                }
            })
        }
    }, [allBondsData, userId])

    useEffect(() => {
        const updateTime = localStorage.getItem("T-balance-update") || null;
        const updateTrigger = updateTime ? JSON.parse(updateTime) : null;
        const differenceTime = updateTrigger
            ? moment().unix() - updateTrigger <= 86400
            : false;
        const forkDispatchDataInfo = forkDispatch({
            localStorageName: ALL_BONDS_LOCALSTORAGE_NAME,
            accountId: "0",
            customTimeUpdate: UPDATETIME
        });
        forkDispatchDataInfo && differenceTime
            ? dispatch(getAllBondsListSuccessOnly(forkDispatchDataInfo))
            : dispatch(getAllBondsListAction());
        if (!differenceTime) {
          console.log(
            "Старые данные, еще норм по времени",
            moment().unix(),
            updateTrigger,
            moment().unix() - updateTrigger
          );
         
        } else {
          console.log("Обновляем данные");
           localStorage.setItem(
            "T-balance-update",
            JSON.stringify(moment().unix())
          );
        }
    }, [UPDATETIME, dispatch])

    return {
        inputField,
        setInputField,
        handleAddBond,
        handleRemoveBond,
        isLoading,
        error,
        bondsTable,
        handleChangeValueBonds,
        isLoadingBonds,
        handleChangeCurrentPrice,
        setSortByProfitability,
        sortFunction,
        sortByProfitability,
    }
}