"use client";

import { useEffect, useState } from "react";

export function useTvDetection() {
  const [isTv, setIsTv] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isWebOS = /Web0S|WebOS/i.test(navigator.userAgent);
      const urlParams = new URLSearchParams(window.location.search);
      const hasTvParam = urlParams.get("tv") === "true";
      
      if (isWebOS || hasTvParam) {
        setIsTv(true);
        document.documentElement.classList.add("tv-mode");
      }
    }
  }, []);

  return isTv;
}
