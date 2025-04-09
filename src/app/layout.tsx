import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { Header } from "./_components/Header";

export const metadata: Metadata = {
  title: "Interview AI - Behavioral Interview Practice",
  description: "Practice your behavioral interview skills with AI",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body className="min-h-screen bg-gray-50">
        <TRPCReactProvider>
          <Header />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
