import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/contexts/auth-context";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Ping Pong League Manager",
    template: "%s | Ping Pong League Manager",
  },
  description: "Professional ping pong tournament management system",
  keywords: ["ping pong", "table tennis", "tournament", "league", "management"],
  authors: [{ name: "Ping Pong League Manager Team" }],
  creator: "Ping Pong League Manager",
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://pingpong-league-manager.com",
    title: "Ping Pong League Manager",
    description: "Professional ping pong tournament management system",
    siteName: "Ping Pong League Manager",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ping Pong League Manager",
    description: "Professional ping pong tournament management system",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={inter.variable}>
      <body className="font-sans antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
