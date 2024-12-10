// eslint-disable-next-line @typescript-eslint/no-require-imports
const nextPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: "NetworkFirst",
      options: {
        cacheName: "offlineCache",
        expiration: {
          maxEntries: 200,
        },
      },
    },
  ],
  register: true,
  skipWaiting: true,
});

module.exports = nextPWA({
  output: "export",
  reactStrictMode: true,
  experimental: {
    turbo: {
      enabled: true,
    },
  },
});
