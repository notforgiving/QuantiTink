import { TFAccount } from "./accounts.type";
import { TFAmount, TFCurrency, TFInstrumentType, TFOperationOperationType, TFOperationType } from "./portfolio.type";

export const OPERATIONS = 'operations';
export const GET_OPERATIONS_LIST = `${OPERATIONS}/getOperationsListAction`;
export type TFPORTFOLIOS = typeof OPERATIONS;

export type TFTrade = {
    dateTime: string;
    quantity: string;
    price: TFAmount;
}

export type TFOperationsApiState = {
    id: string;
    operations: TFAccount[];
}

export type TFOperations = {
    operations: TFAccount[]
}

export type TFOperation = {
    currency: TFCurrency;
    date: string;
    figi: string;
    instrumentType: TFInstrumentType;
    childOperations: {
        payment: TFAmount
    }[]
    payment: TFAmount;
    price: TFAmount;
    quantity: string;
    trades: TFTrade[];
    type: TFOperationType;
    /** Вывод со счетов или перевод на другой счет */
    operationType: TFOperationOperationType;
}