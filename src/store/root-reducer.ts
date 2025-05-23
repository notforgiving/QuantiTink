import accountsSlice, { TFAccountsState } from "./slices/accoutns.slice";
import bondsSlice, { TFBondsState } from "./slices/bonds.slice";
import currencySlice, { TFCurrencyState } from "./slices/currency.slice";
import etfsSlice, { TFEtfsState } from "./slices/etfs.slice";
import eventsSlice, { TFEventsState } from "./slices/events.slice";
import generalSlice, { TFGeneralState } from "./slices/general.slice";
import infoSlice, { TFInfoState } from "./slices/info.slice";
import operationsSlice, { TFOperationsState } from "./slices/operations.slice";
import portfolioSlice, { TFPortfolioState } from "./slices/portfolio.slice";
import sharesSlice, { TFSharesState } from "./slices/share.slice";

export type StateType = {
  accounts: TFAccountsState;
  portfolios: TFPortfolioState;
  operations: TFOperationsState;
  currency: TFCurrencyState;
  general: TFGeneralState,
  events: TFEventsState,
  bonds: TFBondsState,
  etfs: TFEtfsState,
  shares: TFSharesState,
  info: TFInfoState,
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
  shares: sharesSlice,
  info: infoSlice,
};

export default rootReducers;
