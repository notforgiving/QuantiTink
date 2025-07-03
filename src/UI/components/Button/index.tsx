import React, { ButtonHTMLAttributes, FC, ReactNode } from "react";
import css from "./styles.module.scss";
import cn from "classnames";

interface IButtonProps {
  text: string | ReactNode;
  buttonAttributes?: ButtonHTMLAttributes<HTMLButtonElement>;
  className?: string;
  /** Стиль кнопки - белый с бордером*/
  borderStyle?: boolean;
}

const Button: FC<IButtonProps> = ({
  text,
  buttonAttributes,
  className,
  borderStyle,
}) => {
  return (
    <button
      className={cn(css.btn, "Button_component", className, {
        _isBorderStyle: borderStyle,
      })}
      {...buttonAttributes}
    >
      {text}
    </button>
  );
};

export default Button;
