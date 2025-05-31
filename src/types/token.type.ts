export const TOKEN = 'token';
export const SET_TOKEN = `${TOKEN}/setTokenAction`;
export type TFSET_TOKEN = typeof SET_TOKEN;

export const GET_TOKEN = `${TOKEN}/getTokenAction`;
export type TFGET_TOKEN = typeof GET_TOKEN;

export type TFToken = {
    token: string | null;
}

export const TOKEN_LOCALSTORAGE_NAME = 'Tbalance_token';