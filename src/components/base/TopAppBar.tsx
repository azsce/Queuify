"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Drawer,
  Box,
  Typography,
} from "@mui/material";
import {
  DarkMode,
  Home as HomeIcon,
  Menu as MenuIcon,
  LightMode,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import Link from "next/link";

const links = [
  {
    label: "D / D / 1 / (k-1)",
    href: "/dd1k",
  },
  {
    label: "M / M / C / K",
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
    <Box>
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
              alignItems: "center",
            }}
          >
            {/* xs: Home and Menu Icon */}
            <Box
              sx={{
                display: { xs: "flex", md: "none" },

                alignItems: "center",
                gap: 1,
              }}
            >
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
              {/* Home Icon */}
              <Link href="/">
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <HomeIcon />
                  <Typography
                    variant="h1"
                    sx={{
                      fontSize: "1rem",
                    }}
                  >
                    Queuify
                  </Typography>
                </Box>
              </Link>
            </Box>

            {/* md: Home and Links */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 6,
              }}
            >
              {/* Home Icon */}
              <Link href="/">
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <HomeIcon />
                  <Typography
                    variant="h1"
                    sx={{
                      fontSize: "1rem",
                    }}
                  >
                    Queuify
                  </Typography>
                </Box>
              </Link>

              {/* Links */}
              {links.map((link) => (
                <Link href={link.href} key={link.label} color="inherit">
                  <Typography
                    variant="h1"
                    sx={{
                      fontSize: "1rem",
                    }}
                  >
                    {link.label}
                  </Typography>
                </Link>
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
    </Box>
  );
}
