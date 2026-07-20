"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function TvLoginCode() {
  const [code, setCode] = useState<string | null>(null);
  const [deviceCode, setDeviceCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Generate code
    const fetchCode = async () => {
      try {
        const res = await fetch("/api/auth/device", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "generate" }),
        });
        const data = await res.json();
        if (data.userCode) {
          setCode(data.userCode);
          setDeviceCode(data.deviceCode);
        } else {
          setError("Failed to generate code");
        }
      } catch (e) {
        setError("Network error");
      }
    };
    fetchCode();
  }, []);

  useEffect(() => {
    if (!deviceCode) return;

    // Poll for auth status
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/auth/device", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "poll", deviceCode }),
        });
        const data = await res.json();
        if (data.sessionToken) {
          clearInterval(interval);
          // Instead of custom session token handling, reload so the main auth system syncs or NextAuth catches up
          // In a real app we would bridge the custom session token into NextAuth here.
          // For simplicity, we just reload the app, assuming the session token was set in cookies by API or handled by adapter.
          window.location.reload();
        }
      } catch (e) {
        // ignore polling errors
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [deviceCode, router]);

  return (
    <div className="flex flex-col items-center justify-center space-y-6 px-6 py-12 text-center sm:px-8">
      <h2 className="text-2xl font-semibold leading-tight tracking-tight text-white">
        Connect to TV
      </h2>
      <p className="text-sm text-zinc-400">
        On your phone or computer, go to:
      </p>
      <div className="rounded-lg bg-white/10 px-6 py-3 text-xl font-bold tracking-wider text-sky-300">
        index.app/tv
      </div>
      <p className="text-sm text-zinc-400">and enter the code:</p>
      {code ? (
        <div className="text-5xl font-mono font-bold tracking-[0.2em] text-white">
          {code}
        </div>
      ) : error ? (
        <div className="text-red-400">{error}</div>
      ) : (
        <Loader2 className="h-10 w-10 animate-spin text-sky-300" />
      )}
    </div>
  );
}
