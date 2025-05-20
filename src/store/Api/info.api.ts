import { GetInfoAPI, TOKEN } from "./common";

export async function  fetchGetInfoAPI() {
    const response = await fetch(GetInfoAPI, {
        method: "POST",
        body: JSON.stringify({}),
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
    return data;
}