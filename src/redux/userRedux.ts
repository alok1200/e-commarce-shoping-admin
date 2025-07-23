import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the shape of a user object
export interface CurrentUserType {
  _id: string;
  username?: string;
  email?: string;
  isAdmin?: boolean;
  [key: string]: any; // add flexibility for extra fields
}

// Define the slice state
interface UserState {
  currentUser: CurrentUserType | null;
  isFetching: boolean;
}

// Initial state
const initialState: UserState = {
  currentUser: null,
  isFetching: false,
};

// Create slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    start: (state) => {
      state.isFetching = true;
    },
    loginSuccess: (state, action: PayloadAction<CurrentUserType>) => {
      state.isFetching = false;
      state.currentUser = action.payload;
    },
    loginFailed: (state) => {
      state.isFetching = false;
      state.currentUser = null;
    },
    logoutUser: (state) => {
      state.currentUser = null;
      localStorage.clear();
    },
  },
});

// Export actions and reducer
export const { start, loginSuccess, loginFailed, logoutUser } =
  userSlice.actions;
export default userSlice.reducer;
