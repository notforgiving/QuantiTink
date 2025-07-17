import React, { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useShares } from "./hook/useShares";
import cn from "classnames";
import Input from "UI/components/Input";
import css from "../styles.module.scss";
import Line from "../components/Line";
import { useProfitability } from "../hook/useProfitability";
import BackHeader from "components/BackHeader";
import SortArrows from "UI/components/SortArrows";

const Shares: FC = () => {
  let { id: accountId } = useParams();
  const navigate = useNavigate();
  const {
    search,
    setSearch,
    withTax,
    setWithTax,
    comissionToggle,
    setComissionToggle,
    setCurrentSort,
    currentSort,
    tariff,
    positions,
    operations,
    sortFunction,
  } = useProfitability({ accountId: accountId || "0" });
  const { result } = useShares({
    withTax,
    comissionToggle,
    currentSort,
    tariff,
    positions,
    operations,
  });

  return (
    <div>
      <BackHeader
        title="Акции"
        backCallback={() => navigate(`/account/${accountId}`)}
      />
      <div className={cn(css.income, "isShares")}>
        <div className={css.income_actions}>
          <Input
            label="Рассчитать с учетом налога"
            inputAttributes={{
              type: "checkbox",
              checked: withTax,
              onClick: () => setWithTax(!withTax),
            }}
          />
          <Input
            label="Рассчитать с учетом комиссии"
            inputAttributes={{
              type: "checkbox",
              checked: comissionToggle,
              onClick: () => setComissionToggle(!comissionToggle),
            }}
          />
          <Input
            inputAttributes={{
              type: "text",
              placeholder: "Искать...",
              value: search || "",
              onChange: (e) => setSearch(e.target.value),
            }}
          />
        </div>
                <div className={css.income__sort}>
          <div
            className={css.income__sort_item}
            onClick={() =>
              setCurrentSort({
                key: "NUMBER",
                dir: "DESC",
              })
            }
          >
            <span>По умолчанию</span>
            <SortArrows state={null} />
          </div>
          <div
            className={css.income__sort_item}
            onClick={() =>
              setCurrentSort({
                key: "DATE",
                dir: currentSort.dir === "ASC" ? "DESC" : "ASC",
              })
            }
          >
            <span>Дата</span>
            <SortArrows state={currentSort.key === 'DATE'  ? currentSort.dir : null} />
          </div>
          <div
            className={css.income__sort_item}
            onClick={() =>
              setCurrentSort({
                key: "PROFITABILITY",
                dir: currentSort.dir === "ASC" ? "DESC" : "ASC",
              })
            }
          >
            <span>Доходность</span>
            <SortArrows state={currentSort.key === 'PROFITABILITY'  ? currentSort.dir : null} />
          </div>
        </div>
        <div className={css.income_list}>
          {!!result.length &&
            result
              .filter((el) =>
                el.name.toLowerCase().includes(search.toLowerCase())
              )
              .sort(sortFunction)
              .map((operation) => (
                <Line operation={operation} key={operation.date} name/>
              ))}
        </div>
      </div>
    </div>
  );
};

export default Shares;
