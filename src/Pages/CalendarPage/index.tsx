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
import moment from "moment";
import BackHeader from "UI/components/BackHeader";
import FuturePayoutsCard from "UI/components/FuturePayoutsCard";
import Input from "UI/components/Input";
import Tab from "UI/components/Tab";

import { formatMoney } from "utils/formatMoneyAmount";

import Grid from "./components/Grid";
import List from "./components/List";
import { TCalendarEventUi, useCalendarUI } from "./hooks/useCalendar";

import css from "./styles.module.scss";

export type TTabKey = "ALL" | "DIV" | "OA" | "OM" | "NOT_CALL";

// ---------- Фильтры ----------
export const filterByTab = (event: TCalendarEventUi, tab: TTabKey) => {
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

    case "NOT_CALL":
      return event.raw.eventType !== "EVENT_TYPE_CALL";
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
  const [currentTab, setCurrentTab] = useState<TTabKey>("NOT_CALL");
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null); // 👈 добавили

  const { result } = useCalendarUI(id || "0");

  const [viewMode, setViewMode] = useState<"LIST" | "CALENDAR">("LIST");
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
    { key: "NOT_CALL", label: "Без досрочных погашений" },
  ] as const;

  const filteredResult = useMemo(() => {
    if (!result.length) return [];

    // Все события по текущему фильтру (по табу и поиску)
    const filtered = result.map((group) =>
      group.filter(
        (event) =>
          filterByTab(event, currentTab) && filterBySearch(event, searchQuery)
      )
    );

    // Сортируем по дате
    const sorted = filtered
      .map((group) =>
        group.sort(
          (a, b) =>
            moment(a.correctDate, "DD.MM.YYYY").unix() -
            moment(b.correctDate, "DD.MM.YYYY").unix()
        )
      )
      .filter((group) => group.length > 0);

    // Если выбран месяц, оставляем только его для детального списка
    if (selectedMonth) {
      return sorted
        .map((group) =>
          group.filter((event) => {
            const monthKey = moment(event.correctDate, "DD.MM.YYYY").format(
              "MM-YYYY"
            );
            return monthKey === selectedMonth;
          })
        )
        .filter((group) => group.length > 0);
    }

    return sorted;
  }, [result, currentTab, searchQuery, selectedMonth]);

  // Выбираем месяц ближайший по выплатам, если не выбран
  useEffect(() => {
    if (selectedMonth || !result.length) return;

    const today = moment().startOf("day");
    // Получаем все события в один массив
    const flat = result.flat();
    if (!flat.length) return;

    // Находим ближайшую дату >= сегодня, иначе ближайшую вообще
    let candidate = flat
      .map((e) => ({ e, m: moment(e.correctDate, "DD.MM.YYYY") }))
      .filter((x) => x.m.isValid())
      .sort((a, b) => a.m.unix() - b.m.unix());

    let nearest = candidate.find((c) => c.m.isSameOrAfter(today));
    if (!nearest) nearest = candidate[0];
    if (nearest) {
      setSelectedMonth(nearest.m.format("MM-YYYY"));
    }
  }, [result, selectedMonth]);

  const buildDayMap = useMemo(() => {
    // map: 'DD.MM.YYYY' => { total: number, events: TCalendarEventUi[] }
    const map: Record<string, { total: number; events: TCalendarEventUi[] }> =
      {};
    result.flat().forEach((ev) => {
      const key = ev.correctDate; // 'DD.MM.YYYY'
      if (!map[key]) map[key] = { total: 0, events: [] } as any;
      map[key].total += ev.moneyAmount.value;
      map[key].events.push(ev as any);
    });
    return map;
  }, [result]);

  // Определяем минимальный и максимальный месяцы, доступные в данных
  const monthBounds = useMemo(() => {
    const flat = result.flat();
    if (!flat.length) return null;
    const moments = flat
      .map((e) => moment(e.correctDate, "DD.MM.YYYY"))
      .filter((m) => m.isValid());
    if (!moments.length) return null;
    const min = moments
      .reduce((a, b) => (a.isBefore(b) ? a : b))
      .startOf("month");
    const max = moments
      .reduce((a, b) => (a.isAfter(b) ? a : b))
      .startOf("month");
    return { min, max };
  }, [result]);

  const changeMonth = useCallback(
    (diff: number) => {
      if (!selectedMonth) return;
      const m = moment(selectedMonth, "MM-YYYY").add(diff, "months");
      if (monthBounds) {
        if (
          m.isBefore(monthBounds.min, "month") ||
          m.isAfter(monthBounds.max, "month")
        )
          return;
      }
      setSelectedMonth(m.format("MM-YYYY"));
    },
    [selectedMonth, monthBounds]
  );
  const renderCalendar = useCallback(() => {
    if (!selectedMonth) return null;

    const monthMoment = moment(selectedMonth, "MM-YYYY").startOf("month");
    // Начинаем с понедельника недели, в которую попадает первый день месяца
    const start = monthMoment.clone().isoWeekday(1);
    const days: moment.Moment[] = [];
    for (let i = 0; i < 42; i++) days.push(start.clone().add(i, "days"));

    const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

    const today = moment().startOf("day");
    const canPrev =
      !monthBounds || monthMoment.isAfter(monthBounds.min, "month");
    const canNext =
      !monthBounds || monthMoment.isBefore(monthBounds.max, "month");
    return (
      <Grid
        monthMoment={monthMoment}
        weekDays={weekDays}
        changeMonth={changeMonth}
        canPrev={canPrev}
        canNext={canNext}
        days={days}
        buildDayMap={buildDayMap}
        today={today}
      />
    );
  }, [selectedMonth, monthBounds, buildDayMap, changeMonth]);
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
              <Tab
                key={tab.key}
                active={currentTab === tab.key}
                onClick={() =>
                  setCurrentTab(currentTab === tab.key ? "ALL" : tab.key)
                }
              >
                {tab.label}
              </Tab>
            ))}
          </div>
          {viewMode === "LIST" && (
            <Input
              label=""
              inputAttributes={{
                placeholder: "Поиск...",
                value: searchQuery,
                onChange: handleSearch,
              }}
            />
          )}
        </div>
        <div className={css.chart}>
          <FuturePayoutsCard
            eventData={result}
            onMonthSelect={setSelectedMonth}
            selectedMonth={selectedMonth}
            currentTab={currentTab}
          />
        </div>
        <div className={css.calendar__viewToggle}>
          <button
            className={css.calendar__viewToggle_btn}
            onClick={() =>
              setViewMode(viewMode === "LIST" ? "CALENDAR" : "LIST")
            }
          >
            {viewMode === "LIST" ? "Календарь" : "Список"}
          </button>
        </div>
        <div className={css.calendar__grid}>
          {viewMode === "CALENDAR" ? (
            renderCalendar()
          ) : filteredResult.length ? (
            filteredResult.map((group) => {
              const total = formatMoney(
                group.reduce((acc, el) => acc + el.moneyAmount.value, 0)
              );
              const groupDate = group[0].textCorrectDate;
              return (
                <List
                  key={`${groupDate}-${total.value}`}
                  groupDate={groupDate}
                  total={total}
                  group={group}
                />
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
