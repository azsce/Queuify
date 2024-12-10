import { createStore, get, set, del } from "idb-keyval";

let offlineStore: ReturnType<typeof createStore> | null = null;

const getStore = () => {
  if (typeof window === "undefined") return null;
  if (!offlineStore) {
    offlineStore = createStore("OfflineAppDB", "OfflineAppStore");
  }
  return offlineStore;
};

export const OfflineStorage = {
  async saveData(key: string, value: unknown) {
    const store = getStore();
    if (!store) return;
    try {
      await set(key, value, store);
    } catch (error) {
      console.error("Error saving offline data:", error);
    }
  },

  async getData(key: string, defaultValue = null) {
    const store = getStore();
    if (!store) return defaultValue;
    try {
      const data = await get(key, store);
      return data !== undefined ? data : defaultValue;
    } catch (error) {
      console.error("Error retrieving offline data:", error);
      return defaultValue;
    }
  },

  async deleteData(key: string) {
    const store = getStore();
    if (!store) return;
    try {
      await del(key, store);
    } catch (error) {
      console.error("Error deleting offline data:", error);
    }
  },

  async initializeOfflineData() {
    if (typeof window === "undefined") return;

    const existingData = await this.getData("initialized");
    if (!existingData) {
      try {
        // Default data in case fetches fail
        let products = [];
        let content = {};

        try {
          const productsResponse = await fetch("/offline-data/products.json");
          if (productsResponse.ok) {
            products = await productsResponse.json();
          } else {
            console.warn("Products data not found, using empty array");
          }
        } catch (error) {
          console.warn("Failed to load products:", error);
        }

        try {
          const contentResponse = await fetch("/offline-data/content.json");
          if (contentResponse.ok) {
            content = await contentResponse.json();
          } else {
            console.warn("Content data not found, using empty object");
          }
        } catch (error) {
          console.warn("Failed to load content:", error);
        }

        await this.saveData("products", products);
        await this.saveData("content", content);
        await this.saveData("initialized", true);
      } catch (error) {
        console.error("Failed to initialize offline data:", error);
      }
    }
  },
};
