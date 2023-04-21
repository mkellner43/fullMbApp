import { createSlice } from "@reduxjs/toolkit";

export const loginSlice = createSlice({
  name: "login",
  initialState: {
    username: "",
    password: "",
    usernameError: null,
    passwordError: null,
    mainError: null,
    token: document.cookie.split("=")[1],
    currentUser: JSON.parse(sessionStorage.getItem("user")),
  },
  reducers: {
    updateUsername: (state, action) => {
      state.username = action.payload;
    },
    updatePassword: (state, action) => {
      state.password = action.payload;
    },
    setUsernameError: (state, action) => {
      state.usernameError = action.payload;
    },
    setPasswordError: (state, action) => {
      state.passwordError = action.payload;
    },
    setMainError: (state, action) => {
      state.mainError = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    updateCurrentUserAvatar: (state, action) => {
      state.currentUser = { ...state.currentUser, avatar: action.payload };
    },
  },
});

export const {
  updateUsername,
  updatePassword,
  setPasswordError,
  setUsernameError,
  setMainError,
  setToken,
  setCurrentUser,
  logOut,
} = loginSlice.actions;

export const loginReducer = loginSlice.reducer;
