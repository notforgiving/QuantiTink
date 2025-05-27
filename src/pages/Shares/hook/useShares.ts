import { useSelector } from "react-redux";
import { StateType } from "../../../store/root-reducer";
import { formattedMoneySupply, getNumberMoney, searchItemInArrayData } from "../../../utils";
import moment from "moment";
import { accordanceTariffAndComissions } from "../../../types/info.type";
import { TFPosition } from "../../../types/portfolio.type";
import { TFFormattPrice } from "../../../types/common";
import { useCallback, useEffect, useState } from "react";

export type TShareProfitability = {
    number: number,
    name: string,
    date: string,
    quantity: string,
    currentPrice: TFFormattPrice,
    priceTotal: TFFormattPrice,
    priceActiality: TFFormattPrice,
    ownershipPeriod: number,
    profitabilityNow: {
        percent: number,
        money: TFFormattPrice;
    }
}

export type TFSortKey = 'DEFAULT' | 'PROFITABILITY' | 'NUMBER';
export type TFSortDir = 'ASC' | 'DESC' | null;

interface IUseSharesProps {
    accountId: string;
}

type TFUseShares = (peops: IUseSharesProps) => {
    result: TShareProfitability[],
    withTax: boolean,
    setWithTax: React.Dispatch<React.SetStateAction<boolean>>,
    comissionToggle: boolean,
    setComissionToggle: React.Dispatch<React.SetStateAction<boolean>>,
    search: string,
    setSearch: React.Dispatch<React.SetStateAction<string>>,
    setCurrentSort: React.Dispatch<React.SetStateAction<{
        key: TFSortKey;
        dir: TFSortDir;
    }>>
    currentSort: {
        key: TFSortKey;
        dir: TFSortDir;
    },
    sortFunction: (a: TShareProfitability, b: TShareProfitability) => number
}
export const useShares: TFUseShares = ({ accountId }) => {
    const [currentSort, setCurrentSort] = useState<{
        key: TFSortKey,
        dir: TFSortDir,
    }>({
        key: 'DEFAULT',
        dir: 'ASC'
    });
    const [search, setSearch] = useState<string>('');
    const [withTax, setWithTax] = useState<boolean>(true);
    const [comissionToggle, setComissionToggle] = useState<boolean>(true);
    let result: TShareProfitability[] = [];
    const tariff = useSelector((state: StateType) => state.info.data?.tariff || 'investor');
    const postitions = useSelector((state: StateType) => {
        if (state.portfolios.data && !!state.portfolios.data?.length) {
            return searchItemInArrayData(
                state.portfolios.data,
                "accountId",
                accountId || "0"
            )?.positions || [];
        }
        return [];
    });
    const { data: sharesData } = useSelector((state: StateType) => state.shares);
    const operations = useSelector((state: StateType) => {
        if (state.operations.data && !!state.operations.data?.length) {
            return searchItemInArrayData(
                state.operations.data,
                "accountId",
                accountId
            )?.operations || [];
        }
        return [];
    });
    const operationsByBuyShares = operations?.filter(el => (el.type === 'Покупка ценных бумаг' || el.type === 'Покупка ценных бумаг с карты') && el.instrumentType === 'share') || [];
    const positionsByShares = postitions.filter(el => el.instrumentType === 'share');
    operationsByBuyShares.reverse().forEach((item, index) => {
        let profitabilityNow: {
            percent: number,
            money: TFFormattPrice;
        } = {
            percent: 0,
            money: {} as TFFormattPrice,
        };

        const positioninfo = searchItemInArrayData(positionsByShares, 'figi', item.figi) || {} as TFPosition;
        const currentPrice = formattedMoneySupply(getNumberMoney(positioninfo.currentPrice));
        const buyPrice = formattedMoneySupply(getNumberMoney(item.price));

        const ownershipPeriod = moment().diff(moment(item.date), 'year') > 3;
        const taxBase = withTax ? currentPrice.value - buyPrice.value < 0 ? 1 : 0.13 : 0;
        const comissionBase = comissionToggle ? currentPrice.value * accordanceTariffAndComissions[tariff] / 100 : 0;
        const correctionPrice = ownershipPeriod || currentPrice.value - buyPrice.value < 0 ? comissionBase : ((currentPrice.value - buyPrice.value) * taxBase) + comissionBase;

        profitabilityNow.money = formattedMoneySupply(currentPrice.value - buyPrice.value - correctionPrice);
        profitabilityNow.percent = Number(((profitabilityNow.money.value / buyPrice.value) * 100).toFixed(2));
        const temp: TShareProfitability = {} as TShareProfitability;
        temp.number = index + 1;
        temp.name = searchItemInArrayData(sharesData?.instrument || [], 'figi', item.figi)?.name || 'Акция';
        temp.date = item.date;
        temp.quantity = item.quantity;
        temp.currentPrice = currentPrice;
        temp.priceTotal = formattedMoneySupply(getNumberMoney(item.price) * Number(item.quantity));
        temp.priceActiality = formattedMoneySupply(currentPrice.value * Number(item.quantity));
        temp.ownershipPeriod = moment().diff(moment(item.date), 'month');
        temp.profitabilityNow = profitabilityNow;
        result.push(temp)
    })

    const sortFunction = useCallback((a: TShareProfitability, b: TShareProfitability) => {
        if (currentSort.key === 'PROFITABILITY' && currentSort.dir === 'ASC') {
            return a.profitabilityNow.money.value - b.profitabilityNow.money.value;
        }
        if (currentSort.key === 'PROFITABILITY' && currentSort.dir === 'DESC') {
            return b.profitabilityNow.money.value - a.profitabilityNow.money.value;
        }
        if (currentSort.key === 'NUMBER' && currentSort.dir === 'ASC') {
            return b.number - a.number;
        }
        if (currentSort.key === 'PROFITABILITY' && currentSort.dir === 'DESC') {
            return a.number - b.number;
        }
        return a.number - b.number;
    }, [currentSort])

    useEffect(() => {

    }, [currentSort])

    return { result, withTax, setWithTax, comissionToggle, setComissionToggle, search, setSearch, setCurrentSort, currentSort, sortFunction }
}