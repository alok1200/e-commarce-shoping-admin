import { Dispatch } from "@reduxjs/toolkit";
import { publicreq } from "../../axiosReqMethods";
import { loginFailed, start, loginSuccess } from "../userRedux";
import { setError } from "../MessageRedux";

// Define the expected user login input
interface LoginPayload {
  email: string;
  password: string;
}

// Define the response shape if needed
interface LoginResponse {
  _id: string;
  username?: string;
  email: string;
  isAdmin: boolean;
  token: string;
  [key: string]: any; // Add flexibility for extra fields
}

export const login = async (
  dispatch: Dispatch,
  user: LoginPayload
): Promise<void> => {
  const { email, password } = user;
  dispatch(start());
  try {
    const res = await publicreq.post<LoginResponse>("api/auth/login", {
      email,
      password,
      forAdmin: true,
    });
    dispatch(loginSuccess(res.data));
  } catch (error: any) {
    dispatch(loginFailed());
    dispatch(setError(error?.response?.data?.message || "Login failed"));
  }
};
