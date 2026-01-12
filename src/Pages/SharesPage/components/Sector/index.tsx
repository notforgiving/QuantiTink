import React, { FC, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import cn from "classnames";

import css from "./styles.module.scss";

interface ISectorProps {
  sectorname: string;
  percent: number;
  positions?: any[];
  opened?: boolean;
  onClick?: () => void;
  colorKey?: string;
}

const Sector: FC<ISectorProps> = ({ sectorname, positions, percent, opened, onClick, colorKey }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement>(null);
  const colorMap: Record<string, string> = {
    materials: "#8D5524", // коричневый, цвет земли и материалов
    energy: "#FFD600", // ярко-жёлтый, ассоциация с энергией, светом
    financial: "#00695C", // насыщенный зелёный, цвет денег
    information_technology: "#1976D2", // синий, технологичный, цифровой
    communication_services: "#00B0FF", // голубой, связь, коммуникации
    consumer_discretionary: "#FF7043", // оранжево-красный, динамичный, покупки
    consumer_staples: "#43A047", // зелёный, базовые товары, натуральность
    health_care: "#E91E63", // розовый, ассоциация с медициной, заботой
    industrials: "#757575", // серый, индустриальный, металл
    utilities: "#90CAF9", // светло-голубой, вода, электричество
    real_estate: "#8D6E63", // тёплый коричневый, цвет домов, земли
    basic_resources: "#BDB76B", // оливковый, природные ресурсы
    telecom: "#7C4DFF", // фиолетовый, связь, технологии
    unknown: "#D3D3D3", // светло-серый, неизвестно
  };
  const color = colorKey && colorMap[colorKey] ? colorMap[colorKey] : "#D3D3D3";
  return (
    <div
      className={cn(css.accordion, {
        _isOpen: opened,
      })}
    >
      <div className={css.accordion_header} onClick={onClick}>
        <div className={css.accordion_color} style={{ backgroundColor: color }}></div>
        <div className={css.accordion_name}>
          <strong>{sectorname}</strong>
        </div>
        <div className={css.accordion_precent}>{percent}%</div>
      </div>
      <div
        className={css.accordion_list}
        ref={contentRef}
        style={{
          maxHeight: opened ? `${contentRef.current?.scrollHeight}px` : "0px",
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
