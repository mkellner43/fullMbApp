import { useNavigate } from "react-router-dom";
import { Typography, TextField, Button, Alert, Snackbar } from "@mui/material";
import { createUser } from "../../api/user";
import { useMutation } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import {
  updateUsername,
  updateFirstName,
  updateLastName,
  updatePassword,
  setFirstNameError,
  setLastNameError,
  setPasswordError,
  setUsernameError,
  setMainError,
  setNotification,
} from "./features/signUpSlice";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const username = useSelector((state) => state.signup.username);
  const usernameError = useSelector((state) => state.signup.usernameError);
  const password = useSelector((state) => state.signup.password);
  const passwordError = useSelector((state) => state.signup.passwordError);
  const firstName = useSelector((state) => state.signup.firstName);
  const firstNameError = useSelector((state) => state.signup.firstNameError);
  const lastName = useSelector((state) => state.signup.lastName);
  const lastNameError = useSelector((state) => state.signup.lastNameError);
  const error = useSelector((state) => state.signup.mainError);

  const submitNewUser = useMutation({
    mutationFn: ({ data }) => createUser(data),
    onSuccess: () => {
      dispatch(updateFirstName(""));
      dispatch(updateLastName(""));
      dispatch(updatePassword(""));
      dispatch(updateUsername(""));
      dispatch(setFirstNameError(null));
      dispatch(setLastNameError(null));
      dispatch(setPasswordError(null));
      dispatch(setUsernameError(null));
      dispatch(setMainError(null));
      dispatch(setNotification("User successfully created! Please log in."));
      navigate("/login");
    },
    onError: (err) => {
      dispatch(setMainError(err));
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validation()) {
      const data = JSON.stringify({
        username: username,
        password: password,
        first_name: firstName,
        last_name: lastName,
      });
      submitNewUser.mutate({ data });
    }
  };

  const validation = () => {
    dispatch(setUsernameError(null));
    dispatch(setPasswordError(null));
    dispatch(setFirstNameError(null));
    dispatch(setLastNameError(null));
    !username && dispatch(setUsernameError("Username is required"));
    !password && dispatch(setPasswordError("Password is required"));
    !firstName && dispatch(setFirstNameError("First name is required"));
    !lastName && dispatch(setLastNameError("Last name is required"));
    if (username && password && firstName && lastName) return true;
    return false;
  };

  const handleClose = () => {
    dispatch(setMainError());
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
          Sign Up
        </Typography>
        {error && (
          <Snackbar
            open={error ? true : false}
            onClose={handleClose}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert severity="error" onClose={handleClose}>
              {error}
            </Alert>
          </Snackbar>
        )}
        <TextField
          error={firstNameError !== null}
          helperText={firstNameError}
          fullWidth
          value={firstName}
          name="first-name"
          onChange={(e) => dispatch(updateFirstName(e.target.value))}
          size="small"
          label="First Name"
          type="text"
          sx={{ m: 1 }}
        />
        <TextField
          error={lastNameError !== null}
          helperText={lastNameError}
          fullWidth
          value={lastName}
          name="last-name"
          onChange={(e) => dispatch(updateLastName(e.target.value))}
          size="small"
          label="Last Name"
          type="text"
          sx={{ m: 1 }}
        />
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
          Create Account
        </Button>
        <Typography variant="body1" sx={{ m: 1 }}>
          Already have an account?
        </Typography>
        <Button
          sx={{ m: 1 }}
          variant="outlined"
          type="button"
          onClick={() => navigate("/login")}
        >
          Log In
        </Button>
      </div>
    </form>
  );
};

export default Signup;
