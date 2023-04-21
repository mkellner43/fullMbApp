import { createSlice } from "@reduxjs/toolkit";

export const homeSlice = createSlice({
  name: "home",
  initialState: {
    mainError: null,
  },
  reducers: {
    setMainError: (state, action) => {
      state.mainError = action.payload;
    },
    removeMainError: (state) => {
      state.mainError = null;
    },
  },
});

export const { setMainError, removeMainError } = homeSlice.actions;

export const homeReducer = homeSlice.reducer;
