// app/[locale]/layout.tsx
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Cairo } from 'next/font/google';
import StoreProvider from '@/components/StoreProvider';

const cairo = Cairo({
  subsets: ['latin', 'arabic'],
  weight: ['400', '600', '700', '900'],
  variable: '--font-cairo',
  display: 'swap',
});

const locales = ['en', 'ar'];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({children, params }: {
  children: React.ReactNode;
  params: { locale: string } | Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale)) {
    return notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <div className={cairo.variable}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <StoreProvider>{children}</StoreProvider>
      </NextIntlClientProvider>
    </div>
  );
}
