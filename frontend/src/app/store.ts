import { configureStore } from "@reduxjs/toolkit";

import historyReducer from "./features/historySlice";
import questionReducer from "./features/questionSlice";

export const store = configureStore({
  reducer: {
    history: historyReducer,
    questions: questionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
