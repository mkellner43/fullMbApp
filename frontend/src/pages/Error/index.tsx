import React from "react";
import "./style/style.scss";
import { Button } from "@mui/material";

const Error = ({ error, resetErrorBoundary }) => {
  return (
    <div className="error-container">
      <h1 className="header">OOPS</h1>
      <div className="message">{error.message}</div>
      <Button
        className="btn"
        variant={"outlined"}
        color="error"
        onClick={resetErrorBoundary}
      >
        Reset
      </Button>
    </div>
  );
};

export default Error;
