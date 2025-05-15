import moment from "moment";
import { GetBondEventsAPI, TOKEN } from "./common";
import { TFPosition } from "../../types/portfolio.type";
import { TEvents, TPortfolioEvents } from "../../types/event.type";

export async function fetchAllGetEventsAPI(positions: TFPosition[]) {
    let results: TPortfolioEvents[] = [];
    try {
        return Promise.all(positions.map(async pos => {
            const result = await fetchGetEventsAPI(pos.figi);
            results.push(result);
        })).then(() => {
            return results;
        });
    } catch (e) {
        throw new Error(`fetchAllGetPortfolioAPI went wrong`);
    };
};


export async function fetchGetEventsAPI(figi: string) {
    const response = await fetch(GetBondEventsAPI, {
        method: "POST",
        body: JSON.stringify({
            from: moment().utc(),
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