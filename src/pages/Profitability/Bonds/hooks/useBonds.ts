import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { StateType } from "store/root-reducer";

interface IResultArray {
    figi: string;
    name: string;
    quantity: number;
}

interface IUseBonds {
    accountId: string;
    currency: string;
}

type TUseBonds = (props: IUseBonds) => {
    bondsList: IResultArray[]
}

export const useBonds: TUseBonds = ({ accountId, currency }) => {
    const portfolio = useSelector((state: StateType) => state.portfolios.data?.filter(item => item.accountId === accountId)[0]);
    const { instrument: bondsState } = useSelector((state: StateType) => state.bonds.data);
    const [bondsList, setBondsList] = useState<IResultArray[]>([]);

    useEffect(() => {
        const portfolioBonds = portfolio?.positions.filter(el => el.instrumentType === 'bond');
        const tempMap: IResultArray[] = bondsState.map(bond => {
            if (bond.nominal.currency === currency) {
                const portfolioBondsItem = portfolioBonds?.filter(el => el.figi === bond.figi)[0];
                return {
                    figi: bond.figi,
                    name: bond.name,
                    quantity: Number(portfolioBondsItem?.quantity.units) || 0,
                }
            }
        }).filter(el => el !== undefined)
        setBondsList(tempMap)
    }, [bondsState, currency, portfolio?.positions])

    return {
        bondsList
    }
}