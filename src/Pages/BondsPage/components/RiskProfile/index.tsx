import React, { FC } from "react";
import { TRiskLevelStat } from "Pages/BondsPage/hooks/useBonds";

import css from "../../styles.module.scss";

interface IRiskProfileProps {
  data: TRiskLevelStat;
}

const RiskProfile: FC<IRiskProfileProps> = ({ data }) => {
  return (
    <div className={css.bonds__risk}>
      <div className={css.bonds__item_header}>
        <div className={css.bonds__item_name}><strong>{data.label}</strong></div>
        <div className={css.bonds__item_precent}>{data.percent}%</div>
      </div>
    </div>
  );
};

export default RiskProfile;
