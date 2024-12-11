"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Link,
  Button,
  Box,
  Drawer,
  Container,
} from "@mui/material";
import {
  DarkMode,
  Home as HomeIcon,
  Menu as MenuIcon,
  LightMode,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

const links = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "D/D/1/(k-1)",
    href: "/dd1k",
  },
  {
    label: "M/M/C/K",
    href: "/mm",
  },
];

export default function TopAppBar() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const appBarRef = useRef<HTMLDivElement>(null);
  const [appBarHeight, setAppBarHeight] = useState(64); // Default height

  useEffect(() => {
    if (appBarRef.current) {
      setAppBarHeight(appBarRef.current.clientHeight);
    }
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Container
      maxWidth={"lg"}
      sx={(theme) => ({
        py: 4,
        maxWidth: "100%",
        [theme.breakpoints.up("xs")]: {
          maxWidth: "100%",
        },
        [theme.breakpoints.up("sm")]: {
          maxWidth: theme.breakpoints.values.lg,
        },
        [theme.breakpoints.up("md")]: {
          maxWidth: theme.breakpoints.values.md,
        },
        marginLeft: "auto",
        marginRight: "auto",
        t: 0,
        p: 0,
        borderRadius: 0,
      })}
    >
      <AppBar
        position="static"
        ref={appBarRef}
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          backgroundColor: "background.paper",
          color: "text.primary",
          boxShadow: 0,
          borderRadius: 0,
          borderBottom: 1,
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            {/* xs: Home and Menu Icon */}
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              {/* Menu Icon */}
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
              {/* Home Icon */}
              <IconButton
                color="inherit"
                onClick={() => {
                  console.log("clicked");
                  router.push("/");
                }}
              >
                <HomeIcon />
              </IconButton>
            </Box>

            {/* md: Home and Links */}
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              {/* Home Icon */}
              <IconButton
                color="inherit"
                onClick={() => {
                  console.log("clicked");
                  router.push("/");
                }}
              >
                <HomeIcon />
              </IconButton>

              {/* Links */}
              {links.map((link) => (
                <Button
                  key={link.label}
                  onClick={() => router.push(link.href)}
                  color="inherit"
                  sx={{ margin: 1 }}
                  LinkComponent={Link}
                >
                  {link.label}
                </Button>
              ))}
            </Box>
            <IconButton
              color="inherit"
              onClick={() => {
                setTheme(theme === "dark" ? "light" : "dark");
              }}
            >
              {theme === "dark" ? <LightMode /> : <DarkMode />}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 240,
            top: `${appBarHeight}px`, // Adjust the top position based on AppBar height
            height: `calc(100vh - ${appBarHeight}px)`, // Adjust the height based on AppBar height
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            height: "100%",
          }}
        >
          {links.map((link) => (
            <Button
              key={link.label}
              onClick={() => {
                router.push(link.href);
                handleDrawerToggle();
              }}
              color="inherit"
              sx={{ margin: 1 }}
              LinkComponent={Link}
            >
              {link.label}
            </Button>
          ))}
        </Box>
      </Drawer>
    </Container>
  );
}
