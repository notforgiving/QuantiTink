import React from "react";
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

import Account from "./components/Account";

import css from "./styles.module.scss";

const TokenFormSchema = Yup.object().shape({
  token: Yup.string().required("Обязательное поле"),
});

const HomePage = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { currentUser } = useUser();
  const { data: token, loading } = useToken();
  const { data: accounts } = useAccounts();

  return (
    <div
      className={cn(css.main, {
        _isLoading: loading,
      })}
    >
      {loading && (
        <div className={css.loading}>
          <Atom />
        </div>
      )}
      {!loading && token === null && (
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
            onSubmit={(values, { resetForm }) => {
              if (!currentUser?.id) return; // или показать ошибку, лоадер и т.п.
              dispatch(
                writeTokenRequest({
                  token: values.token,
                  userId: currentUser?.id,
                })
              );
              resetForm();
            }}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className={css.form}>
                <FormikField<{ token: "" }>
                  name="token"
                  label=""
                  placeholder="Введите Tinkoff токен..."
                  type="text"
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
      )}
      {token !== null && !loading && (
        <>
          <div className={css.main__header}>
            <h1 className={css.title}>Портфель</h1>
            {/* <div className={css.grid}>
              <div className={css.grid__item}>
                <span>Стоимость портфеля</span>
                <strong>
                  {isLoadingPortfolios ||
                  !portfoliosData?.length ||
                  isLoadingOperations ||
                  !operationsData?.length ? (
                    <Load
                      style={{
                        width: "100%",
                        height: "21.5px",
                      }}
                    />
                  ) : (
                    totalAmountAllPortfolio.formatt
                  )}
                </strong>
              </div>
              <div
                className={cn(css.grid__item, {
                  _isGreen: portfoliosReturns.value >= 0,
                })}
              >
                <span>Доходность</span>
                <strong>
                  {isLoadingPortfolios ||
                  !portfoliosData?.length ||
                  isLoadingOperations ||
                  !operationsData?.length ? (
                    <Load
                      style={{
                        width: "100%",
                        height: "21.5px",
                      }}
                    />
                  ) : (
                    portfoliosReturns.formatt
                  )}
                </strong>
              </div>
              <div
                className={cn(css.grid__item, {
                  _isGreen: portfoliosReturns.value >= 0,
                })}
              >
                <span>Доходность %</span>
                <strong>
                  {isLoadingPortfolios ||
                  !portfoliosData?.length ||
                  isLoadingOperations ||
                  !operationsData?.length ? (
                    <Load
                      style={{
                        width: "100%",
                        height: "21.5px",
                      }}
                    />
                  ) : (
                    portfoliosReturns.percent
                  )}
                </strong>
              </div>
              <div className={css.grid__item}>
                <span>Вложено</span>
                <strong>
                  {isLoadingPortfolios ||
                  !portfoliosData?.length ||
                  isLoadingOperations ||
                  !operationsData?.length ? (
                    <Load
                      style={{
                        width: "100%",
                        height: "21.5px",
                      }}
                    />
                  ) : (
                    totalAmountDepositsAllPortfolios.formatt
                  )}
                </strong>
              </div>
            </div> */}
          </div>
          <div className={css.accounts}>
            {accounts?.map((account: TAccount) => {
              return (
                <Account id={account.id} name={account.name} key={account.id} />
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;
