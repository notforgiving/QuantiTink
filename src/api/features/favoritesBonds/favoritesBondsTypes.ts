import { TMoneyValue } from "types/common";

import { TBondsItem } from "../bonds/bondsTypes";

export interface IGetBondCouponsEvents {
  couponDate: string;
  couponNumber: string;
  payOneBond: TMoneyValue;
  couponType: string; // COUPON_FIXED или COUPON_FLOATING
  couponStartDate?: string;
  couponEndDate?: string;
  fixDate?: string;
}

export interface TFavoriteBond extends TBondsItem {
  lastPrice?: number; // Цена по API MarketDataService/GetLastPrices

  // Данные по API InstrumentsService/
  events?: IGetBondCouponsEvents[]
}