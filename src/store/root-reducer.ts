import accountsSlice, { TFAccountsState } from "./slices/accoutns.slice";
import allBondsSlice, { TFAllBondsState } from "./slices/allBonds.slice";
import bondsSlice, { TFBondsState } from "./slices/bonds.slice";
import currencySlice, { TFCurrencyState } from "./slices/currency.slice";
import etfsSlice, { TFEtfsState } from "./slices/etfs.slice";
import eventsSlice, { TFEventsState } from "./slices/events.slice";
import generalSlice, { TFGeneralState } from "./slices/general.slice";
import infoSlice, { TFInfoState } from "./slices/info.slice";
import operationsSlice, { TFOperationsState } from "./slices/operations.slice";
import portfolioSlice, { TFPortfolioState } from "./slices/portfolio.slice";
import sharesSlice, { TFSharesState } from "./slices/share.slice";
import tokenSlice, { TFTokenState } from "./slices/token.slice";
import userSlice, { TFUserState } from "./slices/user.slice";

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
  user: TFUserState,
  token: TFTokenState,
  all: TFAllBondsState,
};

const rootReducers = {
  user: userSlice,
  token: tokenSlice,
  info: infoSlice,
  accounts: accountsSlice,
  portfolios: portfolioSlice,
  operations: operationsSlice,
  general: generalSlice,
  events: eventsSlice,
  bonds: bondsSlice,
  etfs: etfsSlice,
  shares: sharesSlice,
  currency: currencySlice,
  all: allBondsSlice,
};

export default rootReducers;
