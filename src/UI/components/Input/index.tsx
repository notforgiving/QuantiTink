import React, { FC, InputHTMLAttributes, ReactNode } from "react";
import css from "./styles.module.scss";
import cn from "classnames";

interface IInputProps {
  label?: string | ReactNode;
  buttonAttributes?: InputHTMLAttributes<HTMLInputElement>;
}

const Input: FC<IInputProps> = ({ label, buttonAttributes }) => {
  return (
    <div className={cn(css.input, "input_component")}>
      {label && (
        <div className={cn(css.input_label, "input_label")}>{label}</div>
      )}
      <input
        {...buttonAttributes}
        className={cn(css.input_body, "input_body")}
      />
    </div>
  );
};

export default Input;
