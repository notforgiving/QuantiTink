import { TOKEN_LOCALSTORAGE_NAME } from "types/token.type";
import { GetBondsAPI, GetOrderBookAPI } from "./common";
import { TOrderBook } from "types/calculationBonds.type";

export async function fetchGetAllBondsAPI() {
    const TOKEN = localStorage.getItem(TOKEN_LOCALSTORAGE_NAME);
    const tokenForApi = TOKEN ? JSON.parse(TOKEN) : null;
    const response = await fetch(GetBondsAPI, {
        method: "POST",
        body: JSON.stringify({
            instrumentStatus: 'INSTRUMENT_STATUS_ALL',
            instrumentExchange: 'INSTRUMENT_EXCHANGE_UNSPECIFIED',
        }),
        headers: {
            Authorization: `Bearer ${tokenForApi}`,
            "Content-Type": "application/json",
        },
    }
    );
    const data = await response.json();
    if (data.hasOwnProperty("status") && data.status === 500) {
        throw data.error;
    }
    return data.instruments;
}

export async function fetchAllOrderBookBondsAPI(bonds: string[]) {
    let results: TOrderBook[] = [];
    try {
        return Promise.all(bonds.map(async bond => {
            const result: TOrderBook = await fetchGetOrderBookBondAPI(bond);
            if (result && result.hasOwnProperty('figi')) {
                results.push(result);
            }
        })).then(() => {
            return results;
        });
    } catch (e) {
        throw new Error(`fetchAllOrderBookBondsAPI went wrong`);
    };
};


export async function fetchGetOrderBookBondAPI(figi: string) {
    const TOKEN = localStorage.getItem(TOKEN_LOCALSTORAGE_NAME);
    const tokenForApi = TOKEN ? JSON.parse(TOKEN) : null;
    const response = await fetch(GetOrderBookAPI, {
        method: "POST",
        body: JSON.stringify({
            depth: 10,
            instrumentId: figi,
        }),
        headers: {
            Authorization: `Bearer ${tokenForApi}`,
            "Content-Type": "application/json",
        },
    }
    );
    const data = await response.json();
    if (data && data.hasOwnProperty("message")) {
        return data.message;
    }
    return data;
}