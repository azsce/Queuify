import { createTheme } from "@mui/material/styles";

const nextJsDarkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#FFF", // Next.js signature blue color
    },
    secondary: {
      main: "#eaeaea", // Light grey for contrast
    },
    background: {
      default: "#000000", // Black background
      paper: "#121212", // Darker grey for elevated surfaces
    },
    text: {
      primary: "#ffffff", // White text for high contrast
      secondary: "#aaaaaa", // Light grey for less emphasis
    },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    fontSize: 14, // Default font size
    h1: {
      fontSize: "2.25rem",
      fontWeight: 600,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 600,
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 500,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
    },
    button: {
      textTransform: "none", // Avoid uppercase for buttons
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6, // Rounded corners for buttons
          textTransform: "none", // Avoid uppercase
        },
        contained: {
          backgroundColor: "#111",
          color: "#ffffff",
          "&:hover": {
            backgroundColor: "#000",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Rounded corners for cards and paper components
          backgroundColor: "#121212", // Match dark paper color
        },
      },
    },
  },
});

export default nextJsDarkTheme;
