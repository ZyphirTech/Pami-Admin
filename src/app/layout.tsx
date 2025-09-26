import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import DashboardLayout from "../features/common/presentation/layouts/dashboard-layout";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../features/common/infrastructure/query-client/config";
import QueryProvider from "../features/common/presentation/components/QueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MINSAP Dashboard",
  description: "Panel de Control para el MINSAP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider children={children} />
      </body>
    </html>
  );
}
