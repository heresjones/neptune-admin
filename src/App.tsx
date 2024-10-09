import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PublicIcon from "@mui/icons-material/Public";
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
import LoginScreen from "./pages/LoginScreen";
import type { Navigation } from "@toolpad/core";
import SignupChart from "./pages/SignupChart"; // Import the new chart page

const customColors = {
  moodyBlue: "#40CFE2",
  moodyDarkBackground: "#0f1719",
  moodyWhite: "#FFFFFF",
  darkButtonHover: "#3DAFB7",
};

const customFont = "'Poppins', sans-serif";

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
    segment: "chart",
    title: "Signup Chart",
    icon: <DashboardIcon sx={{ color: customColors.moodyBlue }} />,
  },
  {
    kind: "page",
    segment: "map",
    title: "HeatMap(under construction)",
    icon: <PublicIcon sx={{ color: customColors.moodyBlue }} />,
  },
];

export default function DashboardLayoutSlots() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const storedDarkMode = localStorage.getItem("darkMode") === "true";
  const [darkMode, setDarkMode] = useState(storedDarkMode);

  useEffect(() => {
    localStorage.setItem("darkMode", String(darkMode));
  }, [darkMode]);

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

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", "true");
  };

  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated") === "true";
    setIsAuthenticated(authStatus);
  }, []);

  const removeLogoStyle = {
    ".MuiAppBar-root .MuiToolbar-root img": {
      display: "none",
    },
  };

  if (!isAuthenticated) {
    return (
      <ThemeProvider theme={demoTheme}>
        <LoginScreen onLogin={handleLoginSuccess} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={demoTheme}>
      <Router>
        <AppProvider
          navigation={NAVIGATION}
          branding={{
            title: "Neptune Admin",
            logo: null,
          }}
        >
          <Box sx={removeLogoStyle}>
            <DashboardLayout
              slots={{
                toolbarActions: () => (
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <IconButton onClick={handleDarkModeToggle} color="inherit">
                      {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>
                  </Box>
                ),
              }}
            >
              <Routes>
                <Route path="/users" element={<UserTable />} />
                <Route path="/map" element={<MapWithHeatmap />} />
                <Route path="/chart" element={<SignupChart />} />
                <Route path="*" element={<Navigate to="/users" replace />} />
              </Routes>
              ;
            </DashboardLayout>
          </Box>
        </AppProvider>
      </Router>
    </ThemeProvider>
  );
}
