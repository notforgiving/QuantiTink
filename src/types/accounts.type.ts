export type TFAccountStatus = 'ACCOUNT_STATUS_UNSPECIFIED' | 'ACCOUNT_STATUS_NEW' | 'ACCOUNT_STATUS_OPEN' | 'ACCOUNT_STATUS_CLOSED' | 'ACCOUNT_STATUS_ALL';

export type TFAccountType = 'ACCOUNT_TYPE_INVEST_BOX' | 'ACCOUNT_TYPE_TINKOFF'

export type TFAccount = {
    accessLevel: string;
    closedDate: string;
    id: string;
    name: string;
    openedDate: string;
    status: TFAccountStatus;
    type: TFAccountType;
}

export type TFaccountsApiResponse = {
  accounts: TFAccount[];
};

export const ACCOUNTS = 'accounts';
export const GET_ACCOUNTS_LIST = `${ACCOUNTS}/getaccountsListAction`;
export type TFGET_ACCOUNTS_LIST = typeof GET_ACCOUNTS_LIST;
