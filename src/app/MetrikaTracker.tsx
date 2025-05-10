'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function MetrikaTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.ym === 'function') {
      // Отправляем "hit" с текущим URL
      window.ym(99712331, 'hit', pathname, {
        referer: document.referrer,
      });
    }
  }, [pathname]);

  return null;
}
