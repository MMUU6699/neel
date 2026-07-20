import { NextResponse } from "next/server";

const COOKIE_NAME = "NEXT_LOCALE";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export async function POST(request: Request) {
  const { locale } = (await request.json()) as { locale?: string };

  if (!locale || !["en", "ar"].includes(locale)) {
    return NextResponse.json({ error: "Invalid locale" }, { status: 400 });
  }

  const response = NextResponse.json({ locale });
  response.cookies.set(COOKIE_NAME, locale, {
    maxAge: COOKIE_MAX_AGE,
    path: "/",
    sameSite: "lax",
  });
  return response;
}
