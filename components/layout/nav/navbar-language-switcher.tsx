"use client";

import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const locales = [
  { code: "en", label: "EN" },
  { code: "ar", label: "AR" },
];

export function NavbarLanguageSwitcher({ locale }: { locale: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const setLocale = async (newLocale: string) => {
    if (newLocale === locale) return;
    setLoading(true);
    await fetch("/api/locale", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale: newLocale }),
    });
    router.refresh();
    setLoading(false);
  };

  return (
    <div className="flex items-center gap-2">
      {locales.map((item) => (
        <Button
          key={item.code}
          variant={item.code === locale ? "solid" : "ghost"}
          size="icon"
          className="min-w-[2.5rem]"
          aria-label={`Switch language to ${item.label}`}
          onClick={() => setLocale(item.code)}
          disabled={loading}
        >
          <span>{item.label}</span>
        </Button>
      ))}
    </div>
  );
}
