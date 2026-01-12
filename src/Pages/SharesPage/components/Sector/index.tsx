import React, { FC, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import cn from "classnames";

import css from "./styles.module.scss";

interface ISectorProps {
  sectorname: string;
  percent: number;
  positions?: any[];
}

const Sector: FC<ISectorProps> = ({ sectorname, positions, percent }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  return (
    <div
      className={cn(css.accordion, {
        _isOpen: open,
      })}
    >
      <div className={css.accordion_header} onClick={() => setOpen(!open)}>
        <div className={css.accordion_name}>
          <strong>{sectorname}</strong>
        </div>
        <div className={css.accordion_precent}>{percent}%</div>
      </div>
      <div
        className={css.accordion_list}
        ref={contentRef}
        style={{
          maxHeight: open ? `${contentRef.current?.scrollHeight}px` : "0px",
        }}
      >
        {positions &&
          positions.map((item) => (
            <div
              className={css.accordion_list_item}
              key={item.name}
              onClick={() => navigate(`/${id}/shares/${item.figi}`)}
            >
              <strong>{item.name}</strong>
              <span>{item.quantity} шт</span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Sector;
