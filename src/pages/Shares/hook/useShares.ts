import { useSelector } from "react-redux";
import { StateType } from "../../../store/root-reducer";
import { formattedMoneySupply, getNumberMoney, searchItemInArrayData } from "../../../utils";
import moment from "moment";
import { accordanceTariffAndComissions } from "../../../types/info.type";
import { TFPosition } from "../../../types/portfolio.type";
import { TFFormattPrice } from "../../../types/common";
import { useState } from "react";

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

interface IUseSharesProps {
    accountId: string;
}

type TFUseShares = (peops: IUseSharesProps) => {
    result: TShareProfitability[],
    withTax: boolean,
    setWithTax: React.Dispatch<React.SetStateAction<boolean>>,
    comissionToggle: boolean,
    setComissionToggle: React.Dispatch<React.SetStateAction<boolean>>,
}
export const useShares: TFUseShares = ({ accountId }) => {
    const [withTax, setWithTax] = useState<boolean>(false);
    const [comissionToggle, setComissionToggle] = useState<boolean>(false);
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
        const taxBase = withTax ? currentPrice.value - buyPrice.value < 0 ? 1 : 1.13 : 0;
        const comissionBase = accordanceTariffAndComissions[tariff] / 100;
        const correctionPrice = taxBase === 1 && comissionBase === 1 ? 0 : (currentPrice.value * comissionBase * taxBase)

        if (moment().diff(moment(item.date), 'year') > 3) {
            profitabilityNow.money = formattedMoneySupply(currentPrice.value - buyPrice.value - (currentPrice.value * comissionBase));
            profitabilityNow.percent = Number(((currentPrice.value - buyPrice.value - (currentPrice.value * comissionBase) / buyPrice.value) * 100).toFixed(2));
        } else {
            profitabilityNow.money = formattedMoneySupply(currentPrice.value - buyPrice.value - (currentPrice.value * comissionBase));
            profitabilityNow.percent = Number((((currentPrice.value - buyPrice.value - (currentPrice.value * comissionBase)) / buyPrice.value) * 100).toFixed(2));
        }
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
        // console.log(temp.number, temp.name, currentPrice.value - buyPrice.value);
        // console.log(comissionToggle,'comissionToggle');

        result.push(temp)
    })

    return { result, withTax, setWithTax, comissionToggle, setComissionToggle }
}