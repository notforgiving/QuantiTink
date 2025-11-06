import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TRiskLevel, TTariff, TWorkInstrument } from "types/common";

export type TInfo = {
    premStatus: boolean;
    qualStatus: boolean;
    qualifiedForWorkWith: TWorkInstrument[];
    tariff: TTariff;
    userId: string;
    riskLevelCode: TRiskLevel;
    comission?: number;
};

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
        getComissionRequest(state) {
            state.loading = true;
            state.error = null;
        },
        getComissionSuccess(state, action: PayloadAction<number>) {
            state.data!.comission = action.payload;
            state.loading = false;
        },
        getComissionFailed(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const {
    fetchInfoRequest,
    fetchInfoSuccess,
    fetchInfoFailure,
    getComissionRequest,
    getComissionSuccess,
    getComissionFailed,
} = infoSlice.actions;


export default infoSlice.reducer;