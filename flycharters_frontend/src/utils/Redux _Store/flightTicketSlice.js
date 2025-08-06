import { createSlice } from "@reduxjs/toolkit";

const flightTicketSlice = createSlice({
    name: "flightTicket",
    initialState: null,
    reducers: {
        addFlight: (state, action) => action.payload,
        removeFlight: () => null,
    }
});

export const {addFlight, removeFlight} = flightTicketSlice.actions;
export default flightTicketSlice.reducer;