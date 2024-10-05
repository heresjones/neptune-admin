import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Brightness4Icon from "@mui/icons-material/Brightness4"; // Moon icon for dark mode
import Brightness7Icon from "@mui/icons-material/Brightness7"; // Sun icon for light mode
import DashboardIcon from "@mui/icons-material/Dashboard";
import PublicIcon from "@mui/icons-material/Public"; // For heatmap or geography
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import UserTable from "./pages/UserTable";
import MapWithHeatmap from "./pages/MapWithHeatmap";
import type { Navigation } from "@toolpad/core";

// Custom colors and fonts
const customColors = {
  moodyBlue: "#40CFE2",
  moodyDarkBackground: "#0f1719",
  moodyWhite: "#FFFFFF",
  darkButtonHover: "#3DAFB7",
};

const customFont = "'Poppins', sans-serif";

// Navigation with updated relevant icons
const NAVIGATION: Navigation = [
  {
    kind: "header",
    title: "Main items",
  },
  {
    kind: "page",
    segment: "users",
    title: "User Data",
    icon: <DashboardIcon sx={{ color: customColors.moodyBlue }} />,
  },
  {
    kind: "page",
    segment: "map",
    title: "HeatMap",
    icon: <PublicIcon sx={{ color: customColors.moodyBlue }} />,
  },
];

export default function DashboardLayoutSlots() {
  // Persist dark mode in localStorage
  const storedDarkMode = localStorage.getItem("darkMode") === "true";
  const [darkMode, setDarkMode] = useState(storedDarkMode);

  // Sync dark mode with localStorage on change
  useEffect(() => {
    localStorage.setItem("darkMode", String(darkMode));
  }, [darkMode]);

  // Dynamic theme switching based on dark mode state
  const demoTheme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      background: {
        default: darkMode
          ? customColors.moodyDarkBackground
          : customColors.moodyWhite,
      },
      text: {
        primary: darkMode
          ? customColors.moodyWhite
          : customColors.moodyDarkBackground,
      },
    },
    typography: {
      fontFamily: customFont,
    },
  });

  // Toggle function for dark mode
  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
  };

  // CSS override to ensure the logo is removed
  const removeLogoStyle = {
    ".MuiAppBar-root .MuiToolbar-root img": {
      display: "none", // Hides any img tag in the toolbar (default logo)
    },
  };

  return (
    <Router>
      <AppProvider
        navigation={NAVIGATION}
        theme={demoTheme}
        branding={{
          title: "Neptune Admin",
          logo: null,
        }}
      >
        <ThemeProvider theme={demoTheme}>
          <Box sx={removeLogoStyle}>
            <DashboardLayout
              slots={{
                // Toolbar slot includes dark mode toggle with sun/moon icons
                toolbarActions: () => (
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography sx={{ fontFamily: customFont, mr: 2 }}>
                      Neptune Admin
                    </Typography>
                    {/* Dark Mode Toggle Button */}
                    <IconButton onClick={handleDarkModeToggle} color="inherit">
                      {darkMode ? (
                        <Brightness7Icon /> // Sun icon for light mode
                      ) : (
                        <Brightness4Icon /> // Moon icon for dark mode
                      )}
                    </IconButton>
                  </Box>
                ),
              }}
            >
              {/* Routing for different pages */}
              <Routes>
                <Route path="/users" element={<UserTable />} />
                <Route path="/map" element={<MapWithHeatmap />} />
                <Route path="*" element={<Navigate to="/users" replace />} />
              </Routes>
            </DashboardLayout>
          </Box>
        </ThemeProvider>
      </AppProvider>
    </Router>
  );
}
