import CssBaseline from "@mui/material/CssBaseline";
import { Routes, Route } from "react-router-dom";
import { SocketProvider } from "./context/SocketProvider";
import { useSelector } from "react-redux";
import Error from "./pages/Error/index.tsx";
import Home from "./pages/Home/index.tsx";
import Nav from "./components/Nav";
import Profile from "./pages/Profile";
import Friends from "./pages/Friends/index.tsx";
import Messages from "./pages/Messages";
import Notifications from "./pages/Notifications";
import Login from "./pages/Login/index.tsx";
import Signup from "./pages/Signup";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { ErrorBoundary } from "react-error-boundary";

const App = () => {
  const currentUser = useSelector((state) => state.login.currentUser);
  const token = useSelector((state) => state.login.token);
  const theme = useSelector((state) => state.nav.theme);
  const darkTheme = createTheme({
    palette: {
      mode: theme,
    },
  });

  if (darkTheme.palette.mode === "light") {
    let root = document.querySelector(":root");
    root.style.setProperty("--color", "rgba(0, 0, 0, 0.12)");
    root.style.setProperty("--background", "#fff");
    root.style.setProperty("--modal-text", "#121212");
  } else {
    let root = document.querySelector(":root");
    root.style.setProperty("--color", "#dee4e7");
    root.style.setProperty("--background", "#121212");
    root.style.setProperty("--modal-text", "#fff");
  }

  if (!token || currentUser?.token !== token)
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Routes>
          <Route element={<Login />} path="/login" />
          <Route element={<Signup />} path="/signup" />
          <Route element={<Login />} path="*" />
        </Routes>
      </ThemeProvider>
    );

  return (
    <ErrorBoundary FallbackComponent={Error}>
      <SocketProvider value={currentUser?.id}>
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <Nav currentUser={currentUser} />
          <Routes>
            <Route element={<Home currentUser={currentUser} />} path="/" />
            <Route
              element={<Profile currentUser={currentUser} />}
              path="/profile/:id"
            />
            <Route
              element={<Friends currentUser={currentUser} />}
              path="/friends"
            />
            <Route
              element={<Messages currentUser={currentUser} />}
              path="/messages"
            />
            <Route
              element={<Notifications currentUser={currentUser} />}
              path="/notifications"
            />
            <Route element={<Home currentUser={currentUser} />} path="*" />
          </Routes>
        </ThemeProvider>
      </SocketProvider>
    </ErrorBoundary>
  );
};

export default App;

// Tech to learn: TypeScript, Tailwind, GraphQL, Redis, React Native

// learn how to store files on web server through URLs although s3 is probably a better solution

// prod is a pain in my dick
// get docker working for prod
// get working in prod env -- then get working in AWS or another free service? Maybe GCP?

// add fake data and filter what user can see by friends and set defaults

// add search bar to search posts / people based on filter

// just reseeded data - ensure everything still is in working order if so, read note 1 time to learn so more (: <3 I know you are tired, but lets do it!
