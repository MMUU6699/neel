import { headers } from "next/headers";
import { appendFileSync } from "fs";

const supportedLocales = ["en", "ar"];

export async function getLocale(): Promise<string> {
  const requestHeaders = await headers();
  const cookieHeader = requestHeaders.get("cookie") ?? "";
  console.log("[locale] request headers cookie:", cookieHeader);
  try {
    appendFileSync(".locale-debug.log", `[locale] cookie:${cookieHeader}\n`, {
      encoding: "utf8",
      flag: "a",
    });
  } catch (e) {
    /* ignore */
  }
  const localeFromCookie = cookieHeader
    .split(";")
    .map((segment) => segment.trim())
    .find((segment) => segment.startsWith("NEXT_LOCALE="));

  if (localeFromCookie) {
    const locale = localeFromCookie.split("=")[1];
    console.log("[locale] found cookie locale:", locale);
    try {
      appendFileSync(".locale-debug.log", `[locale] cookie-locale:${locale}\n`, {
        encoding: "utf8",
        flag: "a",
      });
    } catch (e) {
      /* ignore */
    }
    if (supportedLocales.includes(locale)) {
      try {
        appendFileSync(".locale-debug.log", `[locale] resolved:${locale}\n`, {
          encoding: "utf8",
          flag: "a",
        });
      } catch (e) {
        /* ignore */
      }
      return locale;
    }
  }

  const acceptLanguage = requestHeaders.get("accept-language") ?? "";
  console.log("[locale] accept-language:", acceptLanguage);
  try {
    appendFileSync(".locale-debug.log", `[locale] accept-language:${acceptLanguage}\n`, {
      encoding: "utf8",
      flag: "a",
    });
  } catch (e) {
    /* ignore */
  }
  const accepted = acceptLanguage
    .split(",")
    .map((part) => part.split(";")[0].trim())
    .map((lang) => lang.toLowerCase())
    .map((lang) => {
      if (lang.startsWith("ar")) return "ar";
      if (lang.startsWith("en")) return "en";
      return null;
    })
    .find((locale): locale is string => locale !== null);

  const resolved = accepted ?? "en";
  console.log("[locale] resolved:", resolved);
  try {
    appendFileSync(".locale-debug.log", `[locale] resolved:${resolved}\n`, {
      encoding: "utf8",
      flag: "a",
    });
  } catch (e) {
    /* ignore */
  }
  return resolved;
}
