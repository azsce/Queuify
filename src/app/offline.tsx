"use client";

import { useOfflineData } from "@/hooks/useOfflineData";

export default function Home() {
  const { products, content, isOffline } = useOfflineData();

  return (
    <main>
      <h1>{content.title || "Offline App"}</h1>

      {isOffline && (
        <div style={{ color: "red" }}>You are currently offline</div>
      )}

      <h2>Products</h2>
      {products.length > 0 ? (
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              {product.name} - ${product.price}
            </li>
          ))}
        </ul>
      ) : (
        <p>No products available</p>
      )}
    </main>
  );
}
