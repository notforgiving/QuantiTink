import { TFAccount } from "../../types/accounts.type";
import { TFPortfolio } from "../../types/portfolio.type";
import { GetPortfolioAPI, TOKEN } from "./common";

export async function fetchAllGetPortfoliosAPI(accountsList: TFAccount[]) {
    let results: TFPortfolio[] = [];
    try {
        return Promise.all(accountsList.map(async account => {
            const result = await fetchGetPortfolioAPI(account.id);
            if (result.hasOwnProperty('code')) {
                throw result.message;
            } else {
                results.push(result);
            }
        })).then(() => {
            return results;
        });
    } catch (e) {
        throw new Error(`fetchAllGetPortfoliosAPI went wrong`);
    };
};


export async function fetchGetPortfolioAPI(id: string) {
    const tokenForApi = TOKEN ? JSON.parse(TOKEN) : null;
    try {
        const response = await fetch(GetPortfolioAPI, {
            method: "POST",
            body: JSON.stringify({
                accountId: id,
                currency: "RUB",
            }),
            headers: {
                Authorization: `Bearer ${tokenForApi}`,
                "Content-Type": "application/json",
            },
        }
        );
        const data = await response.json();
        return data
    } catch (e) {
        return e;
    }
}