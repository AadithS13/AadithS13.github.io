import type { Metadata } from "next";
import "./globals.css";
import BackgroundFX from "@/components/BackgroundFX";
import ScrollProgress from "@/components/ScrollProgress";

export const metadata: Metadata = {
  title: "Aadith S — Backend Engineer",
  description:
    "Backend software engineer specializing in Go, Kafka, and event-driven microservices.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-bg text-text antialiased">
        <BackgroundFX />
        <ScrollProgress />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
