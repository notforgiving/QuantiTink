import { TAccount } from "api/features/accounts/accountsSlice";
import { TPortfolioResponse } from "api/features/accounts/accountsTypes";
import { TTokenState } from "api/features/token/tokenSlice";

export async function fetchGetAccountsAPI(token: string): Promise<TAccount[]> {
  const response = await fetch(
    "https://invest-public-api.tinkoff.ru/rest/tinkoff.public.invest.api.contract.v1.UsersService/GetAccounts",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: "ACCOUNT_STATUS_OPEN",
      }),
    }
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || "Ошибка загрузки аккаунтов");
  }

  return data.accounts;
}

export async function fetchGetPortfolioAPI({ token, accountId }: {
  token: TTokenState['data'],
  accountId: string
}): Promise<TPortfolioResponse> {
  const response = await fetch(
    "https://invest-public-api.tinkoff.ru/rest/tinkoff.public.invest.api.contract.v1.OperationsService/GetPortfolio",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accountId: accountId,
        currency: "RUB",
      }),
    }
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || "Ошибка загрузки аккаунтов");
  }

  return data;
}

