import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Box } from "@mui/material";
import TopAppBar from "@/components/TopAppBar";
import { ThemeProvider } from "@/components/theme-provider";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import Loading from "@/components/Loading";
import MuiThemeProvider from "@/components/MuiThemeProvider";
import { Suspense } from "react";
import OfflineIndicator from "@/components/OfflineIndicator";
import { OfflineDataProvider } from "@/components/OfflineDataProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Queuing Theory Calculator",
  manifest: "/manifest.json",
  icons: {
    apple: "/icon-192x192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <OfflineDataProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
            storageKey="theme-mode"
          >
            <AppRouterCacheProvider>
              <MuiThemeProvider defaultMode="dark">
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Loading>
                    <Suspense fallback={<div>Loading...</div>}>
                      <OfflineIndicator />
                      <TopAppBar />
                      {children}
                    </Suspense>
                  </Loading>
                </Box>
              </MuiThemeProvider>
            </AppRouterCacheProvider>
          </ThemeProvider>
        </OfflineDataProvider>
      </body>
    </html>
  );
}
