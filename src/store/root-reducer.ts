import accountsSlice, { TFAccountsState } from "./slices/accoutns.slice";
import bondsSlice, { TFBondsState } from "./slices/bonds.slice";
import currencySlice, { TFCurrencyState } from "./slices/currency.slice";
import etfsSlice, { TFEtfsState } from "./slices/etfs.slice";
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
  bonds: TFBondsState,
  etfs: TFEtfsState,
};

const rootReducers = {
  accounts: accountsSlice,
  portfolios: portfolioSlice,
  operations: operationsSlice,
  currency: currencySlice,
  general: generalSlice,
  events: eventsSlice,
  bonds: bondsSlice,
  etfs: etfsSlice,
};

export default rootReducers;
