// app/layout.tsx
import type { Metadata } from "next";
import { Cairo, Geist_Mono } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  subsets: ['latin', 'arabic'],
  weight: ['400', '600', '700', '900'],
  variable: '--font-cairo',
  display: 'swap',
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Heritage Gameathon - Abu Dhabi",
  description: "Abu Dhabi's largest game-creation event...",
  keywords: "gameathon, game jam, abu dhabi, heritage",
  openGraph: {
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body className={`${cairo.variable} ${geistMono.variable} antialiased w-screen overflow-x-hidden min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
