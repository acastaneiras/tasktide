import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@root/lib/utils";
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/theme-provider"



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
    <html lang="en" suppressHydrationWarning>
      <body className={cn(`flex flex-col h-screen`)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          {children}
        </ThemeProvider>
        <Toaster/>
      </body>
    </html>
  );
}
