import React, { useState } from "react";
import { IconButton, useTheme } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// DarkModeToggle component
const DarkModeToggle: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);

  // Toggle between dark and light mode
  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  const handleToggle = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <IconButton onClick={handleToggle} color="inherit">
        {darkMode ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
    </ThemeProvider>
  );
};

export default DarkModeToggle;
