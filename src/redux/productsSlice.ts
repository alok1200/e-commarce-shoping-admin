import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Product {
  _id: string;
  [key: string]: any; // You can replace `any` with specific fields like name, price, etc.
}

interface ProductsState {
  products: Product[] | null;
}

const initialState: ProductsState = {
  products: null,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
    addProducts: (state, action: PayloadAction<Product>) => {
      state.products = state.products
        ? [...state.products, action.payload]
        : [action.payload];
    },
    clearProducts: (state) => {
      state.products = null;
    },
    editProduct: (state, action: PayloadAction<Product>) => {
      if (!state.products) return;
      state.products.forEach((element, index) => {
        if (element._id === action.payload._id) {
          state.products![index] = action.payload;
        }
      });
    },
    deleteProduct: (state, action: PayloadAction<string>) => {
      if (!state.products) return;
      state.products = state.products.filter((p) => p._id !== action.payload);
    },
  },
});

export const {
  setProducts,
  clearProducts,
  editProduct,
  addProducts,
  deleteProduct,
} = productsSlice.actions;
export default productsSlice.reducer;
