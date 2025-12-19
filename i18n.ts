import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const locales = ['en', 'ar'] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ locale='en' }) => {
  if (!locale || !locales.includes(locale as Locale)) locale = 'en';

  const messages = (await import(`./messages/${locale}.json`)).default;
  const agenda = (await import(`./messages/agenda/${locale}.json`)).default;

  return {
    locale,
    messages: {
      ...messages,
      agenda: {
        agenda
      }
    }
  };
});