import { useCallback, useState } from "react";
import { TActiveProfitability, TFSortDir, TFSortKey } from "../types";
import { StateType } from "store/root-reducer";
import { useSelector } from "react-redux";
import { TAccordanceTariffAndComissions } from "types/info.type";
import { searchItemInArrayData } from "utils";
import { TFPortfolio, TFPosition } from "types/portfolio.type";
import { TFUnionOperations } from "store/slices/operations.slice";
import { TFOperation } from "types/operations.types";

interface IUseProfitability {
    accountId: string;
    customWithTax?: boolean;
}

type TUseProfitability = (props: IUseProfitability) => {
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
    tariff: keyof TAccordanceTariffAndComissions,
    positions: TFPosition[],
    operations: TFOperation[],
    sortFunction: (a: TActiveProfitability, b: TActiveProfitability) => number,
}

export const useProfitability: TUseProfitability = ({ accountId, customWithTax = true }) => {
    const tariff = useSelector((state: StateType) => state.info.data?.tariff || 'investor');
    const [search, setSearch] = useState<string>('');
    const [withTax, setWithTax] = useState<boolean>(customWithTax);
    const [comissionToggle, setComissionToggle] = useState<boolean>(true);
    const [currentSort, setCurrentSort] = useState<{
        key: TFSortKey,
        dir: TFSortDir,
    }>({
        key: 'DEFAULT',
        dir: 'ASC'
    });
    const { positions } = useSelector((state: StateType) => searchItemInArrayData(
        state.portfolios.data || [],
        "accountId",
        accountId,
    )) || {} as TFPortfolio;

    const { operations } = useSelector((state: StateType) => searchItemInArrayData(
        state.operations.data || [],
        "accountId",
        accountId
    ) || {} as TFUnionOperations);

    const sortFunction = useCallback((a: TActiveProfitability, b: TActiveProfitability) => {
        if (currentSort.key === 'PROFITABILITY' && currentSort.dir === 'ASC') {
            return a.profitabilityNow.money.value - b.profitabilityNow.money.value;
        }
        if (currentSort.key === 'PROFITABILITY' && currentSort.dir === 'DESC') {
            return b.profitabilityNow.money.value - a.profitabilityNow.money.value;
        }
        if (currentSort.key === 'NUMBER' && currentSort.dir === 'ASC') {
            return b.number - a.number;
        }
        if (currentSort.key === 'NUMBER' && currentSort.dir === 'DESC') {
            return a.number - b.number;
        }
        if (currentSort.key === 'DATE' && currentSort.dir === 'ASC') {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        if (currentSort.key === 'DATE' && currentSort.dir === 'DESC') {
            return new Date(a.date).getTime() - new Date(b.date).getTime();
        }

        return a.number - b.number;
    }, [currentSort])

    return {
        search,
        setSearch,
        withTax,
        setWithTax,
        comissionToggle,
        setComissionToggle,
        setCurrentSort,
        currentSort,
        tariff,
        positions,
        operations,
        sortFunction,
    }
}