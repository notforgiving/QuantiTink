import React, { FC } from "react";
import cn from "classnames";

import css from "./styles.module.scss";

interface ITabProps {
  active: boolean;
  onClick: () => void;
  children?: React.ReactNode;
}

const Tab: FC<ITabProps> = ({ active = false, onClick, children }) => {
  return (
    <div
      className={cn(css.tab, {
        _isActive: active,
      })}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Tab;
