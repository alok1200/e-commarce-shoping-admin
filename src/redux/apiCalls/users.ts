import { req } from "../../axiosReqMethods";
import {
  fetchStart,
  fetchFailed,
  fetchSuccess,
  reserError,
  updateUserRedux,
} from "../UseersComponentRedux";
import { setError } from "../MessageRedux";

// Define types for user data and query parameters
interface QueryParams {
  [key: string]: string | number;
}

interface UserType {
  _id?: string;
  name?: string;
  email?: string;
  isAdmin?: boolean;
  [key: string]: any;
}

export const fetchUsers = async (
  dispatch: Dispatch,
  querie: QueryParams
): Promise<void> => {
  dispatch(fetchStart());
  try {
    const queryString = new URLSearchParams(
      querie as Record<string, string>
    ).toString();
    const users = await req.get(`/api/users/allinfo?${queryString}`);
    dispatch(fetchSuccess(users?.data));
  } catch (error: any) {
    dispatch(fetchFailed(error?.response?.data));
    setTimeout(() => {
      dispatch(reserError());
    }, 5000);
  }
};

export const updateUser = async (
  dispatch: Dispatch,
  userID: string,
  data: Partial<UserType>
): Promise<any> => {
  try {
    const res = await req.put(`/api/users/${userID}`, data);
    dispatch(setError("User updated successfully"));
    dispatch(updateUserRedux(res?.data));
    return res;
  } catch (err: any) {
    dispatch(setError(err?.response?.data?.message || "Failed to update user"));
    console.log(`Error is:`, err);
  }
};
