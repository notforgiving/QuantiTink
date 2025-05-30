export const USER = 'user';
export const CREATE_USER = `${USER}/createUserAction`;
export type TFCREATE_USER = typeof CREATE_USER;

export const LOGIN_USER = `${USER}/loginUserAction`;
export type TFLOGIN_USER = typeof LOGIN_USER;

export type TUserState = {
    email: string | null;
    token: string | null;
    id: string | null;
}
