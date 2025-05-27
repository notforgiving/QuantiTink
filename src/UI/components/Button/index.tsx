import React, { ButtonHTMLAttributes, FC, ReactNode } from "react";
import css from "./styles.module.scss";
import cn from "classnames";

interface IButtonProps {
  text: string | ReactNode;
  buttonAttributes?: ButtonHTMLAttributes<HTMLButtonElement>;
  className?: string;
}

const Button: FC<IButtonProps> = ({ text, buttonAttributes, className }) => {
  return (
    <button
      className={cn(css.btn, "Button_component", className)}
      {...buttonAttributes}
    >
      {text}
    </button>
  );
};

export default Button;
