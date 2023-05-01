import { Typography, TextField, Button, Snackbar, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/user";
import { useMutation } from "@tanstack/react-query";
import { useSelector, useDispatch } from "react-redux";
import {
  updateUsername,
  updatePassword,
  setUsernameError,
  setPasswordError,
  setMainError,
  setCurrentUser,
  setToken,
} from "./features/loginSlice";
import { setNotification } from "../Signup/features/signUpSlice";
import React from "react";

interface State {
  login: {
    username: string;
    password: string;
    usernameError: string;
    passwordError: string;
    mainError: string;
  };
  signup: {
    notification: string;
  };
}

interface submitCredentials {
  credentials: string;
  navigate: any;
}

const Login = () => {
  const navigate = useNavigate();
  const username = useSelector((state: State) => state.login.username);
  const password = useSelector((state: State) => state.login.password);
  const usernameError = useSelector(
    (state: State) => state.login.usernameError
  );
  const passwordError = useSelector(
    (state: State) => state.login.passwordError
  );
  const mainError = useSelector((state: State) => state.login.mainError);
  const userCreated = useSelector((state: State) => state.signup.notification);
  const dispatch = useDispatch();

  const submitLogin = useMutation({
    mutationFn: ({ credentials, navigate }: submitCredentials) =>
      login(credentials, navigate),
    onSuccess: (data) => {
      console.log("success??");
      dispatch(setCurrentUser(data));
      dispatch(setToken(data.token));
      dispatch(updateUsername(""));
      dispatch(updatePassword(""));
      dispatch(setNotification(null));
      dispatch(setUsernameError(null));
      dispatch(setPasswordError(null));
      dispatch(setMainError(null));
    },
    retry: false,
    onError: (err) => {
      dispatch(setMainError(err));
    },
  });

  const handleClose = () => {
    dispatch(setMainError(null));
    dispatch(setNotification(null));
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    document.cookie = "access_token= ; max-age=0";
    !username
      ? dispatch(setUsernameError("Username is required"))
      : dispatch(setUsernameError(null));
    !password
      ? dispatch(setPasswordError("Password is required"))
      : dispatch(setPasswordError(null));
    if (username && password) {
      const credentials: string = JSON.stringify({
        username: username,
        password: password,
      });
      submitLogin.mutate({ credentials, navigate });
    }
  };
  return (
    <form className="center">
      <div className="page-width-form center">
        <Typography
          variant="h2"
          component="h1"
          textAlign="center"
          sx={{ m: 4 }}
        >
          Log In
        </Typography>
        {mainError && (
          <Snackbar
            open={mainError ? true : false}
            onClose={handleClose}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert severity="error" onClose={handleClose}>
              {mainError}
            </Alert>
          </Snackbar>
        )}
        {userCreated && (
          <Snackbar
            open={userCreated ? true : false}
            onClose={handleClose}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert severity="success" onClose={handleClose}>
              {userCreated}
            </Alert>
          </Snackbar>
        )}
        <TextField
          error={usernameError !== null}
          helperText={usernameError}
          fullWidth
          value={username}
          name="username"
          onChange={(e) => dispatch(updateUsername(e.target.value))}
          size="small"
          label="Username"
          type="text"
          sx={{ m: 1 }}
        />
        <TextField
          error={passwordError !== null}
          helperText={passwordError}
          fullWidth
          value={password}
          name="password"
          onChange={(e) => dispatch(updatePassword(e.target.value))}
          size="small"
          label="Password"
          type="password"
          autoComplete="new-password"
          sx={{ m: 1 }}
        />
        <Button
          type="submit"
          onClick={handleSubmit}
          variant="contained"
          fullWidth
          sx={{ m: 1 }}
        >
          Sign In
        </Button>
        <Typography variant="body1" sx={{ m: 1 }}>
          Don't have an account yet?
        </Typography>
        <Button
          variant="outlined"
          type="button"
          onClick={() => navigate("/signup")}
          sx={{ m: 1 }}
        >
          Sign up
        </Button>
      </div>
    </form>
  );
};

export default Login;
