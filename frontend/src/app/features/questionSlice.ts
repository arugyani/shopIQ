import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";

import { fetchQuestions } from "@/api/useFetch";

export type Question = {
  question: string;
  answers: string[];
  multipleAnswers: boolean;
};

export interface QuestionState {
  questions: Question[];
  status: "idle" | "loading" | "failed";
}

const initialState: QuestionState = {
  questions: [],
  status: "idle",
};

export const questionSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {
    setQuestions: (state, action: PayloadAction<Question[]>) => {
      state.questions = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(questionsAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(questionsAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.questions = action.payload;
      })
      .addCase(questionsAsync.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const questionsAsync = createAsyncThunk(
  "questions/fetchQuestions",
  async (query: string) => {
    const response = await fetchQuestions(query);
    return response;
  }
);

export const { setQuestions } = questionSlice.actions;

export const selectQuestions = (state: RootState) => state.questions.questions;

export default questionSlice.reducer;
