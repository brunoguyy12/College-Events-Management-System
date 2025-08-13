import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/toaster";
import FAQChatbot from "@/components/FAQChatbot";
import EnhancedChatbot from "@/components/enhanced-chatbot";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Intelligent College Event Management System",
  description: "AI-powered platform for college event management",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster />
          {/* <FAQChatbot /> */}

          <EnhancedChatbot />
        </Providers>
      </body>
    </html>
  );
}
