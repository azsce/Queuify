/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { createContext, useState, useEffect, ReactNode } from "react";
import { OfflineStorage } from "@/utils/offlineStorage";

interface Product {
  id: string | number;
  name: string;
  price: number;
}

interface Content {
  title?: string;
  [key: string]: any;
}

interface OfflineData {
  products: Product[];
  content: Content;
  isOffline: boolean;
}

export const OfflineDataContext = createContext<OfflineData>({
  products: [],
  content: {},
  isOffline: false,
});

interface OfflineDataProviderProps {
  children: ReactNode;
}

export function OfflineDataProvider({ children }: OfflineDataProviderProps) {
  const [offlineData, setOfflineData] = useState<OfflineData>({
    products: [],
    content: {},
    isOffline: false,
  });

  useEffect(() => {
    // Initialize offline data
    async function loadOfflineData() {
      await OfflineStorage.initializeOfflineData();

      const products = await OfflineStorage.getData("products", []);
      const content = await OfflineStorage.getData("content", {});

      setOfflineData({
        products,
        content,
        isOffline: !navigator.onLine,
      });
    }

    // Handle online/offline events
    const handleOnline = () => {
      setOfflineData((prev) => ({ ...prev, isOffline: false }));
    };

    const handleOffline = () => {
      setOfflineData((prev) => ({ ...prev, isOffline: true }));
    };

    // Add event listeners
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Load initial data
    loadOfflineData();

    // Cleanup
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <OfflineDataContext.Provider value={offlineData}>
      {children}
    </OfflineDataContext.Provider>
  );
}
