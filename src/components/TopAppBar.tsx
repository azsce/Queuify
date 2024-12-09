"use client";

import React from "react";
import { AppBar, Toolbar, IconButton, Tabs, Tab } from "@mui/material";
import { Home as HomeIcon } from "@mui/icons-material";

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
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton href="/" color="inherit">
          <HomeIcon />
        </IconButton>
        <Tabs value={value} onChange={handleChange} textColor="inherit">
          {links.map((link) => (
            <Tab key={link.label} label={link.label} href={link.href} />
          ))}
        </Tabs>
      </Toolbar>
    </AppBar>
  );
}
