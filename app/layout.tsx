import { AntdRegistry } from '@ant-design/nextjs-registry';
import type { Metadata } from "next";
import { Header } from '@/components/header'
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Translate",
  description: "最好用的 AI 翻译工具",
  icons: {
    icon: '/icon.png'
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="Zh-cn">
      <body>
        <AntdRegistry>
          <div className="flex flex-col min-h-screen h-full bg-slate-100">
            <Header />
            <div className='flex w-full justify-center'>
              {children}
            </div>
          </div>
        </AntdRegistry>
      </body>
    </html>
  );
}
