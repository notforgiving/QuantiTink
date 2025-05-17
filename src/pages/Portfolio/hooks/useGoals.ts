import { useState } from "react";
import { searchInLocalStorageByKey } from "../../../utils";
import { FormikProps, useFormik } from "formik";

export interface IGoalssForm {
    [x: string]: number | null;
}

interface IUseGoalsProps {
    accountId: string
}

type TUseGoals = (props: IUseGoalsProps) => {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    formik: FormikProps<IGoalssForm>,
    error: string;
    validateFillFields: () => void;
    openPanel: boolean;
    setOpenPanel: React.Dispatch<React.SetStateAction<boolean>>
}
export const useGoals: TUseGoals = ({ accountId }) => {
    const [openPanel, setOpenPanel] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [open, setOpen] = useState<boolean>(false);
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
                setOpen(false);
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
            setOpen(true)
            setError("Перед ребалансом надо задать все значения");
        }

    }
    return {
        open,
        setOpen,
        formik,
        error,
        validateFillFields,
        openPanel,
        setOpenPanel,
    }
}