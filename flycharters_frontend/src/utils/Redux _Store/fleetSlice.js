import { createSlice } from "@reduxjs/toolkit";

const fleetSlice = createSlice({
    name: "fleet",
    initialState: null,
    reducers: {
        addFleet: (state, action) => action.payload,
        removeFleet: () => null,
    }
});

export const {addFleet, removeFleet} = fleetSlice.actions;
export default fleetSlice.reducer;