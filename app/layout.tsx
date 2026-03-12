import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ArtisanAlley | Curated Handmade Marketplace",
  description: "Discover ethically sourced, authentic, and timeless handmade crafts from local master artisans.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html 
    lang="en"
    data-cursorstyle="true">
      {/* Add suppressHydrationWarning here */}
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
