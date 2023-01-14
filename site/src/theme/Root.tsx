import React from "react";
import { ThemeProvider } from "@mui/material";
import theme from "../customization/theme";

// Default implementation, that you can customize
export default function Root({ children }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
