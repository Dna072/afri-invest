import type { Metadata, Viewport } from "next";
import { Figtree, Fraunces, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
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
  themeColor: "#1a4336",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${figtree.variable} ${fraunces.variable} ${ibm.variable} antialiased paper`}>{children}</body>
    </html>
  );
}
