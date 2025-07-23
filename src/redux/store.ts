import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userRedux";
import Products from "./Products";
import UseersComponentRedux from "./UseersComponentRedux";
import MessageRedux from "./MessageRedux";
import AnnoucmentRedux from "./AnnoucmentRedux";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";

// Combine reducers
const rootReducer = combineReducers({
  user: userReducer,
  users: UseersComponentRedux,
  Products: Products,
  error: MessageRedux,
  announcements: AnnoucmentRedux,
});

// Persist configuration
const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Persistor
export const persistor = persistStore(store);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
