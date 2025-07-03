import moment from "moment";
import { TActiveProfitability } from "pages/Profitability/types";
import { useSelector } from "react-redux";
import { StateType } from "store/root-reducer";
import { TFFormattPrice } from "types/common";
import { TFOperation } from "types/operations.types";
import { TFPosition } from "types/portfolio.type";
import { formattedMoneySupply, getNumberMoney } from "utils";

interface IBondInfo {
    number: number;
    date: string;
    quantity: number;
    priceTotal: TActiveProfitability['priceTotal'];
    ownershipPeriod: number;
    coupones: any;
    profitabilityNow: TActiveProfitability['profitabilityNow'];
}

interface IUseBondView {
    figi: string;
    withTax: boolean;
    positions: TFPosition[];
    operations: TFOperation[];
    currency: string
}

type TUseBondView = (props: IUseBondView) => {
    name: string;
    result: IBondInfo[]
}

export const useBondView: TUseBondView = ({ figi, withTax, positions, operations, currency }) => {
    let result: IBondInfo[] = [];
    const bondData = useSelector((state: StateType) => state.bonds.data.instrument.filter(el => el.figi === figi))[0] || null;
    if (bondData && operations && positions) {
        const allOperationsWithBond = operations.filter(el => el.instrumentType === 'bond' && el.figi === bondData.figi && el) || [];
        const positionsByBond = positions.filter(el => el.instrumentType === 'bond' && el.figi === bondData.figi)[0] || {} as TFPosition;
        const buyOperations = allOperationsWithBond.filter(el => el.type === 'Покупка ценных бумаг' || el.type === 'Покупка ценных бумаг с карты');
        const bondCoupones = allOperationsWithBond.filter(el => el.type === 'Выплата купонов');
        const calcAmountBondForPay = bondCoupones.map(bond => {
            const quantityForPay = buyOperations.reduce((acc, byu) => {
                if (moment(byu.date) <= moment(bond.date)) {
                    return acc + Number(byu.quantity)
                }
                return acc;
            }, 0);
            const bondPaymant = formattedMoneySupply(getNumberMoney(bond.payment));
            return {
                day: bond.date,
                quantityForPay,
                bondPaymant,
                payOneLot: bondPaymant.value / quantityForPay,
            }
        })
        let stopWrite = 0;
        let operationIndex = 0;
        while (operationIndex < buyOperations.length) {
            const item = buyOperations[operationIndex];
            let profitabilityNow: {
                percent: number,
                money: TFFormattPrice;
            } = {
                percent: 0,
                money: {} as TFFormattPrice,
            };
            const temp: IBondInfo = {} as IBondInfo;
            temp.number = operationIndex + 1;
            temp.date = item.date;
            temp.quantity = Number(item.quantity);
            temp.priceTotal = {
                value: formattedMoneySupply(getNumberMoney(item.payment) * -1),
                oneLot: formattedMoneySupply(getNumberMoney(item.price)),
            };
            temp.ownershipPeriod = moment().diff(moment(item.date), 'month');
            temp.coupones = temp.quantity * calcAmountBondForPay.reduce((acc, pay) => {
                if (moment(pay.day) >= moment(item.date)) {
                    return acc + pay.payOneLot
                }
                return acc
            }, 0);
            profitabilityNow.money = formattedMoneySupply(withTax ? temp.coupones * 0.87 : temp.coupones);
            profitabilityNow.percent = Number(((withTax ? (temp.coupones * 0.87) / temp.priceTotal.value.value : temp.coupones / temp.priceTotal.value.value) * 100).toFixed(2));
            temp.coupones = formattedMoneySupply(temp.coupones)
            temp.profitabilityNow = profitabilityNow;
            operationIndex++;
            if (stopWrite < Number(positionsByBond.quantity.units)) {
                result.push(temp);
                stopWrite += Number(item.quantity);
            } else {
                break;
            }
        }

        return {
            name: bondData.name,
            result,
        }
    }
    return {
        name: bondData.name,
        result: [],
    }
}