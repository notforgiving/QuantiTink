import React, { FC } from "react";
import css from "./styles.module.scss";
import Input from "UI/components/Input";
import Button from "UI/components/Button";
import { useCalcBonds } from "./hook/useCalcBonds";
import Bond from "./components/Bond";
import Loader from "components/Loader";
import cn from "classnames";

const CalcBonds: FC = () => {
  const {
    inputField,
    setInputField,
    handleAddBond,
    handleRemoveBond,
    isLoading,
    error,
    bondsTable,
    handleChangeValueBonds,
    isLoadingBonds,
    handleChangeCurrentPrice,
    setSortByProfitability,
    sortFunction,
    sortByProfitability,
  } = useCalcBonds({});

  const conditionLoading = (isLoadingBonds || isLoading) && !bondsTable.length;
  return (
    <div className={css.calc_container}>
      <div className={css.header}>
        <span className={css.header_title}>Рассчет доходности облигаций</span>
        <div className={css.header_field}>
          <Input
            error={error || undefined}
            inputAttributes={{
              type: "text",
              value: inputField,
              placeholder: "Введите ISIN облигации",
              onChange: (e) => setInputField(e.target.value),
              disabled: conditionLoading,
            }}
          />
          <Button
            text="Добавить"
            buttonAttributes={{
              onClick: () => handleAddBond(),
              disabled: conditionLoading || inputField === "",
            }}
          />
        </div>
      </div>
      {bondsTable.length > 1 && !isLoading && (
        <div className={css.actions}>
          <Button
            text={
              sortByProfitability === null
                ? "Сортировать по увеличению доходности"
                : sortByProfitability === false
                ? "Сортировать по уменьшению доходности"
                : "Сортировать по алфавиту"
            }
            buttonAttributes={{
              onClick: () =>
                setSortByProfitability((prevState) => {
                  if (prevState) {
                    return null;
                  }
                  if (prevState === null) {
                    return false;
                  }
                  return true;
                }),
              disabled: isLoading || isLoadingBonds,
            }}
          />
        </div>
      )}
      <div
        className={cn(css.body, {
          isLoading: conditionLoading,
        })}
      >
        {conditionLoading && (
          <div className={css.loading}>
            <Loader />
          </div>
        )}
        {/* {isLoading && <LoadingBond />} */}
        {!!bondsTable.length &&
          !isLoading &&
          bondsTable
            .sort(sortFunction)
            .map((item) => (
              <Bond
                key={item.isin}
                itemData={item}
                handleRemoveBond={handleRemoveBond}
                handleChangeValueBonds={handleChangeValueBonds}
                handleChangeCurrentPrice={handleChangeCurrentPrice}
              />
            ))}
      </div>
    </div>
  );
};

export default CalcBonds;
