import { TInfo } from "api/features/info/infoSlice";

export async function fetchGetInfoAPI(token: string): Promise<TInfo> {
  const response = await fetch(
    "https://invest-public-api.tinkoff.ru/rest/tinkoff.public.invest.api.contract.v1.UsersService/GetInfo",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    }
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || "Ошибка загрузки информации о тарифе");
  }

  return data;
}
