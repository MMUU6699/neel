"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function TvCodePage() {
  const { data: session, status } = useSession();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (status === "loading") {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;
  }

  if (!session) {
    // Redirect to login if they are not logged in themselves
    router.push("/login?callbackUrl=/tv");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      toast.error("Please enter a 6-character code.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/device", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "authorize",
          userCode: code.toUpperCase(),
          userId: session.user.id,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("TV Authorized successfully! You can now watch on your TV.");
        setCode("");
      } else {
        toast.error(data.error || "Failed to authorize TV.");
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-lg">
        <h1 className="mb-4 text-center text-2xl font-bold">Connect your TV</h1>
        <p className="mb-6 text-center text-muted-foreground">
          Enter the 6-character code shown on your TV screen to log in.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="XXXXXX"
            maxLength={6}
            className="text-center text-2xl tracking-widest uppercase"
          />
          <Button type="submit" className="w-full" disabled={loading || code.length !== 6}>
            {loading ? <Loader2 className="mr-2 animate-spin" /> : null}
            Authorize TV
          </Button>
        </form>
      </div>
    </div>
  );
}
