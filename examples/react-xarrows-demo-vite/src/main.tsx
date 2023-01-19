import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import BundleApp from "./BundleApp";
import { createTheme, ThemeProvider } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#ad00cc",
    },
    secondary: {
      main: "#edf2ff",
    },
  },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
    {/*<BundleApp />*/}
  </React.StrictMode>
);
