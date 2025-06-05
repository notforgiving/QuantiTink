import moment from "moment";
import { TActiveProfitability } from "pages/Profitability/types";
import { useSelector } from "react-redux";
import { StateType } from "store/root-reducer";
import { TFFormattPrice } from "types/common";
import { accordanceTariffAndComissions, TAccordanceTariffAndComissions } from "types/info.type";
import { TFOperation } from "types/operations.types";
import { TFAmount, TFPosition } from "types/portfolio.type";
import { formattedMoneySupply, getNumberMoney } from "utils";

interface IUseEtfProps {
    withTax: boolean;
    comissionToggle: boolean;
    tariff: keyof TAccordanceTariffAndComissions,
    positions: TFPosition[],
    ticker: string;
    operations: TFOperation[],
}

type TUseEtf = (props: IUseEtfProps) => {
    name: string;
    result: TActiveProfitability[];
    tbankEtf: boolean;
}

export const useEtf: TUseEtf = ({ withTax, comissionToggle, tariff, positions, ticker, operations }) => {
    const tbankEtf = ticker['0'] === 'T';
    let result: TActiveProfitability[] = [];
    const etfData = useSelector((state: StateType) => state.etfs.data.instrument.filter(el => el.ticker === ticker))[0] || null;
    if (etfData && operations && positions) {
        const operationsByBuyEtfs = operations.filter(el => (el.type === 'Покупка ценных бумаг' || el.type === 'Покупка ценных бумаг с карты') && el.instrumentType === 'etf' && el.figi === etfData.figi) || [];
        const positionsByEtf = positions.filter(el => el.instrumentType === 'etf' && el.figi === etfData.figi)[0] || {} as TFPosition;
        let stopWrite = 0;
        let operationIndex = 0;

        while (operationIndex < operationsByBuyEtfs.length) {
            const item = operationsByBuyEtfs[operationIndex];
            let profitabilityNow: {
                percent: number,
                money: TFFormattPrice;
            } = {
                percent: 0,
                money: {} as TFFormattPrice,
            };
            const buyPrice = formattedMoneySupply(getNumberMoney(item.price));
            const currentPrice = formattedMoneySupply(getNumberMoney(positionsByEtf.currentPrice || {} as TFAmount));
            const taxFree = currentPrice.value - buyPrice.value > 0 && withTax ? (currentPrice.value - buyPrice.value) * 0.13 : 0;
            const buyPriceComission = comissionToggle ? buyPrice.value * accordanceTariffAndComissions[tariff] / 100 : 0;
            const currentPriceComission = comissionToggle ? currentPrice.value * accordanceTariffAndComissions[tariff] / 100 : 0;
            profitabilityNow.money = formattedMoneySupply((currentPrice.value - buyPrice.value - (buyPriceComission + currentPriceComission) - taxFree) * Number(item.quantity));
            profitabilityNow.percent = Number(((profitabilityNow.money.value / (buyPrice.value * Number(item.quantity))) * 100).toFixed(2));
            const temp: TActiveProfitability = {} as TActiveProfitability;
            temp.number = operationIndex + 1;
            temp.name = etfData.name || 'Фонд';
            temp.date = item.date;
            temp.quantity = item.quantity;
            temp.currentPrice = currentPrice;
            temp.priceTotal = {
                value: formattedMoneySupply(getNumberMoney(item.price) * Number(item.quantity)),
                oneLot: formattedMoneySupply(getNumberMoney(item.price)),
            };
            temp.priceActiality = {
                value: formattedMoneySupply(currentPrice.value * Number(item.quantity)),
                oneLot: formattedMoneySupply(currentPrice.value),
            };
            temp.ownershipPeriod = moment().diff(moment(item.date), 'month');
            temp.profitabilityNow = profitabilityNow;
            operationIndex++;
            if (stopWrite < Number(positionsByEtf.quantity.units)) {
                result.push(temp);
                stopWrite += Number(item.quantity);
            } else {
                break;
            }

        }

        return {
            name: etfData.name,
            result,
            tbankEtf,
        }
    }
    return {
        name: 'Фонд',
        result: [],
        tbankEtf,
    }
}