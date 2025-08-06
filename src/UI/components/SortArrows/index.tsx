import React, { FC } from "react";
import { ReactComponent as ArrowDownSvg } from "assets/arrowDown.svg";
import cn from "classnames";

import css from "./styles.module.scss";

interface ISortArrowsProps {
  state: "ASC" | "DESC" | null;
}

const SortArrows: FC<ISortArrowsProps> = ({ state }) => { 
  return (
    <div
      className={cn(css.sort, {
        // По возрастанию
        _isAsk: state === "ASC",
        // По убыванию
        _isDesk: state === "DESC",
      })}
    >
      <ArrowDownSvg className={css.sort__top} />
      <ArrowDownSvg className={css.sort__bottom} />
    </div>
  );
};

export default SortArrows;
