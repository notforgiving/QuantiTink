import { useSelector } from "react-redux";
import { StateType } from "../../../store/root-reducer";
import { formattedMoneySupply, getNumberMoney, searchItemInArrayData } from "../../../utils";
import moment from "moment";
import { accordanceTariffAndComissions } from "../../../types/info.type";
import { TFPosition } from "../../../types/portfolio.type";
import { TFFormattPrice } from "../../../types/common";

export type TShareProfitability = {
    number: number,
    name: string,
    date: string,
    quantity: string,
    currentPrice: TFFormattPrice,
    priceLot: TFFormattPrice,
    priceTotal: TFFormattPrice,
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
    result: TShareProfitability[]
}
export const useShares: TFUseShares = ({ accountId }) => {
    let result: TShareProfitability[] = [];
    const tariff = useSelector((state: StateType) => state.info.data?.tariff || 'investor');
    const comissionBase = accordanceTariffAndComissions[tariff] / 100;
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
        profitabilityNow.money = formattedMoneySupply(currentPrice.value - buyPrice.value);
        if (moment().diff(moment(item.date), 'year') > 3) {
            profitabilityNow.percent = Number(((currentPrice.value - buyPrice.value / buyPrice.value) * 100).toFixed(2));
        } else {
            profitabilityNow.percent = Number((((currentPrice.value - buyPrice.value - (currentPrice.value * comissionBase)) / buyPrice.value) * 100).toFixed(2));
        }
        const temp: TShareProfitability = {} as TShareProfitability;
        temp.number = index + 1;
        temp.name = searchItemInArrayData(sharesData?.instrument || [], 'figi', item.figi)?.name || 'Акция';
        temp.date = item.date;
        temp.quantity = item.quantity;
        temp.currentPrice = currentPrice;
        temp.priceLot = formattedMoneySupply(getNumberMoney(item.price));
        temp.priceTotal = formattedMoneySupply(getNumberMoney(item.price) * Number(item.quantity));
        temp.ownershipPeriod = moment().diff(moment(item.date), 'month');
        temp.profitabilityNow = profitabilityNow;
        result.push(temp)
    })
    console.log(result, 'result');

    return { result }
}