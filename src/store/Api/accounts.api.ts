import { TOKEN_LOCALSTORAGE_NAME } from "types/token.type";
import { GetAccountsAPI } from "./common";

export async function fetchGetAccountsAPI() {
    const TOKEN = localStorage.getItem(TOKEN_LOCALSTORAGE_NAME);
    const tokenForApi = TOKEN ? JSON.parse(TOKEN) : null;
    const response = await fetch(GetAccountsAPI, {
        method: "POST",
        body: JSON.stringify({
            status: "ACCOUNT_STATUS_OPEN",
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
    return data.accounts;
}