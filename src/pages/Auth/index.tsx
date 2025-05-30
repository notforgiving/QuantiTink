import React, { FC, useEffect, useState } from "react";
import css from "./styles.module.scss";
import Input from "UI/components/Input";
import Button from "UI/components/Button";
import { FormikErrors, useFormik } from "formik";
import { useDispatch } from "react-redux";
import { userSlice } from "store/slices/user.slice";
import { useNavigate } from "react-router-dom";
import { useAuth } from "hooks/useAuth";

export type TInitialFormik = {
  email: string;
  password: string;
  confirmpassword: string;
};

const Auth: FC = () => {
  const dispatch = useDispatch();
  const { isAuth, errors } = useAuth();
  const [loginState, setLoginState] = useState<boolean>(true);
  const navigate = useNavigate();
  const formik = useFormik<TInitialFormik>({
    validate: (values: TInitialFormik) => {
      const errors: FormikErrors<TInitialFormik> = {};
      if (loginState) {
      } else {
        if (values.password !== values.confirmpassword) {
          errors.password = "Пароли должны совпадать";
        }
      }
      return errors;
    },
    initialValues: {
      email: "",
      password: "",
      confirmpassword: "",
    },
    onSubmit: (values) => {
      if (loginState) {
        dispatch(
          userSlice.actions.loginUserAction({
            email: values.email,
            password: values.password,
          })
        );
      } else {
        dispatch(
          userSlice.actions.createUserAction({
            email: values.email,
            password: values.password,
          })
        );

        formik.resetForm();
      }
    },
  });

  useEffect(() => {
    if (isAuth) {
      navigate("/");
    }
  }, [isAuth, navigate]);

  return (
    <div className={css.auth}>
      <div className={css.form}>
        <div className={css.auth_title}>
          {loginState ? "Авторизация" : "Регистрация"}
        </div>
        <div className={css.form_input}>
          <Input
            label="Ваш email"
            inputAttributes={{
              required: true,
              placeholder: "Введите email...",
              value: formik.values.email,
              onChange: (e) => formik.setFieldValue("email", e.target.value),
              name: "email",
              type: "email",
            }}
          />
          <div className={css.form_inputError}></div>
        </div>
        <div className={css.form_input}>
          <Input
            label="Пароль"
            inputAttributes={{
              required: true,
              placeholder: loginState ? "Введите пароль" : "Придумайте пароль",
              value: formik.values.password,
              onChange: (e) => formik.setFieldValue("password", e.target.value),
              name: "password",
              type: "password",
            }}
          />
          <div className={css.form_inputError}></div>
        </div>
        {!loginState && (
          <div className={css.form_input}>
            <Input
              label="Подтверждение пароля"
              inputAttributes={{
                required: true,
                placeholder: "Повторите пароль",
                value: formik.values.confirmpassword,
                onChange: (e) =>
                  formik.setFieldValue("confirmpassword", e.target.value),
                name: "password_confirm",
                type: "password",
              }}
            />
            <div className={css.form_inputError}></div>
          </div>
        )}
        <Button
          text={loginState ? "Войти" : "Зарегистрироваться"}
          buttonAttributes={{
            onClick: () => formik.submitForm(),
          }}
        />
        {formik.errors.password !== "" && (
          <div className={css.form_error}>{formik.errors.password}</div>
        )}
        {!!errors && <div className={css.form_error}>{String(errors)}</div>}
        <div
          className={css.form_login}
          onClick={() => setLoginState(!loginState)}
        >
          {loginState ? "Регистрация" : "Уже есть аккаунт"}
        </div>
      </div>
    </div>
  );
};

export default Auth;
