import React, { FC, InputHTMLAttributes, ReactNode } from "react";
import css from "./styles.module.scss";
import cn from "classnames";

interface IInputProps {
  label?: string | ReactNode;
  inputAttributes?: InputHTMLAttributes<HTMLInputElement>;
  error?: string;
  leftLabel?: boolean;
}

const Input: FC<IInputProps> = ({
  label,
  inputAttributes,
  error,
  leftLabel,
}) => {
  if (inputAttributes && inputAttributes.type === "checkbox") {
    return (
      <div
        className={cn(css.input, css.checkbox, "input_component", {
          _isLeftLabel: leftLabel,
          isDisabled: inputAttributes.disabled,
        })}
        onClick={inputAttributes.onClick}
      >
        <div
          className={cn(css.checkbox, {
            _isChecked: inputAttributes.checked,
          })}
        >
          <div className={css.checkbox_square} {...inputAttributes} />
          {label && (
            <label className={cn(css.input_label, "input_label")}>
              {label}
            </label>
          )}
        </div>
      </div>
    );
  }
  return (
    <div
      className={cn(css.input, "input_component", {
        isDisabled: inputAttributes?.disabled,
      })}
    >
      {label && (
        <label className={cn(css.input_label, "input_label")}>{label}</label>
      )}
      <input
        {...inputAttributes}
        className={cn(css.input_body, "input_body")}
      />
      {error && <div className={css.input_error}>{error}</div>}
    </div>
  );
};

export default Input;
