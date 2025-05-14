import { TFAccount } from "../../types/accounts.type";
import { TFPortfolio } from "../../types/portfolio.type";
import { GetPortfolioAPI, TOKEN } from "./common";

export async function fetchAllGetPortfoliosAPI(accountsList: TFAccount[]) {
    let results: TFPortfolio[] = [];
    try {
        return Promise.all(accountsList.map(async account => {
            const result = await fetchGetPortfolioAPI(account.id);
            results.push(result);
        })).then(() => {
            return results;
        });
    } catch (e) {
        throw new Error(`fetchAllGetPortfolioAPI went wrong`);
    };
};


export async function fetchGetPortfolioAPI(id: string) {
    const response = await fetch(GetPortfolioAPI, {
        method: "POST",
        body: JSON.stringify({
            accountId: id,
            currency: "RUB",
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
    return data
}