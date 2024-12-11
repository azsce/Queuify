"use client";
import React, { useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material";

interface LoadingProps {
  children: React.ReactNode;
}

const Loading: React.FC<LoadingProps> = ({ children }) => {
  const theme = useTheme();
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    if (theme) {
      setLoading(false);
    }
  }, [theme]);
  let c = null;
  if (loading) {
    c = (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  } else {
    c = children;
  }
  return c;
};

export default Loading;
