import { createSlice } from "@reduxjs/toolkit";

export interface HistoryState {}

const initialState: HistoryState = {};

export const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {},
});

export default historySlice.reducer;
