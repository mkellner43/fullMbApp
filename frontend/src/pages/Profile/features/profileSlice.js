import { createSlice } from "@reduxjs/toolkit";

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    avatarModule: false,
    selectedImage: false,
    userProfile: null,
  },
  reducers: {
    setAvatarModule: (state, action) => {
      state.avatarModule = action.payload;
    },
    setSelectedImage: (state, action) => {
      state.selectedImage = action.payload;
    },
    setUserProfile: (state, action) => {
      state.userProfile = action.payload;
    },
  },
});

export const { setAvatarModule, setSelectedImage, setUserProfile } =
  profileSlice.actions;
export const profileReducer = profileSlice.reducer;
