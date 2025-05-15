import accountsSlice,{ TFAccountsState } from "./slices/accoutns.slice";
import currencySlice, { TFCurrencyState } from "./slices/currency.slice";
import eventsSlice, { TFEventsState } from "./slices/events.slice";
import generalSlice, { TFGeneralState } from "./slices/general.slice";
import operationsSlice, { TFOperationsState } from "./slices/operations.slice";
import portfolioSlice, { TFPortfolioState } from "./slices/portfolio.slice";

export type StateType = {
  accounts: TFAccountsState;
  portfolios: TFPortfolioState;
  operations: TFOperationsState;
  currency: TFCurrencyState;
  general: TFGeneralState,
  events: TFEventsState,
};

const rootReducers = {
  accounts: accountsSlice,
  portfolios: portfolioSlice,
  operations: operationsSlice,
  currency: currencySlice,
  general: generalSlice,
  events: eventsSlice,
};

export default rootReducers;
