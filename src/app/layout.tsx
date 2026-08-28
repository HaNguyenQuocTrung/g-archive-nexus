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
  metadataBase: new URL("https://g-archive-nexus.vercel.app"),

  title: {
    default: "G-Archive Nexus",
    template: "%s // G-Archive Nexus",
  },

  description:
    "A fan-made Mobile Suit intelligence database covering Gundam timelines, series, pilots, variants, specifications and armaments.",

  keywords: [
    "Gundam",
    "Mobile Suit",
    "Gundam Archive",
    "Gundam Timeline",
    "Gundam Pilots",
    "Universal Century",
    "Cosmic Era",
  ],

  authors: [
    {
      name: "Hạ Nguyễn Quốc Trung",
    },
  ],

  openGraph: {
    title: "G-Archive Nexus",
    description: "Every timeline. Every pilot. Every Mobile Suit.",
    type: "website",
    locale: "en_US",
    siteName: "G-Archive Nexus",
  },

  robots: {
    index: true,
    follow: true,
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
        {children}
      </body>
    </html>
  );
}
