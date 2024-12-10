import type { NextConfig } from "next";

import withPWA from "next-pwa";

const withPWAConfig = withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/Queue",
  ...withPWAConfig, // Integrate PWA configuration
};

export default nextConfig;
