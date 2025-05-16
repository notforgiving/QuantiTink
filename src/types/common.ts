export type IListState<T> = {
  data: T[] | null;
  isLoading: boolean;
  errors: unknown;
};

export type IEntityState<T> = {
  data: T | null;
  isLoading: boolean;
  errors: unknown;
};

export type TFFormattPrice = {
  formatt: string;
  value: number;
}

export type TBrand = {
  logoName: string,
  logoBaseColor: string,
  textColor: string,
}