import { createSlice } from "@reduxjs/toolkit";

export const NavSlice = createSlice({
  name: "nav",
  initialState: {
    theme: localStorage.getItem("theme") || "dark",
    onlineFriends: [],
  },
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setOnlineFriends: (state, action) => {
      state.onlineFriends = action.payload;
    },
  },
});

export const { setTheme, setOnlineFriends } = NavSlice.actions;
export const navReducer = NavSlice.reducer;
