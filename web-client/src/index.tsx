import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import AppRouter from "router";
import CssBaseline from "@material-ui/core/CssBaseline";
import ChinaExchangeApiClient from "api/common/ChinaExchangeApiClient";
import { ThemeProvider } from "@material-ui/core/styles";
import "index.scss";
import { defaultTheme } from "./themes/theme";
import "./i18n";

ChinaExchangeApiClient.accessToken = localStorage.getItem("accessToken");
ReactDOM.render(
  <React.StrictMode>
    <Suspense fallback="loading data">
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        <AppRouter />
      </ThemeProvider>
    </Suspense>
  </React.StrictMode>,
  document.getElementById("root")
);
