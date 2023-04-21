import { createSlice } from "@reduxjs/toolkit";

export const messagesSlice = createSlice({
  name: "messages",
  initialState: {
    friend: null,
    message: "",
    search: "",
    searchResults: [],
    typing: false,
  },
  reducers: {
    setFriend: (state, action) => {
      state.friend = action.payload;
    },
    setMessage: (state, action) => {
      state.message = action.payload;
    },
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    setSearchResults: (state, action) => {
      state.searchResults = action.payload;
    },
    setTyping: (state, action) => {
      state.typing = action.payload;
    },
  },
});

export const { setFriend, setMessage, setSearch, setSearchResults, setTyping } =
  messagesSlice.actions;

export const messageReducer = messagesSlice.reducer;
