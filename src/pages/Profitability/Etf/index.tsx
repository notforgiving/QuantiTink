import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "UI/components/Button";
import css from "../styles.module.scss";
import { useEtf } from "./hook/useEtf";
import Input from "UI/components/Input";
import cn from "classnames";
import { useProfitability } from "../hook/useProfitability";
import Line from "../components/Line";

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
  } = useProfitability({ accountId: accountId || "0" });

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
    <>
      <Button
        text="Назад"
        buttonAttributes={{
          type: "button",
          onClick: () => navigate(`/account/${accountId}`),
        }}
      />
      <div className={css.symbols}>
        <div className={css.green}>
          <strong></strong>
          <span>Прибыльная покупка</span>
        </div>
        <div className={css.red}>
          <strong></strong>
          <span>Убыточная покупка</span>
        </div>
        <div className={css.threeYears}>
          <strong></strong>
          <span>Есль льгота ЛДВ</span>
        </div>
      </div>
      <div className={css.shares}>
        <div className={css.shares_title}>{name}</div>
        <div className={css.shares_actions}>
          <Input
            label="Рассчитать с учетом налога"
            inputAttributes={{
              type: "checkbox",
              checked: withTax,
              onClick: () => setWithTax(!withTax),
            }}
          />
          {!tbankEtf && (
            <Input
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
        <div className={css.shares_header}>
          <div className={cn(css.shares_item_row, "_isHeader")}>
            <div
              className={css.number}
              onClick={() =>
                setCurrentSort({
                  key: "NUMBER",
                  dir: currentSort.dir === "ASC" ? "DESC" : "ASC",
                })
              }
            >
              №
            </div>
            <div className={css.name}>Название</div>
            <div
              className={css.date}
              onClick={() =>
                setCurrentSort({
                  key: "DATE",
                  dir: currentSort.dir === "ASC" ? "DESC" : "ASC",
                })
              }
            >
              Дата покупки
            </div>
            <div className={css.quantity}>Количество</div>
            <div className={css.priceTotal}>Сумма покупки</div>
            <div className={css.priceActiality}>Сумма сейчас</div>
            <div
              className={css.profitabilityNow}
              onClick={() =>
                setCurrentSort({
                  key: "PROFITABILITY",
                  dir: currentSort.dir === "ASC" ? "DESC" : "ASC",
                })
              }
            >
              Доходность этой операции
            </div>
            <div className={css.ownershipPeriod}>Срок владения активом</div>
          </div>
        </div>
        <div className={css.shares_list}>
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
    </>
  );
};

export default Etf;
