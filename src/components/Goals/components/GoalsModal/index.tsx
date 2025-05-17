import React, { FC } from "react";
import css from "../../styles.module.scss";
import cn from "classnames";

interface IGoalsModalProps {
  openPanel: boolean;
  setOpenPanel: React.Dispatch<React.SetStateAction<boolean>>;
}

const GoalsModal: FC<IGoalsModalProps> = ({ openPanel, setOpenPanel }) => {
  return (
    <div
      className={cn(css.goals_modal, {
        _isOpen: openPanel,
      })}
    >
      <div onClick={() => setOpenPanel(false)}>Закрыть</div>
    </div>
  );
};

export default GoalsModal;
