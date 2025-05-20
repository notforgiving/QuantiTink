import { useEffect, useState } from "react";
import { searchInLocalStorageByKey, useCalcRebalancePortfolio } from "../../../utils";
import { FormikProps, useFormik } from "formik";
import { TFAmount } from "../../../types/portfolio.type";
import { IPortfolioItem } from "./usePortfolio";
import { TFFormattPrice } from "../../../types/common";

export interface IGoalssForm {
    [x: string]: number | null;
}

interface IUseGoalsProps {
    accountId: string;
    totalAmountPortfolio: TFAmount;
    totalAmountCurrencies: TFAmount;
    shares: IPortfolioItem;
    rubBonds: IPortfolioItem;
    usdBonds: IPortfolioItem;
    etfArray: (TFFormattPrice & {
        percent: number;
        name: string;
        ticker: string;
    })[]
}

type TUseGoals = (props: IUseGoalsProps) => {
    openTargets: boolean,
    setOpenTargets: React.Dispatch<React.SetStateAction<boolean>>
    formik: FormikProps<IGoalssForm>,
    error: string;
    validateFillFields: () => void;
    openPanel: boolean;
    setOpenPanel: React.Dispatch<React.SetStateAction<boolean>>;
    freeAmountMoney: number;
    setFreeAmountMoney: React.Dispatch<React.SetStateAction<number>>;
    resultValues: {
        [x: string]: number;
    }
}
export const useGoals: TUseGoals = ({ accountId, totalAmountPortfolio, shares,
    rubBonds,
    usdBonds,
    etfArray, totalAmountCurrencies }) => {
    const [openTargets, setOpenTargets] = useState<boolean>(false);
    const [openPanel, setOpenPanel] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [freeAmountMoney, setFreeAmountMoney] = useState<number>(0);
    const localStorageInfo: { [x: string]: IGoalssForm } | null =
        searchInLocalStorageByKey("TBalance_goals");
    const initialValues = localStorageInfo && localStorageInfo[accountId] ? localStorageInfo[accountId] : {};
    const formik = useFormik<IGoalssForm>({
        validate: (values: IGoalssForm) => {
            const temp = Object.values(values).reduce((acc, el) =>
                acc !== null && el !== null ? acc + el : 0
            );
            if (temp && temp > 100 && temp < 100) {
                setError("Сумма значений должна быть 100 процентов");
            } else {
                setError("");
            }
        },
        initialValues,
        onSubmit: (values) => {
            if (error === "") {
                const preliminary = {
                    ...localStorageInfo,
                    [accountId]: values,
                }
                localStorage.setItem("TBalance_goals", JSON.stringify(preliminary));
                setOpenTargets(false);
            }
        },
    });

    function validateForm(values: IGoalssForm) {
        if (Object.values(values).length === 0) {
            return false
        }
        return !Object.values(values).some(el => el === null)
    }

    const validateFillFields = () => {
        if (validateForm(formik.values)) {
            setOpenPanel(true)
        } else {
            setOpenTargets(true)
            setError("Перед ребалансом надо задать все значения");
        }
    }

    useEffect(() => {
        if (openPanel && openTargets) {
            setOpenTargets(false);
        }
    }, [openPanel, openTargets])

    const resultValues = useCalcRebalancePortfolio({
        freeAmountMoney, totalAmountPortfolio, totalAmountCurrencies, accountId, shares,
        rubBonds,
        usdBonds,
        etfArray,
    })

    return {
        openTargets,
        setOpenTargets,
        formik,
        error,
        validateFillFields,
        openPanel,
        setOpenPanel,
        freeAmountMoney,
        setFreeAmountMoney,
        resultValues,
    }
}