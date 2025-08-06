import React, { CSSProperties, FC } from "react";
import cn from "classnames";

import css from './styles.module.scss';

interface ILoadProps {
  style?: CSSProperties;
  className?: string;
}

const Load: FC<ILoadProps> = ({ style, className }) => {
  return <div className={cn(css.load, className)} style={{ ...style }}>Загрузка...</div>;
};

export default Load;
