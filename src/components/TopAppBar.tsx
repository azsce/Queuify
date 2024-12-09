"use client";

import React from "react";
import { AppBar, Toolbar, IconButton, Link, Button, Box } from "@mui/material";
import { DarkMode, Home as HomeIcon, Nightlight } from "@mui/icons-material";
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
  // {
  //     label: "M/M/1",
  //     href: "/mm1",
  // },
];

export default function TopAppBar() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  return (
    <AppBar
      position="static"
      sx={{
        dispaly: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <Toolbar
        sx={{
          dispaly: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Box
          sx={{
            dispaly: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Box
            sx={{
              dispaly: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <IconButton
              color="inherit"
              onClick={() => {
                console.log("clicked");
                router.push("/");
              }}
            >
              <HomeIcon />
            </IconButton>
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
            {theme === "dark" ? <Nightlight /> : <DarkMode />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
