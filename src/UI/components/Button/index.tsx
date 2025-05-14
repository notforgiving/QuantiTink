import React, { ButtonHTMLAttributes, FC, ReactNode } from "react";
import css from "./styles.module.scss";

interface IButtonProps {
  text: string | ReactNode;
  buttonAttributes?: ButtonHTMLAttributes<HTMLButtonElement>;
}

const Button: FC<IButtonProps> = ({ text, buttonAttributes }) => {
  return (
    <button className={css.btn} {...buttonAttributes}>
      {text}
    </button>
  );
};

export default Button;
