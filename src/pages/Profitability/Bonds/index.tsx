import React, { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import css from "../styles.module.scss";
import includeCss from "./styles.module.scss";
import { useBonds } from "./hooks/useBonds";
import BackHeader from "components/BackHeader";

const Bonds: FC = () => {
  const { id: accountId, currency } = useParams();
  const navigate = useNavigate();
  const { bondsList } = useBonds({
    accountId: accountId || "0",
    currency: currency || "rub",
  });
  return (
    <div>
      <BackHeader
        title={
          currency === "rub" ? "Российские облигации" : "Валютные облигации"
        }
        backCallback={() => navigate(`/account/${accountId}`)}
      />
      <div className={css.income}>
        <div className={includeCss.bond__list}>
          {bondsList.map((item) => (
            <div
              className={includeCss.bond__item}
              onClick={() =>
                navigate(`/account/${accountId}/bonds/${currency}/${item.figi}`)
              }
            >
              {item.name} {"   "}/ ({item.quantity}) шт
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Bonds;
