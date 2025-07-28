import React, { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import css from "../styles.module.scss";
import includeCss from "./styles.module.scss";
import { useBonds } from "./hooks/useBonds";
import BackHeader from "components/BackHeader";
import cn from "classnames";

const Bonds: FC = () => {
  const { id: accountId, currency } = useParams();
  const navigate = useNavigate();
  const { bondsList, repaymentDateList } = useBonds({
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
        {/* <div className={includeCss.repaymentDate}>
          {repaymentDateList.map((item) => (
            <div
              key={item.maturityDate}
              className={cn(
                includeCss.repaymentDate__item,
                `size-${Math.round(item.diffInDays)}`
              )}
            >
              <strong>{item.name}</strong>
              <span>
                ({item.value})шт / {Math.round((item.value / item.totalBonds) * 100)}%
              </span>
            </div>
          ))}
        </div> */}
        <div className={includeCss.bond__list}>
          {bondsList.map((item) => (
            <div
              className={includeCss.bond__item}
              onClick={() =>
                navigate(`/account/${accountId}/bonds/${currency}/${item.figi}`)
              }
              key={item.figi}
            >
              <div
                className={includeCss.bond__item_icon}
                style={{
                  backgroundImage: `url("https://invest-brands.cdn-tinkoff.ru/${item.icon}x160.png")`,
                }}
              ></div>
              <div className={includeCss.bond__item_info}>
                <strong>{item.name}</strong>
                <span>{item.quantity} шт</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Bonds;
