import { TAccount } from "api/features/accounts/accountsSlice";
import { TAssetResponse, TBondsInstrumentResponse, TEtfsInstrumentResponse, TOperationsResponse, TPortfolioResponse, TSharesInstrumentResponse } from "api/features/accounts/accountsTypes";
import { TTokenState } from "api/features/token/tokenSlice";
import moment from "moment";

import { fetchWithCache } from "utils/fetchWithCache";

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

export async function fetchGetOperationsAPI({
  token,
  accountId,
}: {
  token: TTokenState["data"];
  accountId: string;
}): Promise<TOperationsResponse> {
  return fetchWithCache(
    `operations:${accountId}`, // уникальный ключ для кэша
    async () => {
      const response = await fetch(
        "https://invest-public-api.tinkoff.ru/rest/tinkoff.public.invest.api.contract.v1.OperationsService/GetOperations",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            accountId,
            from: moment().add(-1, "y").utc().toISOString(),
            to: moment().utc().toISOString(),
            state: "OPERATION_STATE_EXECUTED",
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error?.message || "Ошибка загрузки операций");
      }

      return data as TOperationsResponse;
    },
    { ttl: 30 * 60 * 1000 } // кэш 10 минут
  );
}


export async function fetchGetPositionBondAPI({
  token,
  figi,
}: {
  token: TTokenState["data"];
  figi: string;
}): Promise<TBondsInstrumentResponse> {
  return fetchWithCache(
    `bond:${figi}`, // ключ в localStorage
    async () => {
      const response = await fetch(
        "https://invest-public-api.tinkoff.ru/rest/tinkoff.public.invest.api.contract.v1.InstrumentsService/BondBy",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idType: "INSTRUMENT_ID_TYPE_FIGI",
            id: figi,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.error?.message ||
          `Ошибка загрузки данных по облигации ${figi}`
        );
      }

      return data as TBondsInstrumentResponse;
    },
    { ttl: 30 * 60 * 1000 } // кэш 10 минут
  );
}

export async function fetchGetPositionEtfAPI({
  token,
  figi,
}: {
  token: TTokenState["data"];
  figi: string;
}): Promise<TEtfsInstrumentResponse> {
  return fetchWithCache(
    `etf:${figi}`, // уникальный ключ в localStorage
    async () => {
      const response = await fetch(
        "https://invest-public-api.tinkoff.ru/rest/tinkoff.public.invest.api.contract.v1.InstrumentsService/EtfBy",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idType: "INSTRUMENT_ID_TYPE_FIGI",
            id: figi,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.error?.message || `Ошибка загрузки данных по фонду ${figi}`
        );
      }

      return data as TEtfsInstrumentResponse;
    },
    { ttl: 30 * 60 * 1000 } // 10 минут
  );
}

export async function fetchGetPositionShareAPI({
  token,
  figi,
}: {
  token: TTokenState["data"];
  figi: string;
}): Promise<TSharesInstrumentResponse> {
  return fetchWithCache(
    `share:${figi}`, // ключ в localStorage
    async () => {
      const response = await fetch(
        "https://invest-public-api.tinkoff.ru/rest/tinkoff.public.invest.api.contract.v1.InstrumentsService/ShareBy",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idType: "INSTRUMENT_ID_TYPE_FIGI",
            id: figi,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.error?.message || `Ошибка загрузки данных по акции ${figi}`
        );
      }

      return data as TSharesInstrumentResponse;
    },
    { ttl: 30 * 60 * 1000 } // кэш 10 минут
  );
}

export async function fetchGetAssetByAPI({
  token,
  assetUid,
}: {
  token: TTokenState["data"];
  assetUid: string;
}): Promise<TAssetResponse> {
  return fetchWithCache(
    `asset:${assetUid}`, // ключ в localStorage
    async () => {
      const response = await fetch(
        "https://invest-public-api.tinkoff.ru/rest/tinkoff.public.invest.api.contract.v1.InstrumentsService/GetAssetBy",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: assetUid,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.error?.message || `Ошибка загрузки данных по эмитенту ${assetUid}`
        );
      }

      return data as TAssetResponse;
    },
    { ttl: 30 * 60 * 1000 } // кэш 10 минут
  );
}


