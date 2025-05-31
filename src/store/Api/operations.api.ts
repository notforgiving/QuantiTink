import moment from "moment";
import { TFAccount } from "../../types/accounts.type";
import { TFUnionOperations } from "../slices/operations.slice";
import { GetOperationsAPI } from "./common";
import { TOKEN_LOCALSTORAGE_NAME } from "types/token.type";

export async function fetchAllGetOperationsAPI(accountsList: TFAccount[]) {
    let results: TFUnionOperations[] = [];
    try {
        return Promise.all(accountsList.map(async account => {
            const result:any = await fetchGetOperationsAPI(account.id);
            if (result.hasOwnProperty('code')) {
                throw result.message;
            } else {
                results.push(result);
            }
        })).then(() => {
            return results;
        });
    } catch (e) {
        throw new Error(`fetchAllGetOperationsAPI went wrong`);
    };
};


export async function fetchGetOperationsAPI(id: string) {
    const TOKEN = localStorage.getItem(TOKEN_LOCALSTORAGE_NAME);
    const tokenForApi = TOKEN ? JSON.parse(TOKEN) : null;
    try {
        const response = await fetch(GetOperationsAPI, {
            method: "POST",
            body: JSON.stringify({
                accountId: id,
                from: moment().add(-5, 'y').utc(),
                to: moment().utc(),
                state: "OPERATION_STATE_EXECUTED",
            }),
            headers: {
                Authorization: `Bearer ${tokenForApi}`,
                "Content-Type": "application/json",
            },
        }
        );
        const data = await response.json();
        return {
            accountId: id,
            operations: data.operations
        };
    } catch (e) {
        return e;
    }
}