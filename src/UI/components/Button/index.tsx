import React, { ButtonHTMLAttributes, FC, ReactNode } from "react";
import css from "./styles.module.scss";
import cn from "classnames";

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
