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
  currentHistoryId: string;
  currentProductId: string;
  questionsExpanded: boolean;
  questionStatus: "idle" | "loading" | "failed";
  productStatus: "idle" | "loading" | "failed";
}

const initialState: HistoryState = {
  historyList: [],
  currentHistoryId: "",
  currentProductId: "",
  questionsExpanded: true,
  questionStatus: "idle",
  productStatus: "idle",
};

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
      state.currentHistoryId = "";
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
    updateCurrentHistoryId: (
      state,
      action: PayloadAction<{ historyId: string }>
    ) => {
      state.currentHistoryId = action.payload.historyId;
      state.currentProductId = "";
    },
    updateCurrentProductId: (
      state,
      action: PayloadAction<{ productId: string }>
    ) => {
      state.currentProductId = action.payload.productId;
    },
    setQuestionsExpanded: (state, action: PayloadAction<boolean>) => {
      state.questionsExpanded = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(questionsAsync.pending, (state) => {
        state.questionStatus = "loading";
      })
      .addCase(questionsAsync.fulfilled, (state, action) => {
        state.questionStatus = "idle";
        const historyId = action.payload.historyId;

        if (state.currentHistoryId == historyId) {
          state.historyList = state.historyList.map((historyItem) => {
            if (historyItem.id == historyId) {
              const updatedHistoryItem = historyItem;
              updatedHistoryItem.questions = action.payload.questions;
              updatedHistoryItem.name = action.payload.name;
              return updatedHistoryItem;
            }
            return historyItem;
          });
        } else {
          const historyObject = {
            id: historyId,
            name: action.payload.name,
            svg: "some svg",
            questions: action.payload.questions as MultipleChoiceObject[],
            products: [] as ProductObject[],
          } as HistoryObject;

          const tempList = [historyObject, ...state.historyList];

          state.historyList = tempList;
          localStorage.setItem("history", JSON.stringify(state.historyList));

          state.currentHistoryId = historyId;
        }
      })
      .addCase(questionsAsync.rejected, (state) => {
        state.questionStatus = "failed";
      })
      .addCase(productsAsync.pending, (state) => {
        state.productStatus = "loading";
      })
      .addCase(productsAsync.fulfilled, (state, action) => {
        state.productStatus = "idle";
        const historyId = action.payload.historyId;
        if (historyId) {
          state.historyList = state.historyList.map((historyObj) => {
            if (historyObj.id == historyId) {
              const updatedHistoryObj = historyObj;
              updatedHistoryObj.products = action.payload.products;
              return updatedHistoryObj;
            }
            return historyObj;
          });

          localStorage.setItem("history", JSON.stringify(state.historyList));
        }
      })
      .addCase(productsAsync.rejected, (state) => {
        state.productStatus = "failed";
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
  updateCurrentProductId,
  setQuestionsExpanded,
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
    return {
      questions: response,
      historyId: query.historyId,
      name: query.search,
    };
  }
);

export const productsAsync = createAsyncThunk(
  "products/fetchProducts",
  async (query: { query: string; body: string; historyId: string }) => {
    const response = await fetchProducts(query.query, JSON.parse(query.body));
    return { products: response, historyId: query.historyId };
  }
);

export const selectHistory = (state: RootState) => state.history.historyList;
export const selectCurrentHistoryId = (state: RootState) =>
  state.history.currentHistoryId;
export const selectCurrentProductId = (state: RootState) =>
  state.history.currentProductId;
export const selectCurrentProduct = (state: RootState) => {
  const CurrentProduct = state.history.historyList
    .find((historyObj) => historyObj.id == state.history.currentHistoryId)
    ?.products.find((product) => product.id == state.history.currentProductId);
  if (CurrentProduct) {
    return CurrentProduct;
  } else return {} as ProductObject;
};

export const selectQuestionStatus = (state: RootState) =>
  state.history.questionStatus;
export const selectProductStatus = (state: RootState) =>
  state.history.productStatus;

export const selectCurrentQuery = (state: RootState) => {
  const currentHistoryObj = state.history.historyList.find(
    (historyObj) => historyObj.id == state.history.currentHistoryId
  );

  return currentHistoryObj?.name || "";
};

export const selectCurrentProducts = (state: RootState) => {
  const CurrentProducts = state.history.historyList.find(
    (historyObj) => historyObj.id == state.history.currentHistoryId
  )?.products;

  if (CurrentProducts) {
    return CurrentProducts;
  } else return [];
};

export const selectCurrentQuestions = (state: RootState) => {
  const CurrentQuestions = state.history.historyList.find(
    (historyObj) => historyObj.id == state.history.currentHistoryId
  )?.questions;
  if (CurrentQuestions) {
    return CurrentQuestions;
  } else return [];
};

export const selectAllQuestionsAnswered = (state: RootState) => {
  const currentHistoryObj = state.history.historyList.find(
    (history) => history.id === state.history.currentHistoryId
  );

  if (!currentHistoryObj) return false;

  return currentHistoryObj.questions.every((question) => {
    return (
      question.answers.some((answer) => answer.selected) ||
      question.other.length !== 0
    );
  });
};
