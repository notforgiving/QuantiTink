import React, { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BackHeader from "UI/components/BackHeader";

import { useShares } from "./hook/useShares";

import css from "./styles.module.scss";

const SharesPage: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { shares } = useShares(id ?? "");

  return (
    <div>
      <BackHeader title={"Акции"} backCallback={() => navigate(-1)} />
      <div className={css.shares}>
        {shares &&
          shares.map((el, index) => (
            <div
              className={css.shares__item}
              key={el.figi}
              onClick={() => navigate(`/${id}/shares/${el.figi}`)}
            >
              <div
                className={css.shares__item_icon}
                style={{
                  backgroundColor: `${el.brand.logoBaseColor}`,
                  backgroundImage: `url(https://invest-brands.cdn-tinkoff.ru/${el.brand.logoName.replace(
                    ".png",
                    ""
                  )}x160.png)`,
                }}
              />
              <div className={css.shares__item_name}>{el.name}</div>
              <div className={css.shares__item_precent}>{el.percent} %</div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default SharesPage;
