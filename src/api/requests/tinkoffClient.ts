// src/api/tinkoffClient.ts

import { TAccount } from "api/features/accounts/accountsSlice";

const BASE_URL =
  "https://invest-public-api.tinkoff.ru/rest/tinkoff.public.invest.api.contract.v1";

export class TinkoffClient {
  private static async request<T>(token: string, endpoint: string, body: object = {}): Promise<T> {
    const res = await fetch(`${BASE_URL}/${endpoint}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error(`Ошибка ${res.status}: ${res.statusText}`);
    }

    return res.json();
  }

  /** Получение списка счетов */
  static getAccounts(token: string) {
    return this.request<{ accounts: TAccount[] }>(token, "UsersService/GetAccounts");
  }

  /** Получение портфеля */
  static getPortfolio(token: string, accountId: string) {
    return this.request(token, "OperationsService/GetPortfolio", { accountId });
  }

  /** Получение позиций */
  static getPositions(token: string, accountId: string) {
    return this.request(token, "OperationsService/GetPositions", { accountId });
  }

  /** Поиск инструмента */
  static findInstrument(token: string, ticker: string) {
    return this.request(token, "InstrumentsService/FindInstrument", { query: ticker });
  }
}
