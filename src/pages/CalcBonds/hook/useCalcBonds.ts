import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { fetchAllOrderBookBondsAPI, fetchGetOrderBookBondAPI } from "store/Api/allBonds.api";
import { StateType } from "store/root-reducer";
import { getAllBondsListAction, getAllBondsListSuccessOnly } from "store/slices/allBonds.slice";
import { ALL_BONDS_LOCALSTORAGE_NAME, CALC_LOCALSTORAGE_NAME, TOrderBook } from "types/calculationBonds.type";
import { TFFormattPrice } from "types/common";
import { accordanceTariffAndComissions } from "types/info.type";
import { TFAmount, TFQuantity } from "types/portfolio.type";
import { forkDispatch, getCurentPricesOfBonds } from "utils";

interface IUseCalcBonds {

}

export interface IBondsTable {
    isin: string;
    comission: string;
    value: number;
    name: string;
    currentPrice: TFQuantity;
    figi: string;
}

type TUseCalcBonds = (props: IUseCalcBonds) => {
    inputField: string;
    setInputField: React.Dispatch<React.SetStateAction<string>>;
    handleAddBond: () => void;
    bonds: string[];
    handleRemoveBond: (isin: string) => void;
    isLoading: boolean;
    error: string | null;
    bondsTable: IBondsTable[];
    handleChangeValueBonds: (isin: string, newValue: number) => void;
    isLoadingBonds: boolean
}
export const useCalcBonds: TUseCalcBonds = () => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [bonds, setBonds] = useState<string[]>([]);
    const [bondsTable, setBondsTable] = useState<IBondsTable[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [inputField, setInputField] = useState<string>('');
    const { info: { data: { tariff } },
        all: { data: { instruments: allBondsData }, isLoading: isLoadingBonds }
    } = useSelector((state: StateType) => state);

    const comission = accordanceTariffAndComissions[tariff] || 0;
    const searchBond = (isin: string) => {
        if (allBondsData.length) {
            return allBondsData.filter(el => el.ticker === isin)[0]
        }
        return null
    }

    const onGetCurrentPrice = async (figi: string) => {
        const data: TOrderBook = await fetchGetOrderBookBondAPI(figi);
        return data
    }

    const handleAddBond = () => {
        setIsLoading(true)
        if (!bonds.includes(inputField)) {
            setTimeout(() => {
                const found = searchBond(inputField);
                if (found) {
                    const prices = onGetCurrentPrice(found.figi);
                    let orderBook = {} as TOrderBook;
                    prices.then(res => {
                        orderBook = res;
                    })
                    setBonds([...bonds, inputField])
                    const temp: IBondsTable = {
                        value: 1,
                        isin: inputField,
                        comission: String(comission),
                        name: found.name,
                        currentPrice: orderBook.lastPrice,
                        figi: found.figi,
                    }
                    setBondsTable([...bondsTable, temp])
                    setInputField('')
                    setIsLoading(false)
                } else {
                    setError('Такой isin еще не добавлен в базу T банка')
                    setIsLoading(false)
                }
            }, 500)
        } else {
            setError('Такой isin уже добавлен')
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (!!bondsTable.length) {
            localStorage.setItem(CALC_LOCALSTORAGE_NAME, JSON.stringify(bondsTable))
        }
    }, [bondsTable])

    const handleChangeValueBonds = (isin: string, newValue: number) => {
        const newBondsTable = bondsTable.map(item => {
            if (item.isin === isin) {
                return {
                    ...item,
                    value: newValue,
                }
            }
            return item
        })
        setBondsTable(newBondsTable)
    }

    const handleRemoveBond = (isin: string) => {
        const newBonds = bonds.filter(el => el !== isin);
        const newBondsTable = bondsTable.filter(el => el.isin !== isin);
        setBonds(newBonds);
        setBondsTable(newBondsTable)
        localStorage.setItem(CALC_LOCALSTORAGE_NAME, JSON.stringify(newBondsTable))
    }

    useEffect(() => {
        const localData = localStorage.getItem(CALC_LOCALSTORAGE_NAME) || null;
        if (localData) {
            const localDataJson: IBondsTable[] = JSON.parse(localData);
            const temp: string[] = [];
            localDataJson.forEach(item => {
                temp.push(item.isin)
            })
            const newBonds: IBondsTable[] = []
            localDataJson.forEach(bond => {
                const prices = onGetCurrentPrice(bond.figi);
                prices.then(res => {
                    const currentPrice = res.lastPrice
                    const newItem = {
                        ...bond,
                        currentPrice,
                    }
                    newBonds.push(newItem)
                })
            })
            setBondsTable(newBonds)
            setBonds(temp)
        }
    }, [])

    useEffect(() => {
        const forkDispatchDataInfo = forkDispatch({
            localStorageName: ALL_BONDS_LOCALSTORAGE_NAME,
            accountId: "0",
            customTimeUpdate: 86400.
        });
        forkDispatchDataInfo
            ? dispatch(getAllBondsListSuccessOnly(forkDispatchDataInfo))
            : dispatch(getAllBondsListAction());
        // localStorage.removeItem(CALC_LOCALSTORAGE_NAME)
    }, [dispatch])

    return {
        inputField,
        setInputField,
        handleAddBond,
        bonds,
        handleRemoveBond,
        isLoading,
        error,
        bondsTable,
        handleChangeValueBonds,
        isLoadingBonds,
    }
}