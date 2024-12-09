import DD1KExplanation from "@/views/DD1KExplanation";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "D/D/1/K Queue Model",
};

const DD1KExplanationPage: React.FC = () => {
  return <DD1KExplanation />;
};

export default DD1KExplanationPage;
