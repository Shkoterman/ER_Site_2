import type { Metadata, Viewport } from 'next';
import './globals.css';

import { Header } from '@/app/Header';
import { Footer } from '@/app/Footer';

export const metadata: Metadata = {
  title: 'ensalada - сообщество в Барселоне',
  description: 'Комьюнити в Барселоне',
  viewport: 'width=device-width, initial-scale=1',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: 'black',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='ru'>
      <head>
        <link
          href='https://fonts.googleapis.com/css2?family=Commissioner:wght@100..900&family=Raleway:ital,wght@0,100..900;1,100..900&display=swap'
          rel='stylesheet'
        />
      </head>

      <body className="bg-[#111111] text-white font-['Raleway']">
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <div className='grid grid-cols-1 min-h-screen'>
          <Header />
          <main className='flex-grow'>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
