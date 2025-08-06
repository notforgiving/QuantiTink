import React, { ButtonHTMLAttributes, FC, ReactNode } from "react";
import cn from "classnames";

import css from "./styles.module.scss";

interface IButtonProps {
  text: string | ReactNode;
  buttonAttributes?: ButtonHTMLAttributes<HTMLButtonElement>;
  className?: string;
  /** Стиль кнопки - белый с бордером*/
  borderStyle?: boolean;
  /** Иконка в кнопке */
  icon?: ReactNode;
  rightIcon?: boolean;
}

const Button: FC<IButtonProps> = ({
  text,
  buttonAttributes,
  className,
  borderStyle,
  icon,
  rightIcon,
}) => {
  return (
    <button
      className={cn(css.btn, "Button_component", className, {
        _isBorderStyle: borderStyle,
        _isIcon: icon && text !== "",
        _isEmptyText: icon && text === "",
        _isReverse: rightIcon,
      })}
      {...buttonAttributes}
    >
      {icon}
      <span>{text}</span>
    </button>
  );
};

export default Button;
