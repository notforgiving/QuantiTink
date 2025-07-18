import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import css from "../styles.module.scss";
import { useEtf } from "./hook/useEtf";
import Input from "UI/components/Input";
import cn from "classnames";
import { useProfitability } from "../hook/useProfitability";
import Line from "../components/Line";
import BackHeader from "components/BackHeader";
import SortArrows from "UI/components/SortArrows";

const Etf = () => {
  let { id: accountId, ticker } = useParams();

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
  } = useProfitability({ accountId: accountId || "0", customWithTax: false });

  const { name, result, tbankEtf } = useEtf({
    withTax,
    comissionToggle,
    tariff,
    positions,
    ticker: ticker || "",
    operations,
  });

  useEffect(() => {
    if (tbankEtf) {
      setComissionToggle(false);
    }
  }, [setComissionToggle, tbankEtf]);

  const navigate = useNavigate();
  return (
    <div>
      <BackHeader
        title={name}
        backCallback={() => navigate(`/account/${accountId}`)}
      />
      <div className={cn(css.income, "isEtf")}>
        <div className={css.income_actions}>
          <Input
            label="Рассчитать с учетом налога"
            leftLabel
            inputAttributes={{
              type: "checkbox",
              checked: withTax,
              onClick: () => setWithTax(!withTax),
            }}
          />
          {!tbankEtf && (
            <Input
              leftLabel
              label="Рассчитать с учетом комиссии"
              inputAttributes={{
                type: "checkbox",
                checked: comissionToggle,
                onClick: () => setComissionToggle(!comissionToggle),
              }}
            />
          )}
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
            <SortArrows
              state={currentSort.key === "DATE" ? currentSort.dir : null}
            />
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
            <SortArrows
              state={
                currentSort.key === "PROFITABILITY" ? currentSort.dir : null
              }
            />
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
                <Line operation={operation} key={operation.date} />
              ))}
        </div>
      </div>
    </div>
  );
};

export default Etf;
