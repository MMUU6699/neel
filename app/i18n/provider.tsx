"use client";

import { NextIntlClientProvider } from "next-intl";
import { useMemo } from "react";

type Props = {
  children: React.ReactNode;
  locale: string;
  messages: Record<string, string>;
};

export function I18nProvider({ children, locale, messages }: Props) {
  const value = useMemo(() => ({ locale, messages }), [locale, messages]);
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
