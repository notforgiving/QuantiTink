import React from "react";
import cn from "classnames";

import css from "./styles.module.scss";

type GoalProgressProps = {
  size: number; // сколько закрашенных
  total?: number; // общее количество (по умолчанию 10)
};

const GoalProgress = ({ size, total = 10 }: GoalProgressProps) => {
  return (
    <div
      className={cn(css.goal__progress, {
        _isMore: size === 10,
        _isLow: size <= 5,
      })}
    >
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} className={cn({ [css.active]: i < size })}></span>
      ))}
    </div>
  );
};

export default GoalProgress;
