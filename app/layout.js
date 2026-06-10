import localFont from "next/font/local";
import { Suspense } from "react";
import "./globals.css";
import { DesktopTabShell } from "@/components/desktop-tabs";

const geistSans = localFont({
  src: "./fonts/Geist[wght].woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
});

const geistMono = localFont({
  src: "./fonts/GeistMono[wght].woff2",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
});

export const metadata = {
  title: "Videoo Editor",
  description: "Editor screen prototype built in Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Suspense fallback={<div className="desktop-shell"><div className="desktop-shell-content">{children}</div></div>}>
          <DesktopTabShell>{children}</DesktopTabShell>
        </Suspense>
      </body>
    </html>
  );
}
