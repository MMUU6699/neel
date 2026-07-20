"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTvDetection } from "@/hooks/use-tv-detection";

let snInitialized = false;

export function WebOSProvider({ children }: { children: React.ReactNode }) {
  const isTv = useTvDetection();
  const router = useRouter();

  useEffect(() => {
    if (isTv && !snInitialized) {
      import('@noriginmedia/norigin-spatial-navigation').then(({ init }) => {
        init({
          debug: false,
          visualDebug: false,
        });
        snInitialized = true;
      });
    }
  }, [isTv]);

  useEffect(() => {
    if (!isTv) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // webOS Back Key
      if (event.keyCode === 461) {
        if (window.history.length > 2) {
          router.back();
        } else {
          // At the root, exit the app
          if (typeof (window as any).webOS !== 'undefined' && (window as any).webOS.platformBack) {
            (window as any).webOS.platformBack();
          } else {
            window.close();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isTv, router]);

  return <>{children}</>;
}
