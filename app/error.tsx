"use client";

import { AppErrorFallback } from "@/components/ui/app-error-fallback";
import { useEffect } from "react";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("Route error boundary caught an error:", error);
  }, [error]);

  return (
    <AppErrorFallback
      reset={reset}
      title="Page failed to render"
      message="An unexpected error occurred while loading this page. Try again or return to the homepage."
    />
  );
}
