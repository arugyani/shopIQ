import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import {
  HistoryObject,
  MultipleChoiceObject,
  ProductObject,
} from "@/types-and-interfaces";
import { RootState } from "../store";
import { fetchProducts, fetchQuestions } from "@/api/useFetch";

export interface HistoryState {
  historyList: HistoryObject[];
  status: "idle" | "loading" | "failed";
  currentHistoryId: string;
  currentProductId:string;
}

const initialState: HistoryState = { historyList: [], status: "idle", currentHistoryId:"", currentProductId:"" };

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
        (item) => item.id !== action.payload
      );
      localStorage.setItem("history", JSON.stringify(state.historyList));
    },
    clearHistory: (state) => {
      state.historyList = [];
      localStorage.removeItem("history");
    },
    addQuestion: (
      state,
      action: PayloadAction<{
        historyId: string;
        question: MultipleChoiceObject;
      }>
    ) => {
      const { historyId, question } = action.payload;
      const historyObject = state.historyList.find(
        (history) => history.id === historyId
      );
      if (historyObject) {
        historyObject.questions.push(question);
        localStorage.setItem("history", JSON.stringify(state.historyList));
      }
    },
    removeQuestion: (
      state,
      action: PayloadAction<{ historyId: string; questionId: string }>
    ) => {
      const { historyId, questionId } = action.payload;
      const historyObject = state.historyList.find(
        (history) => history.id === historyId
      );
      if (historyObject) {
        historyObject.questions = historyObject.questions.filter(
          (question) => question.id !== questionId
        );
        localStorage.setItem("history", JSON.stringify(state.historyList));
      }
    },
    updateQuestion: (
      state,
      action: PayloadAction<{
        historyId: string;
        question: MultipleChoiceObject;
      }>
    ) => {
      const { historyId, question } = action.payload;
      const historyObject = state.historyList.find(
        (history) => history.id === historyId
      );
      if (historyObject) {
        const index = historyObject.questions.findIndex(
          (q) => q.id === question.id
        );
        if (index !== -1) {
          historyObject.questions[index] = question;
          localStorage.setItem("history", JSON.stringify(state.historyList));
        }
      }
    },
    addProduct: (
      state,
      action: PayloadAction<{ historyId: string; product: ProductObject }>
    ) => {
      const { historyId, product } = action.payload;
      const historyObject = state.historyList.find(
        (history) => history.id === historyId
      );
      if (historyObject) {
        historyObject.products.push(product);
        localStorage.setItem("history", JSON.stringify(state.historyList));
      }
    },
    removeProduct: (
      state,
      action: PayloadAction<{ historyId: string; productId: string }>
    ) => {
      const { historyId, productId } = action.payload;
      const historyObject = state.historyList.find(
        (history) => history.id === historyId
      );
      if (historyObject) {
        historyObject.products = historyObject.products.filter(
          (product) => product.id !== productId
        );
        localStorage.setItem("history", JSON.stringify(state.historyList));
      }
    },
    updateProduct: (
      state,
      action: PayloadAction<{ historyId: string; product: ProductObject }>
    ) => {
      const { historyId, product } = action.payload;
      const historyObject = state.historyList.find(
        (history) => history.id === historyId
      );
      if (historyObject) {
        const index = historyObject.products.findIndex(
          (p) => p.id === product.id
        );
        if (index !== -1) {
          historyObject.products[index] = product;
          localStorage.setItem("history", JSON.stringify(state.historyList));
        }
      }
    },
    updateCurrentHistoryId:(state,action: PayloadAction<{ historyId: string }>) => {
      state.currentHistoryId = action.payload.historyId
      state.currentProductId = ""
    },
    updateCurrentProductId:(state,action: PayloadAction<{ productId: string }>) => {
          state.currentProductId = action.payload.productId
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(questionsAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(questionsAsync.fulfilled, (state, action) => {
        state.status = "idle";
        const historyId = action.payload.historyId;
        if (historyId) {
          state.historyList = state.historyList = state.historyList.map(
            (historyObj) => {
              if (historyObj.id == historyId) {
                const updatedHistoryObj = historyObj;
                updatedHistoryObj.questions = action.payload.questions;
                return updatedHistoryObj;
              }
              return historyObj;
            }
          );
        }
      })
      .addCase(questionsAsync.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(productsAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(productsAsync.fulfilled, (state, action) => {
        state.status = "idle";
        const historyId = action.payload.historyId;
        if (historyId) {
          state.historyList = state.historyList = state.historyList.map(
            (historyObj) => {
              if (historyObj.id == historyId) {
                const updatedHistoryObj = historyObj;
                updatedHistoryObj.products = action.payload.products;
                return updatedHistoryObj;
              }
              return historyObj;
            }
          );
        }
      })
      .addCase(productsAsync.rejected, (state) => {
        state.status = "failed";
      });
  },
});
export const {
  addToHistory,
  removeFromHistory,
  clearHistory,
  addQuestion,
  removeQuestion,
  updateQuestion,
  addProduct,
  removeProduct,
  updateProduct,
  updateCurrentHistoryId,
  updateCurrentProductId
} = historySlice.actions;
export default historySlice.reducer;
const savedHistory = localStorage.getItem("history");
if (savedHistory) {
  initialState.historyList = JSON.parse(savedHistory);
}

export const questionsAsync = createAsyncThunk(
  "questions/fetchQuestions",
  async (query: { search: string; historyId: string }) => {
    const response = await fetchQuestions(query.search);
    return { questions: response, historyId: query.historyId };
  }
);
export const productsAsync = createAsyncThunk(
  "products/fetchProducts",
  async (query: {body:JSON, historyId:string}) => {
    const response = await fetchProducts(query.body);
    return {products:response, historyId:query.historyId};
  }
);
export const selectHistory = (state: RootState) => state.history.historyList;
export const selectStatus = (state: RootState) => state.history.status;
export const selectCurrentHistoryId = (state: RootState) => state.history.currentHistoryId;
export const selectCurrentProductId = (state: RootState) => state.history.currentProductId;
export const selectCurrentProduct = (state:RootState)=>{
  const CurrentProduct = state.history.historyList.find((historyObj)=>historyObj.id==state.history.currentHistoryId)?.products.find((product)=>product.id==state.history.currentProductId)
  if(CurrentProduct){
      return CurrentProduct
    }else return {} as ProductObject
}


export const selectCurrentProducts = (state: RootState) => {
  const CurrentProducts = state.history.historyList.find((historyObj)=>historyObj.id==state.history.currentHistoryId)?.products
  if(CurrentProducts){
    return CurrentProducts
  }else return []
};
export const selectCurrentQuestions = (state: RootState) => {
  const CurrentQuestions = state.history.historyList.find((historyObj)=>historyObj.id==state.history.currentHistoryId)?.questions
  if(CurrentQuestions){
      return CurrentQuestions
    }else return []
};