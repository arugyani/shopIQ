import { configureStore } from "@reduxjs/toolkit";

import historyReducer from "./features/historySlice";
import questionReducer from "./features/questionSlice";
import productReducer from "./features/productSlice";

export const store = configureStore({
  reducer: {
    history: historyReducer,
    questions: questionReducer,
    products: productReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
