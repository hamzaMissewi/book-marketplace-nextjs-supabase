import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import ClientLayout from "./client-layout";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BookStore - Buy IT & Business Books to Learn & Grow",
  description:
    "Discover and purchase books on Development, AI, Cloud Computing, and Business",
  creator: "Hamza Missaoui",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* <head>
        <link
          rel="preload"
          href="/images/x-101-front-cover.jpeg"
          as="image"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/images/x-101-back-cover.jpeg"
          as="image"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/images/we-are-so-back-cover-optimized.jpeg"
          as="image"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/images/we-are-so-back-back-cover-optimized.jpeg"
          as="image"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/images/vibe-coding-front-cover.jpeg"
          as="image"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/images/vibe-coding-back-cover.jpeg"
          as="image"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/images/how-to-say-please-front-cover.jpeg"
          as="image"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/images/how-to-say-please-back-cover.jpeg"
          as="image"
          crossOrigin="anonymous"
        />
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
body {
  transition: background-color 1s ease;
}
        `}</style>
      </head> */}
      <body className={`font-sans antialiased`}>
        <ClientLayout> {children}</ClientLayout>
        <Analytics />
      </body>
    </html>
  );
}
