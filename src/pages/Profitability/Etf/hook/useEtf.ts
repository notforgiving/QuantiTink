import moment from "moment";
import { TFSortDir, TFSortKey, TActiveProfitability } from "pages/Profitability/types";
import { useSelector } from "react-redux";
import { StateType } from "store/root-reducer";
import { TFFormattPrice } from "types/common";
import { accordanceTariffAndComissions, TAccordanceTariffAndComissions } from "types/info.type";
import { TFOperation } from "types/operations.types";
import { TFPosition } from "types/portfolio.type";
import { formattedMoneySupply, getNumberMoney } from "utils";

interface IUseEtfProps {
    accountId: string;
    withTax: boolean;
    comissionToggle: boolean;
    currentSort: {
        key: TFSortKey;
        dir: TFSortDir;
    },
    tariff: keyof TAccordanceTariffAndComissions,
    positions: TFPosition[],
    ticker: string;
    operations: TFOperation[],
}

type TUseEtf = (props: IUseEtfProps) => {
    name: string;
    result: TActiveProfitability[]
}

export const useEtf: TUseEtf = ({ accountId, withTax, comissionToggle, currentSort, tariff, positions, ticker, operations }) => {
    let result: TActiveProfitability[] = [];
    const etfData = useSelector((state: StateType) => state.etfs.data.instrument.filter(el => el.ticker === ticker))[0] || null;

    const operationsByBuyEtfs = operations.filter(el => (el.type === 'Покупка ценных бумаг' || el.type === 'Покупка ценных бумаг с карты') && el.instrumentType === 'etf' && el.figi === etfData.figi) || [];

    const positionsByEtf = positions.filter(el => el.instrumentType === 'etf' && el.figi === etfData.figi)[0] || [];

    operationsByBuyEtfs.reverse().forEach((item, index) => {
        let profitabilityNow: {
            percent: number,
            money: TFFormattPrice;
        } = {
            percent: 0,
            money: {} as TFFormattPrice,
        };

        const currentPrice = formattedMoneySupply(getNumberMoney(positionsByEtf.currentPrice));
        const buyPrice = formattedMoneySupply(getNumberMoney(item.price));

        const taxFree = currentPrice.value - buyPrice.value > 0 && withTax ? (currentPrice.value - buyPrice.value) * 0.13 : 0;
        const currentPriceComission = comissionToggle ? currentPrice.value + currentPrice.value * accordanceTariffAndComissions[tariff] / 100 : currentPrice.value;
        const buyPriceComission = comissionToggle ? buyPrice.value + buyPrice.value * accordanceTariffAndComissions[tariff] / 100 : buyPrice.value;

        profitabilityNow.money = formattedMoneySupply((currentPriceComission - buyPriceComission - taxFree) * Number(item.quantity));
        profitabilityNow.percent = Number(((profitabilityNow.money.value / (buyPriceComission * Number(item.quantity))) * 100).toFixed(2));

        const temp: TActiveProfitability = {} as TActiveProfitability;
        temp.number = index + 1;
        temp.name = etfData.name || 'Фонд';
        temp.date = item.date;
        temp.quantity = item.quantity;
        temp.currentPrice = currentPrice;
        temp.priceTotal = formattedMoneySupply(getNumberMoney(item.price) * Number(item.quantity));
        temp.priceActiality = formattedMoneySupply(currentPrice.value * Number(item.quantity));
        temp.ownershipPeriod = moment().diff(moment(item.date), 'month');
        temp.profitabilityNow = profitabilityNow;
        result.push(temp)
    })

    return {
        name: etfData.name,
        result,
    }
}