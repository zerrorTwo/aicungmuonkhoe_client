// Redux store configuration
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { baseApi } from "./api/baseApi";
import { consultingApi } from "./api/consultingApi";
import authReducer from "./slices/authSlice";
import healthDocumentReducer from "./slices/healthDocumentSlice";
import selfManagedAccountReducer from "./slices/self-managed-account.slice";
import conclusionReducer from "./slices/conclusionSlice";
import communityReducer from "./slices/communitySlice";

// Configure the store
export const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice
    [baseApi.reducerPath]: baseApi.reducer,
    [consultingApi.reducerPath]: consultingApi.reducer,
    // Add other reducers here
    auth: authReducer,
    healthDocument: healthDocumentReducer,
    selfManagedAccount: selfManagedAccountReducer,
    conclusion: conclusionReducer,
    community: communityReducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(baseApi.middleware, consultingApi.middleware),
  devTools: process.env.NODE_ENV !== "production",
});

// Optional, but required for refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
