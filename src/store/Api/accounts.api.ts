import { GetAccountsAPI, TOKEN } from "./common";

export async function  fetchGetAccountsAPI() {
    const response = await fetch(GetAccountsAPI, {
        method: "POST",
        body: JSON.stringify({
            status: "ACCOUNT_STATUS_OPEN",
        }),
        headers: {
            Authorization: `Bearer ${TOKEN}`,
            "Content-Type": "application/json",
        },
    }
    );
    const data = await response.json();
    if(data.status === 500) {
        throw data.error;
    }
    return data.accounts;
}