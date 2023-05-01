import { configureStore } from "@reduxjs/toolkit";
import { loginReducer } from "./pages/Login/features/loginSlice";
import { signUpReducer } from "./pages/Signup/features/signUpSlice";
import { messageReducer } from "./pages/Messages/features/messagesSlice";
import { homeReducer } from "./pages/Home/features/homeSlice";
import { profileReducer } from "./pages/Profile/features/profileSlice";
import { navReducer } from "./components/Nav/features/navSlice";

const store = configureStore({
  reducer: {
    login: loginReducer,
    signup: signUpReducer,
    messages: messageReducer,
    home: homeReducer,
    profile: profileReducer,
    nav: navReducer,
  },
});

export default store;
