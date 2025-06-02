const MAINPARTURL = 'https://invest-public-api.tinkoff.ru/rest/tinkoff.public.invest.api.contract.v1.'

export const GetAccountsAPI = MAINPARTURL + "UsersService/GetAccounts";
export const GetAccountsAPILimit = 100;

export const GetInfoAPI = MAINPARTURL + "UsersService/GetInfo";
export const GetInfoAPILimit = 100;

export const GetPortfolioAPI = MAINPARTURL + "OperationsService/GetPortfolio";
export const GetPortfolioAPILimit = 200;

export const GetOperationsAPI = MAINPARTURL + "OperationsService/GetOperations";
export const GetOperationsAPILimit = 200;

export const BondByAPI = MAINPARTURL + "InstrumentsService/BondBy";
export const BondByAPILimit = 200;

export const ShareByAPI = MAINPARTURL + "InstrumentsService/ShareBy";
export const ShareByAPILimit = 200;

export const EtfByAPI = MAINPARTURL + "InstrumentsService/EtfBy";
export const EtfByAPILimit = 200;

export const GetBondEventsAPI = MAINPARTURL + "InstrumentsService/GetBondEvents";
export const GetBondEventsAPILimit = 200;

export const GetDividendsAPI = MAINPARTURL + "InstrumentsService/GetDividends";
export const GetDividendsAPILimit = 200;