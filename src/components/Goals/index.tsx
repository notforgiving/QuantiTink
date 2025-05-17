import React, { FC } from "react";
import css from "./styles.module.scss";
import cn from "classnames";
import Button from "../../UI/components/Button";
import { TFFormattPrice } from "../../types/common";
import { Form, FormikProps, FormikProvider } from "formik";
import Input from "../../UI/components/Input";
import { IGoalssForm } from "../../pages/Portfolio/hooks/useGoals";

interface IGoalsProps {
  shares: boolean;
  rubBonds: boolean;
  usdBonds: boolean;
  etfs: (TFFormattPrice & {
    percent: number;
    name: string;
    ticker: string;
  })[];
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  formik: FormikProps<IGoalssForm>;
  error: string;
}

const Goals: FC<IGoalsProps> = ({
  shares,
  rubBonds,
  usdBonds,
  etfs,
  open,
  setOpen,
  formik,
  error,
}) => {
  return (
    <div
      className={cn(css.goals, {
        _isOpen: open,
      })}
    >
      <div className={css.goals_main} onClick={() => setOpen(true)}>
        Цели
      </div>
      <div className={css.goals_body}>
        <div className={css.goals_content}>
          {error !== "" && <div className={css.goals_hint}>{error}</div>}
          <FormikProvider value={formik}>
            <Form>
              <div className={css.goals_form}>
                {shares && (
                  <Input
                    label="Акции"
                    buttonAttributes={{
                      placeholder: "Введите число...",
                      type: "number",
                      required: true,
                      value: String(formik.values.shares) || "",
                      onChange: (e) =>
                        formik.setFieldValue("shares", Number(e.target.value)),
                    }}
                  />
                )}
                {rubBonds && (
                  <Input
                    label="Рублевые облигации"
                    buttonAttributes={{
                      placeholder: "Введите число...",
                      type: "number",
                      required: true,
                      value: String(formik.values.rubBonds) || "",
                      onChange: (e) =>
                        formik.setFieldValue(
                          "rubBonds",
                          Number(e.target.value)
                        ),
                    }}
                  />
                )}
                {usdBonds && (
                  <Input
                    label="Валютные облигации"
                    buttonAttributes={{
                      placeholder: "Введите число...",
                      type: "number",
                      required: true,
                      value: String(formik.values.usdBonds) || "",
                      onChange: (e) =>
                        formik.setFieldValue(
                          "usdBonds",
                          Number(e.target.value)
                        ),
                    }}
                  />
                )}
                {etfs &&
                  etfs.map((etf) => (
                    <Input
                      key={etf.ticker}
                      label={etf.name}
                      buttonAttributes={{
                        placeholder: "Введите число...",
                        type: "number",
                        required: true,
                        value: String(formik.values[etf.ticker]),
                        onChange: (e) => {
                          formik.setFieldValue(
                            etf.ticker,
                            Number(e.target.value)
                          );
                        },
                      }}
                    />
                  ))}
              </div>
            </Form>
          </FormikProvider>
        </div>
        <div className={css.goals_actions}>
          <Button
            text="Отменить"
            buttonAttributes={{
              onClick: () => setOpen(false),
            }}
          />
          <Button
            text="Сохранить"
            buttonAttributes={{
              onClick: () => formik.submitForm(),
              disabled: error !== "",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Goals;
