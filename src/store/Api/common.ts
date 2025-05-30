export const TOKEN = process.env.REACT_APP_T_TOKEN;

const MAINPARTURL = 'https://invest-public-api.tinkoff.ru/rest/tinkoff.public.invest.api.contract.v1.'

export const GetAccountsAPI = MAINPARTURL + "UsersService/GetAccounts";

export const GetInfoAPI = MAINPARTURL + "UsersService/GetInfo";

export const GetPortfolioAPI = MAINPARTURL + "OperationsService/GetPortfolio";

export const GetOperationsAPI = MAINPARTURL + "OperationsService/GetOperations";

export const BondByAPI = MAINPARTURL + "InstrumentsService/BondBy";

export const ShareByAPI = MAINPARTURL + "InstrumentsService/ShareBy";

export const EtfByAPI = MAINPARTURL + "InstrumentsService/EtfBy";

export const GetBondEventsAPI = MAINPARTURL + "InstrumentsService/GetBondEvents";

export const GetDividendsAPI = MAINPARTURL + "InstrumentsService/GetDividends";
