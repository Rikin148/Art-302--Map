import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import VisualEditsMessenger from "../visual-edits/VisualEditsMessenger";
import ErrorReporter from "@/components/ErrorReporter";

export const metadata: Metadata = {
  title: "Mythical Creatures Globe - Interactive Mission Map",
  description: "Explore mythical creatures around the world on an interactive 3D globe",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <ErrorReporter />
        <Script src="https://unpkg.com/three@0.159.0/build/three.min.js" strategy="beforeInteractive" />
        <Script
          src="https://unpkg.com/three-globe@2.31.0/dist/three-globe.min.js"
          strategy="beforeInteractive"
        />
        <Script
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts//route-messenger.js"
          strategy="afterInteractive"
          data-target-origin="*"
          data-message-type="ROUTE_CHANGE"
          data-include-search-params="true"
          data-only-in-iframe="true"
          data-debug="true"
          data-custom-data='{"appName": "YourApp", "version": "1.0.0", "greeting": "hi"}'
        />
        {children}
        <VisualEditsMessenger />
      </body>
    </html>
  );
}

