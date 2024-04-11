import { fetchProducts } from "@/api/useFetch";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";

export type ProductType = {
  title: string;
  imgLink: string;
  bullets: string[];
  description: string | null;
  reviews: string[];
  price: string;
  reviewScore: number;
  numReviews: string;
};

export interface ProductState {
  productList: ProductType[];
  selected: number | null;
  status: "idle" | "loading" | "failed";
}

const initialState: ProductState = {
  productList: [],
  selected: null,
  status: "idle",
};

export const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProductList: (state, action: PayloadAction<ProductType[]>) => {
      state.productList = action.payload;
    },
    setSelected: (state, action: PayloadAction<number | null>) => {
      state.selected = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(productsAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(productsAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.productList = action.payload;
      })
      .addCase(productsAsync.rejected, (state) => {
        state.status = "failed";
      });
  },
});

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const productsAsync = createAsyncThunk(
  "products/fetchProducts",
  async (body: JSON) => {
    await delay(1000 * Math.random());
    const response = await fetchProducts(body);
    return response;
  }
);

export const { setProductList, setSelected } = productSlice.actions;

export const selectProductList = (state: RootState) =>
  state.products.productList;
export const selectStatus = (state: RootState) => state.products.status;
export const selectSelected = (state: RootState) => state.products.selected;

export default productSlice.reducer;

