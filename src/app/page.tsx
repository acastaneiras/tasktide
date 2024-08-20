import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <span className="testingclass">TaskTide</span>

      <Link href="/sign-in">Login</Link>
      <Link href="/dashboard">Dashboard</Link>
      A Kanban board app built with Next.js and Tailwind CSS using TypeScript and Supabase.
    </main>
  );
}
