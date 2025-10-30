import React, {
  ChangeEvent,
  FC,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchCalendarRequest } from "api/features/calendar/calendarSlice";
import cn from "classnames";
import BackHeader from "UI/components/BackHeader";
import FuturePayoutsCard from "UI/components/FuturePayoutsCard";
import Input from "UI/components/Input";
import LineBlock from "UI/components/LineBlock";

import { formatMoney } from "utils/formatMoneyAmount";

import { TCalendarEventUi, useCalendarUI } from "./hooks/useCalendar";

import css from "./styles.module.scss";

// ---------- Фильтры ----------
const filterByTab = (
  event: TCalendarEventUi,
  tab: "ALL" | "DIV" | "OA" | "OM"
) => {
  switch (tab) {
    case "DIV":
      return event.eventType === "dividend";
    case "OA":
      return (
        event.eventType === "coupon" &&
        event.raw.eventType === "EVENT_TYPE_MTY" &&
        event.raw.operationType === "OA"
      );
    case "OM":
      return (
        event.eventType === "coupon" &&
        event.raw.eventType === "EVENT_TYPE_MTY" &&
        event.raw.operationType === "OM"
      );
    default:
      return true;
  }
};

const filterBySearch = (event: any, query: string) => {
  const q = query.toLowerCase();
  if (!q.trim()) return true;

  const nameMatch = event.name.toLowerCase().includes(q);
  const matchWords = (words: string[]) => words.some((w) => q.includes(w));

  const isDividendQuery = matchWords(["дивиденд", "дивиденды"]);
  const isCouponQuery = matchWords(["купон", "купоны"]);
  const isAmortizationQuery = matchWords(["амортизация"]);
  const isRedemptionQuery = matchWords(["погашение"]);

  const typeMatch =
    (isDividendQuery && event.eventType === "dividend") ||
    (isCouponQuery &&
      event.eventType === "coupon" &&
      event.raw.eventType === "EVENT_TYPE_CPN") ||
    (isAmortizationQuery && event.raw.operationType === "OA") ||
    (isRedemptionQuery && event.raw.operationType === "OM");

  return nameMatch || typeMatch;
};

// ---------- Основной компонент ----------
const CalendarPage: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [searchQuery, setSearchQuery] = useState("");
  const [currentTab, setCurrentTab] = useState<"ALL" | "DIV" | "OA" | "OM">(
    "ALL"
  );

  const { result } = useCalendarUI(id || "0");
  
  useEffect(() => {
    dispatch(fetchCalendarRequest({ accountId: id || "0" }));
  }, [dispatch, id]);

  const handleSearch = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value),
    []
  );

  const tabs = [
    { key: "DIV", label: "Дивиденды" },
    { key: "OA", label: "Амортизация" },
    { key: "OM", label: "Погашение" },
  ] as const;

  const filteredResult = useMemo(() => {
    if (!result.length) return [];
    return result
      .map((group) =>
        group.filter(
          (event) =>
            filterByTab(event, currentTab) && filterBySearch(event, searchQuery)
        )
      )
      .filter((group) => group.length > 0);
  }, [result, searchQuery, currentTab]);

  return (
    <div>
      <BackHeader
        title="Календарь выплат"
        backCallback={() => navigate(`/${id}`)}
      />

      <div className={css.calendar}>
        <div className={css.calendar__actions}>
          <div className={css.calendar__tabs}>
            {tabs.map((tab) => (
              <div
                key={tab.key}
                className={cn(css.calendar__tabs_item, {
                  _isActive: currentTab === tab.key,
                })}
                onClick={() =>
                  setCurrentTab(
                    currentTab === tab.key
                      ? "ALL"
                      : (tab.key as typeof currentTab)
                  )
                }
              >
                {tab.label}
              </div>
            ))}
          </div>
          <Input
            label=""
            inputAttributes={{
              placeholder: "Поиск...",
              value: searchQuery,
              onChange: handleSearch,
            }}
          />
        </div>
        <div className={css.chart}>
          <FuturePayoutsCard eventData={result} />
        </div>
        <div className={css.calendar__grid}>
          {filteredResult.length ? (
            filteredResult.map((group) => {
              const total = formatMoney(
                group.reduce((acc, el) => acc + el.moneyAmount.value, 0)
              );
              const groupDate = group[0].textCorrectDate;

              return (
                <div
                  className={css.calendar__group}
                  key={`${groupDate}-${total.value}`}
                >
                  <div className={css.calendar__group_info}>
                    <div className={css.calendar__group_date}>{groupDate}</div>
                    <div className={css.calendar__group_total}>
                      <span>Итого:</span>
                      <strong>{total.formatted}</strong>
                    </div>
                  </div>

                  {group.map((event, i) => (
                    <LineBlock
                      key={`${event.raw.eventNumber}-${event.name}-${i}`}
                      greenLine={
                        event.eventType !== "dividend" ||
                        (event.raw.eventType === "EVENT_TYPE_MTY" &&
                          event.raw.operationType === "OM")
                      }
                    >
                      <div className={css.calendar__payout_type}>
                        {event.eventType === "dividend" && "Дивиденды"}
                        {event.eventType === "coupon" &&
                          event.raw.eventType === "EVENT_TYPE_CPN" &&
                          !["OA", "OM"].includes(event.raw.operationType) &&
                          "Купон"}
                        {event.eventType === "coupon" &&
                          event.raw.eventType === "EVENT_TYPE_MTY" &&
                          event.raw.operationType === "OA" &&
                          "Амортизация"}
                        {event.eventType === "coupon" &&
                          event.raw.eventType === "EVENT_TYPE_MTY" &&
                          event.raw.operationType === "OM" &&
                          "Погашение"}
                      </div>

                      <div className={css.calendar__payout}>
                        <div className={css.calendar__payout_name}>
                          {event.name}
                        </div>
                        <div className={css.calendar__payout_value}>
                          {event.moneyAmount.formatted}
                        </div>
                      </div>
                    </LineBlock>
                  ))}
                </div>
              );
            })
          ) : (
            <div className={css.calendar__grid_empty}>Здесь пока что пусто</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
