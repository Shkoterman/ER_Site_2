import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';

import { Header } from '@/app/Header';
import { Footer } from '@/app/Footer';
import MetrikaTracker from '@/app/MetrikaTracker';

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

        {/* Yandex.Metrika */}
        <Script id='yandex-metrika-init' strategy='afterInteractive'>
          {`
    (function(m,e,t,r,i,k,a){
      m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
      m[i].l=1*new Date();
      for (var j = 0; j < document.scripts.length; j++) {
        if (document.scripts[j].src === r) { return; }
      }
      k=e.createElement(t),a=e.getElementsByTagName(t)[0],
      k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
    })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

    // Инициализация счетчика
    ym(99712331, "init", {
         clickmap:true,
         trackLinks:true,
         accurateTrackBounce:true,
         webvisor:true
    });   
    `}
        </Script>
      </head>

      <body className="bg-[#111111] text-white font-['Raleway']">
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <MetrikaTracker />
        <div className='grid grid-cols-1 min-h-screen'>
          <Header />
          <main className='flex-grow'>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
