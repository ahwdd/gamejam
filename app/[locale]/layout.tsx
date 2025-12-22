// app/[locale]/layout.tsx
import React from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Cairo } from 'next/font/google';
import StoreProvider from '@/components/StoreProvider';
import Script from 'next/script';
import path from 'path';
import fs from 'fs/promises';

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

export default async function LocaleLayout({ children, params }: {
  children: React.ReactNode;
  params: { locale: string } | Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale)) {
    return notFound();
  }

  setRequestLocale(locale);

  const messagesDir = path.resolve(process.cwd(), 'messages');
  const baseFile = path.join(messagesDir, `${locale}.json`);
  const agendaFile = path.join(messagesDir, 'agenda', `${locale}.json`);

  let baseContent = '{}';
  let agendaContent = '{}';
  try {
    baseContent = await fs.readFile(baseFile, 'utf8');
  } catch (e) {
    console.error('[LocaleLayout] Failed reading base messages file:', baseFile, e);
  }
  try {
    agendaContent = await fs.readFile(agendaFile, 'utf8');
  } catch (e) {
    console.error('[LocaleLayout] Failed reading agenda messages file:', agendaFile, e);
  }

  let baseMessages: Record<string, any> = {};
  let agendaMessages: Record<string, any> = {};
  try {
    baseMessages = JSON.parse(baseContent);
  } catch (e) {
    console.error('[LocaleLayout] Failed parsing base messages JSON:', e);
  }
  try {
    agendaMessages = JSON.parse(agendaContent);
  } catch (e) {
    console.error('[LocaleLayout] Failed parsing agenda messages JSON:', e);
  }

  const messages = {
    ...baseMessages,
    agenda: agendaMessages,
  };

  return (
    <main lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '2193762604480703');
          fbq('track', 'PageView');`}
      </Script>
      <noscript>
        <img 
          height="1" 
          width="1" 
          style={{display: 'none'}}
          src="https://www.facebook.com/tr?id=2193762604480703&ev=PageView&noscript=1"
        />
      </noscript>

      <NextIntlClientProvider locale={locale} messages={messages}>
        <StoreProvider>{children}</StoreProvider>
      </NextIntlClientProvider>
    </main>
  );
}