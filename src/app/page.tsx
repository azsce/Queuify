"use client";

// import { useEffect } from "react";
// import { redirect } from "next/navigation";
// import { Typography } from "@mui/material";
import QueuingTheoryCalculator from "@/views/calculator/QueuingTheoryCalculator";

export default function Home() {
  // useEffect(() => {
  //   redirect("/calc");
  // });

  return <QueuingTheoryCalculator />;
  // return <Typography variant="subtitle1">...Loading</Typography>;
}
