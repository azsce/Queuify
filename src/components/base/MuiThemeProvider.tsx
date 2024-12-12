"use client";

import nextJsDarkTheme from "@/theme/nextJsDarkTheme";
import nextJsTheme from "@/theme/nextJsTheme";
import { Box, ThemeProvider } from "@mui/material";
import { useTheme } from "next-themes";
import React, { useMemo } from "react";

type MuiThemeProviderProps = Readonly<{
  children: React.ReactNode;
  defaultMode?: "light" | "dark" | "system";
}>;

const darkTheme = nextJsDarkTheme;

const lightTheme = nextJsTheme;

const MuiThemeProvider: React.FC<MuiThemeProviderProps> = ({ children }) => {
  const { theme } = useTheme();
  const muiTheme = useMemo(() => {
    if (theme === "dark") {
      return darkTheme;
    } else if (theme === "light") {
      return lightTheme;
    }
  }, [theme]);

  if (!theme || !muiTheme) {
    return null;
  }

  return (
    <ThemeProvider theme={muiTheme}>
      <Box sx={{ backgroundColor: "background.default" }}>{children}</Box>
    </ThemeProvider>
  );
};

export default MuiThemeProvider;
