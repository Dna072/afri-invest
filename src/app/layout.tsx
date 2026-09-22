import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Fraunces, IBM_Plex_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { BootLoader } from "@/components/motion/boot-loader";
import { RouteProgress } from "@/components/motion/route-progress";
import { ThemeProvider } from "@/components/theme/provider";
import { THEME_BOOT } from "@/lib/theme";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
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
  description: "Invest in Africa from anywhere. One investment account for Africans everywhere.",
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
      <body className={`${jakarta.variable} ${fraunces.variable} ${ibm.variable} antialiased paper`}>
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
