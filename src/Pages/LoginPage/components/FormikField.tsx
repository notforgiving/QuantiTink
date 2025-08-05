import { useFormikContext } from "formik";
import css from '../styles.module.scss'
import Input from "UI/components/Input";

type FormikFieldProps<T> = {
  name: keyof T;
  label: string;
  placeholder?: string;
  type?: string;
};

const FormikField = <T extends Record<string, any>>({
  name,
  label,
  placeholder,
  type = "text",
}: FormikFieldProps<T>) => {
  const {
    values,
    handleChange,
    handleBlur,
    touched,
    errors,
  } = useFormikContext<T>();

  return (
    <div className={css.form_input}>
      <Input
        label={label}
        inputAttributes={{
          name: name as string, // нужно привести к string, т.к. name — keyof T
          type,
          value: values[name],
          onChange: handleChange,
          onBlur: handleBlur,
          placeholder,
          required: true,
        }}
      />
      {touched[name] && typeof errors[name] === "string" && (
        <div className={css.form_inputError}>{errors[name]}</div>
      )}
    </div>
  );
};

export default FormikField;

