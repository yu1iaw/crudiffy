import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/auth-provider";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Vast_Shadow } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const vast = Vast_Shadow({
  weight: "400",
  variable: "--font-vast",
  subsets: ["latin"]
})

export const metadata: Metadata = {
  title: "Crudiffy",
  description: "Keep track of your expenses with ease. Powered by NextJS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${vast.variable} antialiased bg-gray-100`}
        >
          {children}
          <Toaster />
        </body>
      </html>
    </AuthProvider>
  );
}
