import React, { FC, useRef, useState } from "react";
import cn from "classnames";
import { TIssuerGroup } from "Pages/BondsPage/hooks/useBonds";
import { TBrand } from "types/common";

import css from "../../styles.module.scss";

interface IIssuerProps {
  data: TIssuerGroup;
  logoName: TBrand["logoName"];
}

const Issuer: FC<IIssuerProps> = ({
  data: { name, positions, percent },
  logoName,
}) => {
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  return (
    <div
      className={cn(css.bonds__item, {
        _isOpen: open,
      })}
    >
      <div className={css.bonds__item_header} onClick={() => setOpen(!open)}>
        <div
          className={css.bonds__item_img}
          style={{
            backgroundImage: `url(https://invest-brands.cdn-tinkoff.ru/${logoName.replace(
              ".png",
              ""
            )}x160.png)`,
          }}
        ></div>
        <div className={css.bonds__item_name}>{name}</div>
        <div className={css.bonds__item_precent}>{percent}%</div>
      </div>
      <div
        className={css.bonds__item_list}
        ref={contentRef}
        style={{
          maxHeight: open ? `${contentRef.current?.scrollHeight}px` : "0px",
        }}
      >
        {positions &&
          positions.map((item) => (
            <div className={css.bonds__list_item} key={item.figi}>
              <strong>{item.name}</strong>
              <span>{item.quantity} шт</span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Issuer;
