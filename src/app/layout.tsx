import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });


export const metadata: Metadata = {
  title: "TaskTide", 
  description: "A Kanban board app built with Next.js and Tailwind CSS using TypeScript and Supabase.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(`${inter.className} dark`)}>{children}</body>
    </html>
  );
}
