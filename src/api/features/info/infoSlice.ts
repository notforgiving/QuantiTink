import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TRiskLevel, TTariff, TWorkInstrument } from "types/common";

export type TInfo = {
  premStatus: boolean;
  qualStatus: boolean;
  qualifiedForWorkWith: TWorkInstrument[];
  tariff: TTariff;
  userId: string;
  riskLevelCode: TRiskLevel;
};

// Стейт слайса
interface InfoState {
    data: TInfo | null;
    loading: boolean;
    error: string | null;
}

const initialState: InfoState = {
    data: null,
    loading: false,
    error: null,
};

const infoSlice = createSlice({
    name: "info",
    initialState,
    reducers: {
        fetchInfoRequest(state) {
            state.loading = true;
            state.error = null;
        },
        fetchInfoSuccess(state, action: PayloadAction<TInfo>) {
            state.data = action.payload;
            state.loading = false;
        },
        fetchInfoFailure(state, action: PayloadAction<string>) {
            state.error = action.payload;
            state.loading = false;
        },
        clearInfo(state) {
            state.data = null;
            state.error = null;
            state.loading = false;
        },
    },
});

export const {
    fetchInfoRequest,
    fetchInfoSuccess,
    fetchInfoFailure,
    clearInfo,
} = infoSlice.actions;

// Оборачиваем с redux-persist
export default infoSlice.reducer;