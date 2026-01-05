import React, { FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchAssetRequest } from "api/features/accounts/accountsSlice";
import BackHeader from "UI/components/BackHeader";
import Tab from "UI/components/Tab";

import Issuer from "./components/Issuer";
import RiskProfile from "./components/RiskProfile";
import { useBonds } from "./hooks/useBonds";

import css from "./styles.module.scss";

const BondsPageMakeup: FC = () => {
  const { id, currency } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [tab, setTab] = useState<"BASE" | "RISK">("BASE");

  useEffect(() => {
    dispatch(
      fetchAssetRequest({ accountId: id || "0", currency: currency || "rub" })
    );
  }, [currency, dispatch, id]);

  const { issuer, riskStat } = useBonds(id || "0", currency || "rub");

  return (
    <div>
      <BackHeader
        title={
          currency === "rub" ? "Российские облигации" : "Валютные облигации"
        }
        backCallback={() => navigate(-1)}
      />
      <div className={css.bonds__tabs}>
        <Tab active={tab === "BASE"} onClick={() => setTab("BASE")}>
          Доли в портфеле
        </Tab>
        <Tab active={tab === "RISK"} onClick={() => setTab("RISK")}>
          По уровню риска
        </Tab>
      </div>
      <div className={css.bonds}>
        {tab === "BASE" ? (
          <>
            {issuer &&
              issuer.map((item) => (
                <Issuer
                  key={item.name}
                  data={item}
                  logoName={item.brand.logoName}
                />
              ))}
          </>
        ) : (
          <>
            {riskStat.map((item) => (
              <RiskProfile key={item.label} data={item} />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default BondsPageMakeup;
