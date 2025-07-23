import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define a type for the User object
export interface UserType {
  _id: string;
  name?: string;
  email?: string;
  phone?: string;
  [key: string]: any; // For flexibility if your user object has more fields
}

// Define a type for the state
interface UserState {
  fetchedUsers: UserType[];
  isFetching: boolean;
  isError: boolean;
  error: string | null;
}

// Initial state
const initialState: UserState = {
  fetchedUsers: [],
  isFetching: false,
  isError: false,
  error: null,
};

// Create slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    fetchStart: (state) => {
      state.isFetching = true;
      state.isError = false;
      state.error = null;
    },
    fetchSuccess: (state, action: PayloadAction<UserType[]>) => {
      state.fetchedUsers = action.payload;
      state.isFetching = false;
      state.isError = false;
      state.error = null;
    },
    fetchFailed: (state, action: PayloadAction<string>) => {
      state.isFetching = false;
      state.error = action.payload;
      state.isError = true;
    },
    reserError: (state) => {
      state.isError = false;
      state.error = null;
    },
    clearUsers: (state) => {
      state.fetchedUsers = [];
      state.isFetching = false;
      state.isError = false;
      state.error = null;
    },
    deleteUser: (state, action: PayloadAction<string>) => {
      state.fetchedUsers = state.fetchedUsers.filter(
        (u) => u._id !== action.payload
      );
    },
    updateUserRedux: (state, action: PayloadAction<UserType>) => {
      state.fetchedUsers.forEach((value, index) => {
        if (value._id === action.payload._id) {
          state.fetchedUsers[index] = action.payload;
        }
      });
    },
  },
});

export const {
  fetchStart,
  fetchFailed,
  fetchSuccess,
  reserError,
  clearUsers,
  updateUserRedux,
  deleteUser,
} = userSlice.actions;

export default userSlice.reducer;
