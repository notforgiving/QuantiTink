import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const demoSlice = createSlice({
    name: "demo",
    initialState: false as boolean,
    reducers: {
        setDemo(_state, action: PayloadAction<boolean>) {
            return action.payload;
        },
    },
});

export const { setDemo } = demoSlice.actions;

export default demoSlice.reducer;