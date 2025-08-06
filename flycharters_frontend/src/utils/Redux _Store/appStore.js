import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { combineReducers } from "redux";
import flightReducer from "./flightTicketSlice";
import userReducer from "./userSlice";
import fleetReducer from "./fleetSlice";

// Combine all reducers
const rootReducer = combineReducers({
    user: userReducer,
    fleet: fleetReducer,
    flightTicket: flightReducer,
});

// Configuration for redux-persist
const persistConfig = {
    key: "root",
    storage,
    whitelist: ["user","fleet","flightTicket"],
};

// Wrap the rootReducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store with the persisted reducer
const appStore = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
        serializableCheck: false, // required for redux-persist
    }),
});

export const persistor = persistStore(appStore);
export default appStore;