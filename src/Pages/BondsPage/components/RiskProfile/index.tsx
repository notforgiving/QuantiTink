import React, { FC, useEffect, useRef } from "react";
import cn from "classnames";
import { TRiskLevelStat } from "Pages/BondsPage/hooks/useBonds";

import css from "../../styles.module.scss";

interface IBondShort {
  figi: string;
  name: string;
  quantity: number;
}

interface IRiskProfileProps {
  data: TRiskLevelStat;
  opened?: boolean;
  onClick?: () => void;
  bonds: IBondShort[];
}

const RiskProfile: FC<IRiskProfileProps> = ({
  data,
  opened,
  onClick,
  bonds,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!opened && contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [opened]);
  return (
    <div
      className={cn(css.bonds__item, {
        _isOpen: opened,
      })}
    >
      <div
        className={css.bonds__item_header}
        onClick={onClick}
        style={{ cursor: "pointer" }}
      >
        <div className={css.bonds__item_name}>
          <strong>{data.label}</strong>
        </div>
        <div className={css.bonds__item_precent}>{data.percent}%</div>
      </div>
      <div
        className={css.bonds__item_list}
        ref={contentRef}
        style={{
          maxHeight: opened ? `${contentRef.current?.scrollHeight}px` : "0px",
        }}
      >
        {bonds.length > 0 &&
          bonds.map((bond) => (
            <div className={css.bonds__list_item} key={bond.figi}>
              <strong>{bond.name}</strong>
              <span>{bond.quantity} шт</span>
            </div>
          ))}
        {bonds.length === 0 && (
          <div style={{ padding: 8, color: "#888" }}>Нет облигаций</div>
        )}
      </div>
    </div>
  );
};

export default RiskProfile;
