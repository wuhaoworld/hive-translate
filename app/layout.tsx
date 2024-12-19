import { AntdRegistry } from '@ant-design/nextjs-registry';
import type { Metadata } from "next";
import { Analytics } from '@vercel/analytics/react';
import { Header } from '@/components/header';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Translate",
  description: "The best AI translation tool",
  icons: {
    icon: '/icon.png'
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <AntdRegistry>
            <div className="flex flex-col min-h-screen h-full bg-slate-100">
              <Header />
              <div className='flex w-full justify-center'>
                {children}
              </div>
            </div>
          </AntdRegistry>
          <Analytics />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
