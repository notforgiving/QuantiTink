import { useSelector } from "react-redux";
import moment from "moment";
import { StateType } from "store/root-reducer";
import { TFFormattPrice } from "types/common";
import { formattedMoneySupply, getNumberMoney, searchItemInArrayData } from "utils";
import { TFPosition } from "types/portfolio.type";
import { accordanceTariffAndComissions, TAccordanceTariffAndComissions } from "types/info.type";
import { TFSortDir, TFSortKey, TActiveProfitability } from "pages/Profitability/types";
import { TFOperation } from "types/operations.types";

interface IUseSharesProps {
    withTax: boolean;
    comissionToggle: boolean;
    currentSort: {
        key: TFSortKey;
        dir: TFSortDir;
    },
    tariff: keyof TAccordanceTariffAndComissions,
    positions: TFPosition[],
    operations: TFOperation[],
}

type TFUseShares = (props: IUseSharesProps) => {
    result: TActiveProfitability[],
}
export const useShares: TFUseShares = ({ operations, withTax, comissionToggle, currentSort, tariff, positions }) => {
    let result: TActiveProfitability[] = [];

    const { data: sharesData } = useSelector((state: StateType) => state.shares);

    const operationsByBuyShares = operations.filter(el => (el.type === 'Покупка ценных бумаг' || el.type === 'Покупка ценных бумаг с карты') && el.instrumentType === 'share') || [];

    const positionsByShares = positions.filter(el => el.instrumentType === 'share');

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

        const taxFree = currentPrice.value - buyPrice.value > 0 && withTax ? (currentPrice.value - buyPrice.value) * 0.13 : 0;
        const currentPriceComission = comissionToggle ? currentPrice.value + currentPrice.value * accordanceTariffAndComissions[tariff] / 100 : currentPrice.value;
        const buyPriceComission = comissionToggle ? buyPrice.value + buyPrice.value * accordanceTariffAndComissions[tariff] / 100 : buyPrice.value;

        profitabilityNow.money = formattedMoneySupply((currentPriceComission - buyPriceComission - taxFree) * Number(item.quantity));
        profitabilityNow.percent = Number(((profitabilityNow.money.value / (buyPriceComission * Number(item.quantity))) * 100).toFixed(2));

        const temp: TActiveProfitability = {} as TActiveProfitability;
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


    return { result }
}