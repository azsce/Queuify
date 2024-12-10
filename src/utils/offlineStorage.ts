import { createStore, get, set, del } from "idb-keyval";

// Create a separate storage for our offline app
const offlineStore = createStore("OfflineAppDB", "OfflineAppStore");

export const OfflineStorage = {
  async saveData(key, value) {
    try {
      await set(key, value, offlineStore);
    } catch (error) {
      console.error("Error saving offline data:", error);
    }
  },

  async getData(key, defaultValue = null) {
    try {
      const data = await get(key, offlineStore);
      return data !== undefined ? data : defaultValue;
    } catch (error) {
      console.error("Error retrieving offline data:", error);
      return defaultValue;
    }
  },

  async deleteData(key) {
    try {
      await del(key, offlineStore);
    } catch (error) {
      console.error("Error deleting offline data:", error);
    }
  },

  async initializeOfflineData() {
    // Preload initial data if not exists
    const existingData = await this.getData("initialized");
    if (!existingData) {
      // Load initial data from static JSON files
      const productsResponse = await fetch("/offline-data/products.json");
      const contentResponse = await fetch("/offline-data/content.json");

      const products = await productsResponse.json();
      const content = await contentResponse.json();

      await this.saveData("products", products);
      await this.saveData("content", content);
      await this.saveData("initialized", true);
    }
  },
};
