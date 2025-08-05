import React, { FC, useEffect, useState } from "react";
import css from "./styles.module.scss";
import { ReactComponent as LogoSvg } from "assets/logo.svg";
import { loginRequest, registerRequest } from "api/features/user/userSlice";
import { useDispatch } from "react-redux";
import { useAuth } from "api/features/user/useAuth";
import { AppDispatch } from "api/store";
import { useNavigate } from "react-router-dom";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import Button from "UI/components/Button";
import { FormValues } from "./types";
import FormikField from "./components/FormikField";

const getValidationSchema = (isLoginMode: boolean) =>
  Yup.lazy(() =>
    Yup.object().shape({
      email: Yup.string().email("Неверный email").required("Обязательное поле"),
      password: Yup.string()
        .min(6, "Минимум 6 символов")
        .required("Обязательное поле"),
      confirmPassword: isLoginMode
        ? Yup.string().notRequired()
        : Yup.string()
            .required("Подтвердите пароль")
            .oneOf([Yup.ref("password")], "Пароли не совпадают"),
    })
  );

const LoginPage: FC = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const dispatch = useDispatch<AppDispatch>();
  const { isAuth, error, loading } = useAuth();
  const navigate = useNavigate();

  const toggleMode = () => setIsLoginMode((prev) => !prev);

  useEffect(() => {
    if (isAuth) {
      navigate("/", { replace: true });
    }
  }, [isAuth, navigate]);

  return (
    <div className={css.auth}>
      <div className={css.auth__bg}>
        <span></span>
        <span></span>
      </div>
      <div className={css.logo}>
        <LogoSvg />
      </div>

      <Formik<FormValues>
        initialValues={{
          email: "",
          password: "",
          confirmPassword: "",
        }}
        validationSchema={getValidationSchema(isLoginMode)}
        validateOnBlur={true}
        onSubmit={(values) => {
          const { email, password } = values;
          if (isLoginMode) {
            dispatch(loginRequest({ email, password }));
          } else {
            dispatch(registerRequest({ email, password }));
          }
        }}
        enableReinitialize
      >
        <Form className={css.form}>
          <div className={css.auth_title}>
            {isLoginMode ? "Вход" : "Регистрация"}
          </div>

          <FormikField<FormValues>
            name="email"
            label="Ваш email"
            placeholder="Введите email..."
            type="email"
          />
          <FormikField<FormValues>
            name="password"
            label="Пароль"
            placeholder="Введите пароль"
            type="password"
          />
          {!isLoginMode && (
            <FormikField<FormValues>
              name="confirmPassword"
              label="Подтверждение пароля"
              placeholder="Повторите пароль"
              type="password"
            />
          )}

          <Button
            text={isLoginMode ? "Войти" : "Зарегистрироваться"}
            borderStyle
            buttonAttributes={{
              type: "submit",
              disabled: loading,
            }}
          />

          {error && <div className={css.form_error}>{error}</div>}

          <div className={css.form_login} onClick={toggleMode}>
            {loading
              ? "Загрузка..."
              : !isLoginMode
              ? "Войти"
              : "Зарегистрироваться"}
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default LoginPage;
