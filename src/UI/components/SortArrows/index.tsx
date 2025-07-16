import React, { FC } from "react";
import css from "./styles.module.scss";
import { ReactComponent as ArrowDownSvg } from "assets/arrowDown.svg";
import cn from "classnames";

interface ISortArrowsProps {
  state: "ask" | "desk" | null;
}

const SortArrows: FC<ISortArrowsProps> = ({ state }) => {
  console.log(state,'SortArrows');
  
  return (
    <div
      className={cn(css.sort, {
        // По возрастанию
        _isAsk: state === "ask",
        // По убыванию
        _isDesk: state === "desk",
      })}
    >
      <ArrowDownSvg className={css.sort__top} />
      <ArrowDownSvg className={css.sort__bottom} />
    </div>
  );
};

export default SortArrows;
