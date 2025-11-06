import { TBondsResponse } from "api/features/bonds/bondsTypes";
import { TTokenState } from "api/features/token/tokenSlice";

import { fetchWithCache } from "utils/fetchWithCache";

/**
 * Получение списка всех облигаций с публичного API Тинькофф
 */
export async function fetchGetBondsAPI({
    token,
}: {
    token: TTokenState["data"];
}): Promise<TBondsResponse> {
    return fetchWithCache(
        null,
        async () => {
            const response = await fetch(
                "https://invest-public-api.tinkoff.ru/rest/tinkoff.public.invest.api.contract.v1.InstrumentsService/Bonds",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        // instrumentStatus: "INSTRUMENT_STATUS_ALL", // можно менять при необходимости
                        // instrumentExchange: "INSTRUMENT_EXCHANGE_DEALER"
                    }),
                }
            );

            const data = (await response.json()) as TBondsResponse;

            if (!response.ok) {
                throw new Error(
                    (data as any).error?.message ||
                    "Ошибка загрузки списка облигаций"
                );
            }

            return data;
        },
        { ttl: 3 * 60 * 60 * 1000 } // 3 часа кэш
    );
}
