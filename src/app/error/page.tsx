"use client";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function ErrorPage() {
    const searchParams = useSearchParams();
    const message = searchParams.get("message") || "An unexpected error occurred.";
    const error = searchParams.get("error");
    const errorCode = searchParams.get("error_code");
    const errorDescription =
        searchParams.get("error_description") || "No additional details available.";

    return (
            <div className="text-center p-6 max-w-md shadow-md rounded-md border border-accent bg-background">
                <h1 className="text-2xl font-semibold mb-4 text-primary">
                    Oops! Something went wrong
                </h1>
                <p className="mb-4">{message}</p>
                {error && (
                    <p className="text-red-600 font-medium mb-2">
                        Error: {error}
                    </p>
                )}
                {errorCode && (
                    <p className="text-red-500 mb-2">
                        Error Code: {errorCode}
                    </p>
                )}
                {errorDescription && (
                    <p className="text-gray-600 mb-6">
                        {errorDescription}
                    </p>
                )}
                <Button asChild variant={`secondary`}>
                    <a
                        href="/"
                        className="inline-block px-4 py-2 rounded-md transition"
                    >
                        Go Back Home
                    </a>
                </Button>
            </div>
    );
}
