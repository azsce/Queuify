"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";
import { Typography } from "@mui/material";

export default function Home() {
  useEffect(() => {
    redirect("/calc");
  });

  return <Typography variant="subtitle1">...Loading</Typography>;
}
