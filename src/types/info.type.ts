export const INFO = 'info';
export const GET_INFO = `${INFO}/getInfoAction`;
export type TFGET_INFO = typeof GET_INFO;

export type TCccordanceTariffAndComissions = {
    premium: number;
    investor: number,
    treider: number,
}

export const accordanceTariffAndComissions: TCccordanceTariffAndComissions = {
    premium: 0.04,
    investor: 0.3,
    treider: 0.05,
}

export type TInfoState = {
    tariff: keyof TCccordanceTariffAndComissions,
};