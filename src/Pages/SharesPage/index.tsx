import React, { FC, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BackHeader from "UI/components/BackHeader";
import Tab from "UI/components/Tab";

import Sector from "./components/Sector";
import { useShares } from "./hook/useShares";

import css from "./styles.module.scss";

const SharesPage: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { shares, sectors } = useShares(id ?? "");
  const [tab, setTab] = useState<"BASE" | "SECTOR">("BASE");
  const [openedSector, setOpenedSector] = useState<string | null>(null);

  const handleSectorClick = (label: string | null) => {
    setOpenedSector((prev) => (prev === label ? null : label));
  };

  return (
    <div>
      <BackHeader title={"Акции"} backCallback={() => navigate(-1)} />
      <div className={css.shares__tabs}>
        <Tab active={tab === "BASE"} onClick={() => setTab("BASE")}>
          Доли в портфеле
        </Tab>
        <Tab active={tab === "SECTOR"} onClick={() => setTab("SECTOR")}>
          По сектору
        </Tab>
      </div>
      <div className={css.shares}>
        {tab === "BASE" && !shares?.length && <div>В портфеле нет акций</div>}
        {tab === "BASE" &&
          shares &&
          shares.map((el, index) => {
            if (!el.brand.logoBaseColor || !el.brand.logoName) return null;

            return (
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
            );
          })}
        {tab === "SECTOR" && (
          <>
            {sectors.length === 0 && <div>Нет акций по секторам</div>}
            {sectors.map((sector) => (
              <Sector
                key={sector.sectorKey}
                positions={sector.positions}
                sectorname={sector.sectorname}
                percent={sector.percent}
                onClick={() =>
                  handleSectorClick(
                    openedSector === sector.sectorKey ? null : sector.sectorKey
                  )
                }
                colorKey={sector.sectorKey}
                opened={openedSector === sector.sectorKey}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default SharesPage;
