import React, { FC, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchAssetRequest } from "api/features/accounts/accountsSlice";
import BackHeader from "UI/components/BackHeader";

import Issuer from "./components/Issuer";
import { useBonds } from "./hooks/useBonds";

import css from "./styles.module.scss";

const BondsPageMakeup: FC = () => {
  const { id, currency } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAssetRequest({ accountId: id || "0", currency: currency || 'rub' }));
  }, [currency, dispatch, id]);

  const { issuer } = useBonds(id || "0", currency || "rub");

  return (
    <div>
      <BackHeader
        title={
          currency === "rub" ? "Российские облигации" : "Валютные облигации"
        }
    backCallback={() => navigate(-1)}
      />
      <div className={css.bonds}>
        {issuer &&
          issuer.map((item) => (
            <Issuer
              key={item.name}
              data={item}
              logoName={item.brand.logoName}
            />
          ))}
      </div>
    </div>
  );
};

export default BondsPageMakeup;
