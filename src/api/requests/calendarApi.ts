import { TBondCouponsResponse, TDividendsResponse } from "api/features/calendar/calendarType";
import { TTokenState } from "api/features/token/tokenSlice";
import moment from "moment";

import { fetchWithCache } from "utils/fetchWithCache";

export async function fetchGetDividendsAPI({
    token,
    figi,
}: {
    token: TTokenState["data"];
    figi: string;
}): Promise<TDividendsResponse> {
    return fetchWithCache(
        `calendarShare:${figi}`,
        async () => {
            const response = await fetch(
                "https://invest-public-api.tinkoff.ru/rest/tinkoff.public.invest.api.contract.v1.InstrumentsService/GetDividends",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        figi,
                        from: moment().add(-3, "day").toISOString(),
                        to: moment().add(1, "year").toISOString(),
                    }),
                }
            );

            const data = (await response.json()) as TDividendsResponse;
            if (!response.ok) {
                throw new Error(
                    (data as any).error?.message ||
                    `Ошибка загрузки данных по дивидендам акции ${figi}`
                );
            }

            return data;
        },
        { ttl: 12 * 60 * 60 * 1000 } // 30 минут
    );
}

export async function fetchGetBondCouponsAPI({
    token,
    figi,
}: {
    token: TTokenState["data"];
    figi: string;
}): Promise<TBondCouponsResponse> {
    return fetchWithCache(
        `calendarBond:${figi}`,
        async () => {
            const response = await fetch(
                "https://invest-public-api.tinkoff.ru/rest/tinkoff.public.invest.api.contract.v1.InstrumentsService/GetBondCoupons",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        figi,
                        from: moment().add(-3, "day").toISOString(),
                        to: moment().add(1, "year").toISOString(),
                    }),
                }
            );

            const data = (await response.json()) as TBondCouponsResponse;
            if (!response.ok) {
                throw new Error(
                    (data as any).error?.message ||
                    `Ошибка загрузки данных по дивидендам акции ${figi}`
                );
            }

            return data;
        },
        { ttl: 12 * 60 * 60 * 1000 } // 30 минут
    );
}