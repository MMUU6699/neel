"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { useTvDetection } from "@/hooks/use-tv-detection";

const SiteNav = () => {
  const isTv = useTvDetection();
  const ref = useRef<HTMLAnchorElement>(null);

  if (isTv) {
    // Dynamic import for TV-only spatial navigation
    const { useFocusable } = require("@noriginmedia/norigin-spatial-navigation");
    const focusable = useFocusable();
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/"
          ref={focusable.ref}
          className={cn(
            "inline-flex size-10 shrink-0 items-center justify-center rounded-lg transition-transform",
            focusable.focused ? "scale-110 ring-4 ring-primary" : ""
          )}
        >
          <Image
            src="/logo.svg"
            alt="Index"
            width={28}
            height={28}
            className="size-7 shrink-0"
          />
          <span className="sr-only">Index</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/"
        ref={ref}
        className={cn("inline-flex size-10 shrink-0 items-center justify-center rounded-lg transition-transform")}
      >
        <Image
          src="/logo.svg"
          alt="Index"
          width={28}
          height={28}
          className="size-7 shrink-0"
        />
        <span className="sr-only">Index</span>
      </Link>
    </div>
  );
};

export { SiteNav };
