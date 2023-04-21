import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Provider } from "react-redux";
import "./styles-base/index.scss";
import App from "./App";
import store from "./store";
import axios from "axios";
axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;
axios.defaults.headers = { "Content-Type": "application/json" };
axios.defaults.withCredentials = true;

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <React.StrictMode>
        <QueryClientProvider client={queryClient}>
          <App />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </React.StrictMode>
    </BrowserRouter>
  </Provider>
);
