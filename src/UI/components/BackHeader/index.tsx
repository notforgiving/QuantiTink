import React, { FC } from "react";
import { ReactComponent as ReturnSvg } from "assets/return-up-back.svg";

import css from "./styles.module.scss";

interface IBackHeaderProps {
  title?: string;
  backCallback: () => void;
}

const BackHeader: FC<IBackHeaderProps> = ({ title, backCallback }) => {
  return (
    <div className={css.back}>
      <div className={css.back__inner}>
        <div className={css.back__body}>
          <div className={css.back__icon} onClick={backCallback}>
            <ReturnSvg />
            <span>Назад</span>
          </div>
          {title && <div className={css.back__title}>{title}</div>}
        </div>
      </div>
    </div>
  );
};

export default BackHeader;
