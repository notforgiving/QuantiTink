export async function fetchGetCurrencysAPI() {
    const response = await fetch('https://api.tinkoff.ru/v1/currency_rates', {
        method: "GET",
        redirect: "follow"
    }
    );
    const data = await response.json();
    if (data.status === 500) {
        throw data.error;
    }
    return data.payload.rates;
}