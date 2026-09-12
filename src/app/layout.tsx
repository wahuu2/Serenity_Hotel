import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SyncUser from "@/components/SyncUser";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Serenity Hotel | Comfort, Luxury & Exceptional Hospitality",
    template: "%s | Serenity Hotel",
  },

  description:
    "Experience comfort, luxury, and exceptional hospitality at Serenity Hotel. Discover our rooms, restaurant, services, and seamless hotel booking experience.",

  keywords: [
    "Serenity Hotel",
    "hotel in Kenya",
    "Kenyan hotel",
    "hotel booking",
    "hotel rooms",
    "hotel restaurant",
    "hotel accommodation",
    "luxury hotel",
    "hotel services",
    "hotel management",
  ],

  authors: [{ name: "Serenity Hotel" }],
  creator: "Serenity Hotel",

  openGraph: {
    title: "Serenity Hotel | Comfort, Luxury & Exceptional Hospitality",
    description:
      "Discover comfortable rooms, exceptional dining, quality services, and exceptional hospitality at Serenity Hotel.",
    type: "website",
    locale: "en_KE",
    siteName: "Serenity Hotel",

    images: [
      {
        url: "/og-serenity.png",
        width: 1200,
        height: 630,
        alt: "Serenity Hotel — Comfort, Luxury & Exceptional Hospitality",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Serenity Hotel | Comfort, Luxury & Exceptional Hospitality",
    description:
      "Experience comfortable accommodation, dining, and exceptional hospitality at Serenity Hotel.",
    images: ["/og-serenity.png"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className="min-h-screen w-full overflow-x-hidden bg-background text-foreground antialiased">
          <SyncUser />

          <Navbar />

          {children}

          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}