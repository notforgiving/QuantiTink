export const ETFS = 'etfs';
export const GET_ETFS_LIST = `${ETFS}/getEtfsListAction`;
export type TFETFS = typeof ETFS;

export type TEtfsInstrumentObject = {
    accountId: string,
    instrument: TEtfInstrument[]
    dateApi: string;
}

export type TEtfInstrument = {
    figi: string;
    isin: string;
    lot: number;
    ticker: string;
    name: string;
}