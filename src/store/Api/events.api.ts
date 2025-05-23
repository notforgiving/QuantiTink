import moment from "moment";
import { GetBondEventsAPI, GetDividendsAPI, TOKEN } from "./common";
import { TFPosition } from "../../types/portfolio.type";
import { TEvents, TPortfolioEvents } from "../../types/event.type";

export async function fetchAllGetEventsAPI(positions: TFPosition[]) {
    let results: TPortfolioEvents[] = [];
    try {
        return Promise.all(positions.map(async pos => {
            if (pos.instrumentType === 'bond') {
                const res = await fetchGetBondsEventsAPI(pos.figi);
                results.push(res);
            } else {
                const res = await fetchGetDividendsEventsAPI(pos.figi);
                results.push(res);
            }
        })).then(() => {
            return results;
        });
    } catch (e) {
        throw new Error(`fetchAllGetPortfolioAPI went wrong`);
    };
};


export async function fetchGetBondsEventsAPI(figi: string) {
    const response = await fetch(GetBondEventsAPI, {
        method: "POST",
        body: JSON.stringify({
            from: moment().add(-3, 'd').utc(),
            to: moment().add(1, 'y').utc(),
            instrumentId: figi,
            type: "EVENT_TYPE_CPN,EVENT_TYPE_MTY"
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
    const newResult = data.events.map((el: TEvents) => ({
        figi,
        ...el,
    }))
    return newResult;
}

export async function fetchGetDividendsEventsAPI(figi: string) {
    const response = await fetch(GetDividendsAPI, {
        method: "POST",
        body: JSON.stringify({
            from: moment().startOf('year').utc(),
            to: moment().add(1, 'y').utc(),
            instrumentId: figi,
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
    const newResult = data.dividends.map((el: TEvents) => ({
        figi,
        ...el,
    }))
    return newResult;
}