"use client";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material";
import { useTheme as nextUseTheme } from "next-themes";

interface LoadingProps {
  children: React.ReactNode;
}

const Loading: React.FC<LoadingProps> = ({ children }) => {
  const theme = useTheme();
  const { theme: nextTheme } = nextUseTheme();

  const backgroundColor = nextTheme === "dark" ? "#000" : "#eee";

  if (nextTheme && theme) {
    return (
      <Box
        sx={{
          backgroundColor: backgroundColor,
        }}
      >
        {children}
      </Box>
    );
  } else {
    return null;
  }
};

export default Loading;
