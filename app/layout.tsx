import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Aadith S — Backend Engineer",
  description:
    "Backend software engineer specializing in Go, Kafka, and event-driven microservices.",
  openGraph: {
    title: "Aadith S — Backend Engineer",
    description:
      "Backend software engineer specializing in Go, Kafka, and event-driven microservices.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-bg text-text antialiased">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
