import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Announcement {
  _id: string;
  title?: string;
  content?: string;
  createdAt?: number;
  updatedAt?: number;
  active?: boolean;
  [key: string]: any; // In case there are other dynamic fields
}

interface AnnouncementState {
  announcements: Announcement[];
  error: string | null;
}

const initialState: AnnouncementState = {
  announcements: [],
  error: null,
};

const announcementslice = createSlice({
  name: "announcements",
  initialState,
  reducers: {
    fetchannouncements: (state, action: PayloadAction<Announcement[]>) => {
      state.announcements = action.payload;
    },
    addannouncements: (state, action: PayloadAction<Announcement>) => {
      const todayDate = Date.now();
      const newAnnouncement = {
        ...action.payload,
        createdAt: todayDate,
        updatedAt: todayDate,
      };
      state.announcements = [...state.announcements, newAnnouncement];
    },
    removeAnnoucment: (state, action: PayloadAction<string>) => {
      state.announcements = state.announcements.filter(
        (a) => a._id !== action.payload
      );
    },
    editAnnoucment: (state, action: PayloadAction<Announcement>) => {
      state.announcements.forEach((a, index) => {
        if (action.payload.active === true) {
          state.announcements[index].active = false;
        }
        if (a._id === action.payload._id) {
          state.announcements[index] = action.payload;
        }
      });
    },
    disableAllAnnoucments: (state) => {
      state.announcements.forEach((i) => {
        i.active = false;
      });
    },
  },
});

export const {
  addannouncements,
  fetchannouncements,
  removeAnnoucment,
  editAnnoucment,
  disableAllAnnoucments,
} = announcementslice.actions;

export default announcementslice.reducer;
