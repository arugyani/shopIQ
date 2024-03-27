import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HistoryObject } from "@/types-and-interfaces";
import { RootState } from "../store";

export interface HistoryState {
  historyList: HistoryObject[];
}

const initialState: HistoryState = {historyList: []};

export const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    addToHistory: (state, action: PayloadAction<HistoryObject>) => {
      state.historyList.push(action.payload);
      localStorage.setItem("history", JSON.stringify(state.historyList));
    },
    removeFromHistory: (state, action: PayloadAction<string>) => {
      state.historyList = state.historyList.filter(
        item => item.id !== action.payload
      );
      localStorage.setItem("history", JSON.stringify(state.historyList));
    },
    clearHistory: state => {
      state.historyList = [];
      localStorage.removeItem("history");
    },
  },
});
export const { addToHistory, removeFromHistory, clearHistory } = historySlice.actions;
export default historySlice.reducer;
const savedHistory = localStorage.getItem("history");
if (savedHistory) {
  initialState.historyList = JSON.parse(savedHistory);
}
export const selectHistory = (state: RootState) => state.history.historyList;
