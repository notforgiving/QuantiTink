import { TInstrument } from "../../types/bonds.type";
import { TFPosition } from "../../types/portfolio.type";
import { BondByAPI, TOKEN } from "./common";

export async function fetchAllGetBondsAPI(bondsPositions: TFPosition[]) {
    let results: TInstrument[] = [];
    try {
        return Promise.all(bondsPositions.map(async pos => {
            const res = await fetchGetBondByAPI(pos.figi);
            results.push(res);
        })).then(() => {
            return results;
        });
    } catch (e) {
        throw new Error(`fetchAllGetBondsAPI went wrong`);
    };
};


export async function fetchGetBondByAPI(figi: string) {
    const response = await fetch(BondByAPI, {
        method: "POST",
        body: JSON.stringify({
            idType: 'INSTRUMENT_ID_TYPE_FIGI',
            id: figi,
        }),
        headers: {
            Authorization: `Bearer ${TOKEN}`,
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