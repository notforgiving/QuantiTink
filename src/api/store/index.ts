import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // по умолчанию localStorage
import createSagaMiddleware from "redux-saga";

import rootReducer from "./rootReducer";
import rootSaga from "./rootSaga";

const sagaMiddleware = createSagaMiddleware();

// Конфигурация redux-persist
const persistConfig = {
  key: "root",
  storage,
  // whitelist: ["user", "token", "currency", "accounts"], // 👈 укажи здесь только те slice'ы, которые нужно сохранять
};

// Оборачиваем rootReducer через persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false,
      serializableCheck: {
        // redux-persist нуждается в исключениях для некоторых нестандартных экшенов
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

// persistStore — обёртка для store, запускает механизм восстановления
export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
