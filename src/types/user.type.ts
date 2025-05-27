export const USER = 'user';
export const GET_USER = `${USER}/getUserAction`;
export type TFGET_USER = typeof GET_USER;

export type TUserState = {
    email: string | null;
    token: string | null;
    id: string | null;
}
