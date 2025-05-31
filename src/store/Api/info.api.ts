import { TOKEN_LOCALSTORAGE_NAME } from "types/token.type";
import { GetInfoAPI } from "./common";

export async function fetchGetInfoAPI() {
    const TOKEN = localStorage.getItem(TOKEN_LOCALSTORAGE_NAME);
    const tokenForApi = TOKEN ? JSON.parse(TOKEN) : null;
    const response = await fetch(GetInfoAPI, {
        method: "POST",
        body: JSON.stringify({}),
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
    return data;
}