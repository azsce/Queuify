import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Box } from "@mui/material";
import TopAppBar from "@/components/base/TopAppBar";
import { ThemeProvider } from "@/components/base/theme-provider";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import MuiThemeProvider from "@/components/base/MuiThemeProvider";

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
  title: "Queuify",
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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
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
                <TopAppBar />
                {children}
              </Box>
            </MuiThemeProvider>
          </AppRouterCacheProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
