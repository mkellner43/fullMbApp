import { createSlice } from "@reduxjs/toolkit";

export const NavSlice = createSlice({
  name: 'nav',
  initialState: {
    theme: localStorage.getItem('theme') || 'dark'
  },
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload
    }
  }
})

export const { setTheme } = NavSlice.actions;
export const navReducer = NavSlice.reducer;