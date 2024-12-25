import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/src/components/ui/sonner"
import { ThemeProvider } from "@/src/components/theme-provider"
import { Bricolage_Grotesque } from "next/font/google";

const Grotesque = Bricolage_Grotesque({ subsets: ["latin"] });


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
      <body className={cn(`${Grotesque.className} flex flex-col h-screen`)}>
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
