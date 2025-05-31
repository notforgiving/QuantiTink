import { TOKEN_LOCALSTORAGE_NAME } from "types/token.type";
import { TFPosition } from "../../types/portfolio.type";
import { ShareByAPI } from "./common";

export async function fetchAllGetSharesAPI(sharesPositions: TFPosition[]) {
    let results: any[] = [];
    try {
        return Promise.all(sharesPositions.map(async pos => {
            const res = await fetchGetShareByAPI(pos.figi);
            results.push(res);
        })).then(() => {
            return results;
        });
    } catch (e) {
        throw new Error(`fetchAllGetSharesAPI went wrong`);
    };
};


export async function fetchGetShareByAPI(figi: string) {
    const TOKEN = localStorage.getItem(TOKEN_LOCALSTORAGE_NAME);
    const tokenForApi = TOKEN ? JSON.parse(TOKEN) : null;
    const response = await fetch(ShareByAPI, {
        method: "POST",
        body: JSON.stringify({
            idType: 'INSTRUMENT_ID_TYPE_FIGI',
            id: figi,
        }),
        headers: {
            Authorization: `Bearer ${tokenForApi}`,
            "Content-Type": "application/json",
        },
    }
    );
    const data = await response.json();
    if (data.status === 500) {
        throw data.error;
    }
    return data.instrument;
}