"use client";

import { useContext } from "react";
import { OfflineDataContext } from "@/components/base/OfflineDataProvider";

export function useOfflineData() {
  const context = useContext(OfflineDataContext);

  if (!context) {
    throw new Error(
      "useOfflineData must be used within an OfflineDataProvider"
    );
  }

  return context;
}
