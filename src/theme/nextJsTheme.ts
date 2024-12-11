import { createTheme } from "@mui/material/styles";

const nextJsTheme = createTheme({
  palette: {
    mode: "light", // Switch to 'dark' if you prefer the dark mode look of Next.js.
    primary: {
      main: "#000", // Next.js signature blue color
    },
    secondary: {
      main: "#333333", // A dark grey for contrast
    },
    background: {
      default: "#f0f0f0", // White background
      paper: "#dcdbdb", // Slightly grey for elevated surfaces
    },
    text: {
      primary: "#333333", // Dark grey for readability
      secondary: "#666666", // Lighter grey for less emphasis
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
        },
      },
    },

    
  },
});

export default nextJsTheme;
