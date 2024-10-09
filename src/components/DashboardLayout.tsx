import React, { useState } from "react";
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useTheme,
  Switch,
} from "@mui/material";
import {
  Brightness4,
  Brightness7,
  Menu as MenuIcon,
} from "@mui/icons-material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Link } from "react-router-dom";

const drawerWidth = 240;

const colors = {
  moodyBlue: "#40CFE2",
  moodyDarkBackground: "#0f1719",
  moodyWhite: "#FFFFFF",
  darkButtonHover: "#3DAFB7",
  lightText: "#E0E0E0",
};

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const theme = useTheme();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDrawerOpen = () => {
    setDrawerOpen(!drawerOpen);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        <ListItem component={Link} to="/users">
          <ListItemIcon>
            <DashboardIcon
              sx={{
                color: darkMode ? colors.moodyWhite : colors.moodyBlue,
              }}
            />
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: "bold",
                  fontSize: "18px",
                  color: darkMode ? colors.lightText : "#000000",
                }}
              >
                Email Data
              </Typography>
            }
          />
        </ListItem>
        <ListItem component={Link} to="/chart">
          <ListItemIcon>
            <DashboardIcon
              sx={{
                color: darkMode ? colors.moodyWhite : colors.moodyBlue,
              }}
            />
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: "bold",
                  fontSize: "18px",
                  color: darkMode ? colors.lightText : "#000000",
                }}
              >
                Signup Chart
              </Typography>
            }
          />
        </ListItem>

        <ListItem component={Link} to="/map">
          <ListItemIcon>
            <ShoppingCartIcon
              sx={{
                color: darkMode ? colors.moodyWhite : colors.moodyBlue,
              }}
            />
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: "bold",
                  fontSize: "18px",
                  color: darkMode ? colors.lightText : "#000000",
                }}
              >
                HeatMap
              </Typography>
            }
          />
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerOpen ? drawerWidth : 64}px)` },
          ml: { sm: `${drawerOpen ? drawerWidth : 64}px` },
          backgroundColor: darkMode
            ? colors.moodyDarkBackground
            : colors.moodyBlue,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerOpen}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              textAlign: "left",
              flexGrow: 1,
            }}
          >
            Neptune Admin
          </Typography>
          {/* Removed the IconButton and kept only the Switch for dark mode toggle */}
          <Switch checked={darkMode} onChange={toggleDarkMode} />
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{
          width: { sm: drawerOpen ? drawerWidth : 64 },
          flexShrink: { sm: 0 },
        }}
        aria-label="sidebar"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: darkMode
                ? colors.moodyDarkBackground
                : colors.moodyBlue,
              color: darkMode ? colors.moodyWhite : "#000000",
            },
          }}
        >
          {drawer}
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerOpen ? drawerWidth : 64,
              backgroundColor: darkMode
                ? colors.moodyDarkBackground
                : colors.moodyBlue,
              color: darkMode ? colors.moodyWhite : "#000000",
            },
          }}
          open={drawerOpen}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerOpen ? drawerWidth : 64}px)` },
          marginTop: "64px",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;
