"use client";

import { createTheme, ThemeProvider } from "@mui/material";
import React from "react";

type MuiThemeProviderProps = Readonly<{
  children: React.ReactNode;
  defaultMode?: "light" | "dark" | "system";
}>;

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const lightTheme = createTheme({
  palette: {
    mode: "light",
  },
});

const MuiThemeProvider: React.FC<MuiThemeProviderProps> = ({
  children,
  defaultMode = "dark",
}) => {
  const theme = defaultMode === "light" ? lightTheme : darkTheme;

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default MuiThemeProvider;
