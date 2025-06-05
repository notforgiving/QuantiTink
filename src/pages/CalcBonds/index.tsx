import React, { FC } from "react";
import Container from "UI/components/Container";
import css from "./styles.module.scss";
import Input from "UI/components/Input";
import Button from "UI/components/Button";
import { useCalcBonds } from "./hook/useCalcBonds";
import Bond from "./components/Bond";
import { useNavigate } from "react-router-dom";
import LoadingBond from "./components/LoadingBond";

const CalcBonds: FC = () => {
  const navigate = useNavigate();
  const {
    inputField,
    setInputField,
    handleAddBond,
    bonds,
    handleRemoveBond,
    isLoading,
    error,
    bondsTable,
    handleChangeValueBonds,
    isLoadingBonds,
  } = useCalcBonds({});
  console.log(bondsTable,'bondsTable');
  
  return (
    <Container className={css.calc_container}>
      <div className={css.back}>
        <Button
          text="Назад"
          buttonAttributes={{
            type: "button",
            onClick: () => navigate(-1),
            disabled: isLoadingBonds,
          }}
        />
      </div>
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
      <div className={css.body}>
        {!!bondsTable.length &&
          bondsTable.map((item) => (
            <Bond
              key={item.isin}
              itemData={item}
              handleRemoveBond={handleRemoveBond}
              handleChangeValueBonds={handleChangeValueBonds}
            />
          ))}
        {isLoading && <LoadingBond />}
        {isLoadingBonds && "Загрузка, подождите пожалуйста"}
      </div>
    </Container>
  );
};

export default CalcBonds;
