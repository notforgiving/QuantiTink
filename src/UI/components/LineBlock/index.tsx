import React, { FC, ReactNode } from "react";
import cn from "classnames";

import css from "./styles.module.scss";

interface ILineBlockProps {
  greenLine?: boolean;
  children: ReactNode;
  className?: string;
}

const LineBlock: FC<ILineBlockProps> = ({ greenLine, children, className }) => {
  return (
    <div
      className={cn(css.lineBlock, className, {
        _isGreen: greenLine,
      })}
    >
      {children}
    </div>
  );
};

export default LineBlock;
