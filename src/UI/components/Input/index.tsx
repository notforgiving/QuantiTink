import React, { FC, InputHTMLAttributes, ReactNode } from "react";
import css from "./styles.module.scss";
import cn from "classnames";

interface IInputProps {
  label?: string | ReactNode;
  inputAttributes?: InputHTMLAttributes<HTMLInputElement>;
}

const Input: FC<IInputProps> = ({ label, inputAttributes }) => {
  console.log(inputAttributes?.checked, inputAttributes?.id);

  if (inputAttributes && inputAttributes.type === "checkbox") {
    return (
      <div className={cn(css.input, css.checkbox, "input_component")}>
        <label
          className={cn(css.input_label, "input_label")}
          htmlFor={inputAttributes?.id || inputAttributes?.name}
        >
          <input
            {...inputAttributes}
            id={inputAttributes?.id || inputAttributes?.name}
            className={cn(css.input_body, "input_body")}
          />
          <span>{label}</span>
        </label>
      </div>
    );
  }
  return (
    <div className={cn(css.input, "input_component")}>
      {label && (
        <label className={cn(css.input_label, "input_label")}>{label}</label>
      )}
      <input
        {...inputAttributes}
        className={cn(css.input_body, "input_body")}
      />
    </div>
  );
};

export default Input;
