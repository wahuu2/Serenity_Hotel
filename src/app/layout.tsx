import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SyncUser from "@/components/SyncUser";

import "./globals.css";

export const metadata: Metadata = {
  title: "Serenity Hotel",
  description: "Experience comfort, luxury, and exceptional hospitality.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <SyncUser />

          <Navbar />

          {children}

          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}