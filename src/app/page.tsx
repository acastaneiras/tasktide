import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-muted p-8">
      <h1
        className="relative text-6xl font-extrabold text-transparent bg-clip-text"
        style={{
          backgroundImage: "var(--gradient)",
        }}
      >
        <span
          className="absolute top-1 left-1 -z-10 text-black"
          style={{
            textShadow: "1px 1px 2px rgba(0, 0, 0, 0.4)",
          }}
        >
          TaskTide
        </span>
        TaskTide
      </h1>

      <p className="mt-6 text-lg text-muted-foreground text-center max-w-md">
        A Kanban board app built with Next.js, Tailwind CSS and Supabase.
      </p>

      <div className="mt-8 flex gap-4">
        <Button asChild size="sm">
          <Link href="/sign-in">
            <LogIn className="w-4 h-4 mr-2" />
            Access
          </Link>
        </Button>
      </div>
    </main>
  );
}
