import React, { FC } from "react";
import css from "./styles.module.scss";
import Input from "UI/components/Input";
import Button from "UI/components/Button";
import { useCalcBonds } from "./hook/useCalcBonds";
import Bond from "./components/Bond";

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

  return (
    <div>
      <div className={css.header}>
        <span className={css.header_title}>Введите ISIN облигации</span>
        <div className={css.header_field}>
          <Input
            error={error || undefined}
            inputAttributes={{
              type: "text",
              value: inputField,
              placeholder: "Введите ISIN",
              onChange: (e) => setInputField(e.target.value),
              disabled: isLoading || isLoadingBonds,
            }}
          />
          <Button
            text="Добавить"
            buttonAttributes={{
              onClick: () => handleAddBond(),
              disabled: isLoading || isLoadingBonds,
            }}
          />
        </div>
      </div>
      {bondsTable.length > 1 && (
        <div className={css.back}>
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

      <div className={css.body}>
        {isLoading && "Загрузка, подождите пожалуйста"}
        {/* {isLoading && <LoadingBond />} */}
        {!!bondsTable.length && !isLoading &&
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
