import React, { FC, useState } from "react";
import css from "./styles.module.scss";
import Input from "UI/components/Input";
import Button from "UI/components/Button";

const Auth: FC = () => {
  const [loginState, setLoginState] = useState<boolean>(false);
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
              value: "",
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
              value: "",
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
                value: "",
                name: "password_confirm",
                type: "password",
              }}
            />
            <div className={css.form_inputError}></div>
          </div>
        )}
        <Button text={loginState ? "Войти" : "Зарегистрироваться"} />
        <div className={css.form_error}></div>
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
