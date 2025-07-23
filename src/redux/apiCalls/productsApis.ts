import { Dispatch } from "@reduxjs/toolkit";
import { req } from "../../axiosReqMethods";
import { editProduct, addProducts } from "../Products";
import { setError } from "../MessageRedux";

// Define the structure of a Product (customize as needed)
export interface ProductType {
  _id?: string;
  title: string;
  price: number;
  desc?: string;
  categories?: string[];
  color?: string[];
  size?: string[];
  inStock?: boolean;
  active?: boolean;
  [key: string]: any; // Allow extra properties
}

export const editProductapi = async (
  dispatch: Dispatch,
  product: ProductType,
  setIsOpen: (val: boolean) => void
): Promise<void> => {
  try {
    const res = await req.put(`/api/products/${product._id}`, product);
    dispatch(editProduct(res?.data));
    dispatch(setError("Product updated successfully"));
    setIsOpen(false);
  } catch (error: any) {
    dispatch(
      setError(error?.response?.data?.message || "Failed to update product")
    );
    console.error(error);
  }
};

export const addProductapi = async (
  dispatch: Dispatch,
  product: ProductType,
  setIsOpen: (val: boolean) => void
): Promise<void> => {
  try {
    const res = await req.post(`/api/products`, product);
    dispatch(addProducts(res?.data));
    dispatch(setError("Product added successfully"));
    setIsOpen(false);
  } catch (error: any) {
    dispatch(
      setError(error?.response?.data?.message || "Failed to add product")
    );
    console.error(error);
  }
};
