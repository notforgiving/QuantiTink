import { TFAccount } from "../../types/accounts.type";
import { TFUnionOperations } from "../slices/operations.slice";
import { GetOperationsAPI, TOKEN } from "./common";

export async function fetchAllGetOperationsAPI(accountsList: TFAccount[]) {
    let results: TFUnionOperations[] = [];
    try {
        return Promise.all(accountsList.map(async account => {
            const result = await fetchGetOperationsAPI(account.id);
            results.push(result);
        })).then(() => {
            return results;
        });
    } catch (e) {
        throw new Error(`fetchAllGetPortfolioAPI went wrong`);
    };
};


export async function fetchGetOperationsAPI(id: string) {
    const response = await fetch(GetOperationsAPI, {
        method: "POST",
        body: JSON.stringify({
            accountId: id,
            state: "OPERATION_STATE_EXECUTED",
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
    return {
        accountId: id,
        operations: data.operations
    };
}