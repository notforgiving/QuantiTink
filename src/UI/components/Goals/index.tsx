import React, { FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { saveGoalsRequest, TAccount } from "api/features/accounts/accountsSlice";
import { useUser } from "api/features/user/useUser";
import cn from "classnames";
import { TPortfolioItem } from "Pages/AccountPage/hook/useAccount";

import Button from "../Button";
import Input from "../Input";

import css from "./styles.module.scss";

interface IGoalsProps {
  shares?: boolean;
  bond: [string, TPortfolioItem][] | null;
  etfs: [string, TPortfolioItem][] | null;
  account: TAccount | null
}

const Goals: FC<IGoalsProps> = ({ shares, bond, etfs,account }) => {
  const dispatch = useDispatch();
  const { currentUser } = useUser();

  const [open, setOpen] = useState<boolean>(false);
  const [values, setValues] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  // --- Собираем все ключи ---
  const allKeys = [
    ...(shares ? ["shares"] : []),
    ...(bond?.map(([key]) => key) ?? []),
    ...(etfs?.map(([key]) => key) ?? []),
  ];

  useEffect(() => {
    const initialValues: Record<string, string> = {};
    allKeys.forEach((key) => {
      const val = account?.goals ? account?.goals[key] : undefined;
      initialValues[key] = val !== undefined && val !== null ? String(val) : "";
    });
    setValues(initialValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allKeys.join(","), account?.goals]);

  // --- Обновление значения ---
  const handleChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  // --- Валидация ---
  useEffect(() => {
    if (Object.keys(values).length === 0) return;

    const filledCount = Object.values(values).filter((v) => v !== "").length;
    const allFilled = filledCount === allKeys.length;

    const numericValues = Object.entries(values)
      .filter(([_, v]) => v !== "")
      .map(([key, val]) => ({ key, num: Number(val) }));

    const invalid = numericValues.some(({ num }) => isNaN(num) || num < 0);
    if (invalid) {
      setError("⚠️ Все значения должны быть числами больше или равными нулю");
      return;
    }

    if (allFilled) {
      const total = numericValues.reduce((acc, { num }) => acc + num, 0);
      if (total !== 100) {
        setError(`Сумма должна быть равна 100%. Сейчас: ${total}%`);
        return;
      }
    }

    setError(null);
  }, [values, allKeys.length]);

  // --- Сохранение ---
  const handleSave = () => {
    if (error) {
      console.warn("🚫 Нельзя сохранить: есть ошибки");
      return;
    }

    const total = Object.values(values)
      .map((v) => Number(v))
      .reduce((a, b) => a + b, 0);

    if (total !== 100) {
      setError(`Сумма должна быть равна 100%. Сейчас: ${total}%`);
      return;
    }

    if (!currentUser?.id) {
      console.warn("❌ Нет userId — невозможно сохранить цели");
      return;
    }

    const goalsData: Record<string, number> = {};
    for (const [key, val] of Object.entries(values)) {
      goalsData[key] = Number(val);
    }

    dispatch(saveGoalsRequest({ accountId: currentUser.id, goals: goalsData }));
    console.log("✅ Отправлено в Redux и Firebase:", goalsData);
    setOpen(false);
  };

  // --- Отрисовка одного поля ---
  const renderItem = (key: string, name: string) => (
    <div className={css.goals__form_item} key={key}>
      <span>{name}</span>
      <Input
        inputAttributes={{
          placeholder: "Введите значение...",
          value: values[key] ?? "",
          onChange: (e) => handleChange(key, e.target.value),
          type: "number",
        }}
      />
    </div>
  );

  return (
    <div className={cn(css.goals, { _isOpen: open })}>
      <div className={css.goals__main} onClick={() => setOpen(true)}>
        Цели
      </div>

      <div className={css.goals__body}>
        <div className={css.goals__form}>
          {shares && renderItem("shares", "Акции")}
          {bond?.map(([key, item]) => renderItem(key, item.name))}
          {etfs?.map(([key, item]) => renderItem(key, item.name))}

          {error && (
            <div
              style={{
                color: "var(--danger, red)",
                marginTop: 8,
                fontSize: 14,
              }}
            >
              {error}
            </div>
          )}
        </div>

        <div className={css.goals__actions}>
          <Button
            text="Отменить"
            buttonAttributes={{ onClick: () => setOpen(false) }}
          />
          <Button text="Сохранить" buttonAttributes={{ onClick: handleSave }} />
        </div>
      </div>
    </div>
  );
};

export default Goals;
