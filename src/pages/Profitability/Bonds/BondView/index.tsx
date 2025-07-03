import React, { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBondView } from "./hooks/useBondView";
import Button from "UI/components/Button";
import maincss from "../../styles.module.scss";
import Input from "UI/components/Input";
import cn from "classnames";
import { useProfitability } from "pages/Profitability/hook/useProfitability";
import moment from "moment";
import { getDeclensionWordMonth } from "utils";

const BondView: FC = () => {
  const { id: accountId, currency, figi } = useParams();
  const navigate = useNavigate();
  const {
    withTax,
    setWithTax,
    setCurrentSort,
    currentSort,
    positions,
    operations,
  } = useProfitability({ accountId: accountId || "0", customWithTax: false });

  const { name, result } = useBondView({
    figi: figi || "0",
    withTax,
    positions,
    operations,
    currency: currency || "rub",
  });

  return (
    <>
      <div className={maincss.header_actions}>
        <Button
          text="Назад"
          buttonAttributes={{
            type: "button",
            onClick: () => navigate(`/account/${accountId}/bonds/${currency}`),
          }}
        />
      </div>
      <div className={maincss.shares}>
        <div className={maincss.shares_title}>{name}</div>
        <div className={maincss.shares_actions}>
          <Input
            label="Рассчитать с учетом налога"
            inputAttributes={{
              type: "checkbox",
              checked: withTax,
              onClick: () => setWithTax(!withTax),
            }}
          />
        </div>
        <div className={maincss.shares_header}>
          <div className={cn(maincss.shares_item_row, "_isHeader")}>
            <div
              className={maincss.number}
              onClick={() =>
                setCurrentSort({
                  key: "NUMBER",
                  dir: currentSort.dir === "ASC" ? "DESC" : "ASC",
                })
              }
            >
              №
            </div>
            <div className={maincss.name}></div>
            <div
              className={maincss.date}
              onClick={() =>
                setCurrentSort({
                  key: "DATE",
                  dir: currentSort.dir === "ASC" ? "DESC" : "ASC",
                })
              }
            >
              Дата покупки
            </div>
            <div className={maincss.quantity}>Количество</div>
            <div className={maincss.priceTotal}>Сумма покупки</div>
            <div className={maincss.priceActiality}>Получено купонов</div>
            <div
              className={maincss.profitabilityNow}
              onClick={() =>
                setCurrentSort({
                  key: "PROFITABILITY",
                  dir: currentSort.dir === "ASC" ? "DESC" : "ASC",
                })
              }
            >
              Доходность этой операции
            </div>
            <div className={maincss.ownershipPeriod}>Срок владения активом</div>
          </div>
        </div>
        <div className={maincss.shares_list}>
          {!!result.length &&
            result.map((operation) => (
              <div
                className={cn(maincss.shares_item, {
                  _isProfitablePurchase: operation.profitabilityNow.percent > 0,
                  _isUnprofitablePurchase:
                    operation.profitabilityNow.percent <= 0,
                })}
              >
                <div className={cn(maincss.shares_item_row, "_isBody")}>
                  <div className={maincss.number}>{operation.number}</div>
                  <div className={maincss.name}></div>
                  <div className={maincss.date}>
                    {moment(operation.date).format("DD.MM.YYYY")}
                  </div>
                  <div className={maincss.quantity}>{operation.quantity}</div>
                  <div className={maincss.priceTotal}>
                    <strong>{operation.priceTotal.value.formatt}</strong> /{" "}
                    <span>({operation.priceTotal.oneLot.formatt})</span>
                  </div>
                  <div className={maincss.priceActiality}>
                    {operation.profitabilityNow.money.formatt}
                  </div>
                  <div className={maincss.profitabilityNow}>
                    {operation.profitabilityNow.percent}%
                  </div>
                  <div className={maincss.ownershipPeriod}>
                    <strong>
                      {(operation.ownershipPeriod / 12).toFixed(2)} года{" "}
                    </strong>
                    <span>
                      {operation.ownershipPeriod}{" "}
                      {getDeclensionWordMonth(operation.ownershipPeriod)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default BondView;
