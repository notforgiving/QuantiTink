import React, { FC, ReactNode } from "react";
import cn from "classnames";

interface IContainerProps {
  children: ReactNode;
  className?: string;
}

const Container: FC<IContainerProps> = ({ children, className }) => (
  <div className={cn("container", className)}>{children}</div>
);
export default Container;
