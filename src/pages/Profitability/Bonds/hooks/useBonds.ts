import moment from "moment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { StateType } from "store/root-reducer";

interface IResultArray {
    figi: string;
    name: string;
    quantity: number;
    icon: string;
    iconColor: string;
}

interface IUseBonds {
    accountId: string;
    currency: string;
}

type TUseBonds = (props: IUseBonds) => {
    bondsList: IResultArray[]
    repaymentDateList: {
        value: number;
        name: string;
        maturityDate: string;
        diffInDays: number;
        totalBonds: number,
    }[]
}

export const useBonds: TUseBonds = ({ accountId, currency }) => {
    const portfolio = useSelector((state: StateType) => state.portfolios.data?.filter(item => item.accountId === accountId)[0]);
    const { instrument: bondsState } = useSelector((state: StateType) => state.bonds.data);
    const [bondsList, setBondsList] = useState<IResultArray[]>([]);
    const [repaymentDateList, setRepaymentDate] = useState<{
        value: number;
        name: string;
        maturityDate: string;
        diffInDays: number;
        totalBonds: number,
    }[]>([]);


    useEffect(() => {
        const portfolioBonds = portfolio?.positions.filter(el => el.instrumentType === 'bond');
        const tempMap: IResultArray[] = bondsState.map(bond => {
            if (bond.nominal.currency === currency) {
                const portfolioBondsItem = portfolioBonds?.filter(el => el.figi === bond.figi)[0];
                return {
                    figi: bond.figi,
                    name: bond.name,
                    quantity: Number(portfolioBondsItem?.quantity.units) || 0,
                    icon: bond.brand.logoName.replace('.png', ''),
                    iconColor: bond.brand.logoBaseColor,
                }
            }
        }).filter(el => el !== undefined)
        setBondsList(tempMap)
    }, [bondsState, currency, portfolio?.positions])

    const sortFunctionByDate = (a: any, b: any) => {
        const aMaturityDate = new Date(a.maturityDate).getTime();
        const bMaturityDate = new Date(b.maturityDate).getTime();
        if (aMaturityDate < bMaturityDate) {
            return -1;
        }
        if (aMaturityDate > bMaturityDate) {
            return 1;
        }
        // names must be equal
        return 0;
    }

    useEffect(() => {
        if (!!bondsState.length) {
            let temp: {
                [x: string]: {
                    value: number,
                    name: string,
                    maturityDate: string,
                    diffInDays: number,
                    totalBonds: number,
                }
            } = {};
            let bonds = [...bondsState];
            console.log(bonds,'bonds');
            
            const sortArray = bonds.sort(sortFunctionByDate).filter(item=>item.nominal.currency===currency);
            console.log(bonds,'bonds');
            
            console.log(sortArray,'sortArray');
            
            const maturityDate = moment(sortArray[sortArray.length - 1].maturityDate);
            const nowDate = moment();
            var biggestMaturityDate = maturityDate.diff(nowDate, 'days');
            sortArray.forEach(item => {
                const maturityDate = moment(item.maturityDate);
                const nowDate = moment();
                var diffInDays = maturityDate.diff(nowDate, 'days');
                const data = maturityDate.format('MMYYYY');
                if (temp[data]) {
                    temp[data]['value'] += 1;
                } else {
                    temp[data] = {
                        value: 1,
                        name: maturityDate.format('MM/YYYY'),
                        maturityDate: item.maturityDate,
                        diffInDays: (diffInDays / biggestMaturityDate) * 100,
                        totalBonds: sortArray.length,
                    };
                }
            })

            const result = Object.values(temp).map(item => item);
            setRepaymentDate(result)
        }

    }, [bondsState])

    return {
        bondsList,
        repaymentDateList,
    }
}