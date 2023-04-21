import { createSlice } from "@reduxjs/toolkit";

export const signUpSlice = createSlice({
  name: "signup",
  initialState: {
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    firstNameError: null,
    lastNameError: null,
    usernameError: null,
    passwordError: null,
    mainError: null,
    notification: null,
  },
  reducers: {
    updateFirstName: (state, action) => {
      state.firstName = action.payload;
    },
    updateLastName: (state, action) => {
      state.lastName = action.payload;
    },
    updateUsername: (state, action) => {
      state.username = action.payload;
    },
    updatePassword: (state, action) => {
      state.password = action.payload;
    },
    setFirstNameError: (state, action) => {
      state.firstNameError = action.payload;
    },
    setLastNameError: (state, action) => {
      state.lastNameError = action.payload;
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
    setNotification: (state, action) => {
      state.notification = action.payload;
    },
  },
});

export const {
  updateFirstName,
  updateLastName,
  updateUsername,
  updatePassword,
  setFirstNameError,
  setLastNameError,
  setPasswordError,
  setUsernameError,
  setMainError,
  setNotification,
} = signUpSlice.actions;

export const signUpReducer = signUpSlice.reducer;
