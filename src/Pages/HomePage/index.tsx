import React from "react";
import { useDispatch } from "react-redux";
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

import css from "./styles.module.scss";

const TokenFormSchema = Yup.object().shape({
  token: Yup.string().required("Обязательное поле"),
});

const HomePage = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { currentUser } = useUser();
  const { token, loading } = useToken();

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
    </div>
  );
};

export default HomePage;
