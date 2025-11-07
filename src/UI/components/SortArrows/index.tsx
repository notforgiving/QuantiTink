import React, { FC, ReactNode, useCallback } from "react";
import { ReactComponent as ArrowDownSvg } from "assets/arrowDown.svg";
import cn from "classnames";

import css from "./styles.module.scss";

export type SortOrder = "asc" | "desc" | null;

interface SortArrowProps {
  label?: ReactNode;
  order: SortOrder;
  onChange?: (newOrder: SortOrder) => void;
  size?: number;
}

const orderCycle: SortOrder[] = [null, "asc", "desc"];

const SortArrows: FC<SortArrowProps> = ({ label, order, onChange }) => {
  const handleClick = useCallback(() => {
    const currentIndex = orderCycle.indexOf(order);
    const nextOrder = orderCycle[(currentIndex + 1) % orderCycle.length];
    onChange?.(nextOrder);
  }, [order, onChange]);

  return (
    <div
      className={cn(css.sort, {
        _isAsc: order === "asc",
        _isDesc: order === "desc",
      })}
      onClick={handleClick}
    >
      {label && <div className={css.sort__label}>{label}</div>}

      <div className={css.sortArrow}>
        <ArrowDownSvg color={order === "asc" ? "#000" : "#ccc"} />
        <ArrowDownSvg color={order === "desc" ? "#000" : "#ccc"} />
      </div>
    </div>
  );
};

export default SortArrows;
