"use client";

import { AppErrorFallback } from "@/components/ui/app-error-fallback";
import { useEffect } from "react";

type GlobalErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalErrorPage({
  error,
  reset,
}: GlobalErrorPageProps) {
  useEffect(() => {
    console.error("Global error boundary caught an error:", error);
  }, [error]);

  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background font-sans">
        <AppErrorFallback
          reset={reset}
          title="Unexpected application error"
          message="Something went wrong while loading the app. Please refresh the page or try again later."
        />
      </body>
    </html>
  );
}
