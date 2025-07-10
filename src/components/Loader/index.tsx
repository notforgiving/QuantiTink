import React, { FC } from "react";
import css from "./styles.module.scss";

const Loader: FC = () => {
  return <span className={css.loader}></span>;
};

export default Loader;
