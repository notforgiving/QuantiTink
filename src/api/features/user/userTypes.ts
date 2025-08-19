export type TTheme = 'light' | 'dark';
export interface User {
  id: string;
  email: string;
  theme: TTheme;
}