import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Box } from "@mui/material";
import TopAppBar from "@/components/TopAppBar";
import { ThemeProvider } from "@/components/theme-provider";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import Loading from "@/components/Loading";
import MuiThemeProvider from "@/components/MuiThemeProvider";
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

export const metadata: Metadata = {
  title: "Queuing Theory Calculator",
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
                  <TopAppBar />
                  {children}
                </Loading>
              </Box>
            </MuiThemeProvider>
          </AppRouterCacheProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
