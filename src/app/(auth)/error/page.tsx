"use client";
import { Suspense } from "react";
import { Button } from "@/src/components/ui/button";
import { StepBackIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";

function ErrorContent() {
    const searchParams = useSearchParams();
    const message = searchParams.get("message") || "An unexpected error occurred.";
    const error = searchParams.get("error");
    const errorCode = searchParams.get("error_code");
    const errorDescription = searchParams.get("error_description") || "";

    return (
        <>
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
                <p className="mb-6">
                    {errorDescription}
                </p>
            )}
            <Button asChild variant={`secondary`}>
                <a
                    href="/"
                    className="inline-block px-4 py-2 rounded-md transition"
                >
                    <StepBackIcon className="w-4 h-4 mr-2" />
                    Go Back Home
                </a>
            </Button>
        </>
    );
}

export default function ErrorPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ErrorContent />
        </Suspense>
    );
}