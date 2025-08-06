import React, { useMemo } from "react";
import { useDispatch } from "react-redux";
import { TAccount } from "api/features/accounts/accountsSlice";
import { useAccounts } from "api/features/accounts/useAccounts";
import { writeTokenRequest } from "api/features/token/tokenSlice";
import { useToken } from "api/features/token/useToken";
import { useUser } from "api/features/user/useUser";
import { AppDispatch } from "api/store";
import cn from "classnames";
import { Form, Formik } from "formik";
import FormikField from "Pages/LoginPage/components/FormikField";
import Atom from "UI/components/Atom";
import Button from "UI/components/Button";
import * as Yup from "yup";

import { formatMoney } from "utils/formatMoneyAmount";

import Account from "./components/Account";
import { usePortfolioMetrics } from "./hooks/usePortfolioMetrics";

import css from "./styles.module.scss";

const TokenFormSchema = Yup.object().shape({
  token: Yup.string().required("Обязательное поле"),
});

const HomePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentUser } = useUser();
  const { data: token, loading, error } = useToken(); // если error есть
  const { data: accounts } = useAccounts();

  const {
    totalPortfolio,
    totalInvested,
    totalReturn,
    totalReturnPercent,
    accountMetrics,
  } = usePortfolioMetrics();

  const zeroMoney = useMemo(() => formatMoney(0), []);
  const accountMetricMap = useMemo(() => {
    return new Map(accountMetrics.map((metric) => [metric.id, metric]));
  }, [accountMetrics]);

  const handleSubmit = (values: { token: string }, { resetForm }: any) => {
    if (!currentUser?.id) {
      console.warn("No user ID");
      return;
    }

    dispatch(
      writeTokenRequest({ token: values.token, userId: currentUser.id })
    );
    resetForm();
  };

  if (loading) {
    return (
      <div className={cn(css.main, css.loading)}>
        <Atom />
      </div>
    );
  }

  if (error) {
    return (
      <div className={css.error}>Ошибка загрузки данных. Попробуйте позже.</div>
    );
  }

  if (!token) {
    return (
      <div className={css.main}>
        <div className={css.token}>
          <strong className={css.token_title}>
            Добро пожаловать! <br /> Вы попали в приложение для анализа
            инвестиций в T-банке. Введите токен ниже для продолжения работы.{" "}
            <a
              href="https://developer.tbank.ru/invest/intro/intro/token#%D0%BF%D0%BE%D0%BB%D1%83%D1%87%D0%B8%D1%82%D1%8C-%D1%82%D0%BE%D0%BA%D0%B5%D0%BD"
              rel="noreferrer"
              target="_blank"
            >
              Инструкция как создать токен
            </a>
          </strong>

          <Formik
            initialValues={{ token: "" }}
            validationSchema={TokenFormSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className={css.form}>
                <FormikField<{ token: string }>
                  name="token"
                  placeholder="Введите Tinkoff токен..."
                  type="text"
                  label=""
                />
                <Button
                  text="Добавить"
                  buttonAttributes={{
                    type: "submit",
                    disabled: isSubmitting,
                  }}
                />
              </Form>
            )}
          </Formik>
        </div>
      </div>
    );
  }

  return (
    <div className={css.main}>
      <div className={css.main__header}>
        <h1 className={css.title}>Портфель</h1>
        <div className={css.grid}>
          <div className={css.grid__item}>
            <span>Стоимость портфеля</span>
            <strong>{totalPortfolio.formatted}</strong>
          </div>
          <div
            className={cn(css.grid__item, {
              _isGreen: totalReturn.value >= 0,
            })}
          >
            <span>Доходность</span>
            <strong>{totalReturn.formatted}</strong>
          </div>
          <div
            className={cn(css.grid__item, {
              _isGreen: Number(totalReturnPercent) >= 0,
            })}
          >
            <span>Доходность %</span>
            <strong>{totalReturnPercent}%</strong>
          </div>
          <div className={css.grid__item}>
            <span>Вложено</span>
            <strong>{totalInvested.formatted}</strong>
          </div>
        </div>
      </div>

      <div className={css.accounts}>
        {accounts?.map((account: TAccount) => {
          const metric = accountMetricMap.get(account.id);
          return (
            <Account
              key={account.id}
              id={account.id}
              name={account.name}
              invested={metric?.invested ?? zeroMoney}
              formattedPortfolio={metric?.formattedPortfolio ?? zeroMoney}
              returnPercent={metric?.returnPercent ?? "0.00"}
            />
          );
        })}
      </div>
    </div>
  );
};

export default HomePage;
