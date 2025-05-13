export async function fetchGetCurrencysAPI() {
    const response = await fetch('https://v6.exchangerate-api.com/v6/2e229c70f483cc798ca0bdab/latest/USD', {
        method: "GET",
        redirect: "follow"
    }
    );
    const data = await response.json();
    if (data.status === 500) {
        throw data.error;
    }
    return data;
}