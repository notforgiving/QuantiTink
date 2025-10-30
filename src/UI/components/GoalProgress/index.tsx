import React from "react";
import cn from "classnames";

import css from "./styles.module.scss";

type GoalProgressProps = {
  size?: number; // сколько закрашенных
  total?: number; // общее количество (по умолчанию 10)
  loading?: boolean;
};

const GoalProgress = ({
  size = 0,
  total = 10,
  loading = false,
}: GoalProgressProps) => {
  return (
    <div
      className={cn(css.goal__progress, {
        _isMore: size === 10,
        _isLow: size <= 5 && size !== 0,
        _isLoading: loading,
      })}
    >
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} className={cn({ [css.active]: i < size })}></span>
      ))}
    </div>
  );
};

export default GoalProgress;
