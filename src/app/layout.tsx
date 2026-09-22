import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { IBM_Plex_Mono, Inter } from "next/font/google";
import { BootLoader } from "@/components/motion/boot-loader";
import { RouteProgress } from "@/components/motion/route-progress";
import { ThemeProvider } from "@/components/theme/provider";
import { THEME_BOOT } from "@/lib/theme";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const ibm = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-ibm",
});

export const metadata: Metadata = {
  title: {
    default: "Africa Invest",
    template: "%s · Africa Invest",
  },
  description:
    "Buy stocks and ETFs on African exchanges, and global stocks for African investors. Piloting in Ghana first.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Africa Invest",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#12382c",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${ibm.variable} antialiased paper`}>
        <Script id="ai-theme" strategy="beforeInteractive">
          {THEME_BOOT}
        </Script>
        <ThemeProvider>
          <BootLoader />
          <RouteProgress />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
