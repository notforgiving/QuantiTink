import React, { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBondView } from "./hooks/useBondView";
import maincss from "../../styles.module.scss";
import Input from "UI/components/Input";
import cn from "classnames";
import { useProfitability } from "pages/Profitability/hook/useProfitability";
import moment from "moment";
import { formattedMoneySupply, getDeclensionWordMonth } from "utils";
import BackHeader from "components/BackHeader";
import SortArrows from "UI/components/SortArrows";
import { ReactComponent as ArrowSvg } from "assets/arrow-forward.svg";

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
    <div>
      <BackHeader
        title={name}
        backCallback={() => navigate(`/account/${accountId}/bonds/${currency}`)}
      />
      <div className={maincss.income}>
        <div className={maincss.income_actions}>
          <Input
            label="Рассчитать с учетом налога"
            inputAttributes={{
              type: "checkbox",
              checked: withTax,
              onClick: () => setWithTax(!withTax),
            }}
          />
        </div>
        <div className={maincss.income__sort}>
          <div
            className={maincss.income__sort_item}
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
            className={maincss.income__sort_item}
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
            className={maincss.income__sort_item}
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
        <div className={maincss.income_list}>
          {!!result.length &&
            result.map((operation) => (
              <div
                className={cn(maincss.income_item, {
                  _isGreen: operation.profitabilityNow.percent > 0,
                  _isRed: operation.profitabilityNow.percent <= 0,
                  _isOrange: operation.ownershipPeriod / 12 >= 3,
                })}
              >
                <div className={maincss.income_item_time}>
                  <span>{moment(operation.date).format("DD.MM.YYYY")}</span>
                  <span>
                    {operation.ownershipPeriod / 12 < 3 && (
                      <>
                        {operation.ownershipPeriod}{" "}
                        {getDeclensionWordMonth(operation.ownershipPeriod)}
                      </>
                    )}
                    {operation.ownershipPeriod / 12 >= 3 && "Льгота"}
                  </span>
                </div>
                <div className={maincss.income_item_bottom}>
                  <div className={maincss.income_item_prices}>
                    <div
                      className={maincss.income_item_lot}
                      title="Цена покупки"
                    >
                      <span>
                        {
                          formattedMoneySupply(
                            operation.priceTotal.oneLot.value *
                              operation.quantity
                          ).formatt
                        }
                      </span>
                      <ArrowSvg />
                      <span>{operation.priceTotal.value.formatt}</span>
                    </div>
                    <div
                      className={maincss.income_item_value}
                      title="Получено купонов"
                    >
                      <span> {operation.profitabilityNow.money.formatt}</span>
                    </div>
                  </div>
                  <div className={maincss.income_item_percent}>
                    {operation.profitabilityNow.percent}%
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default BondView;
