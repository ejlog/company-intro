'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Reveals `[data-reveal]` elements as they scroll into view.
 *
 * Behaviour is carried over from the original site.js: only elements that
 * start below the fold are hidden, so content already visible on load never
 * flashes. Mounted once in the layout and re-run per route, since App Router
 * navigation swaps the page subtree without remounting the layout.
 */
export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!('IntersectionObserver' in window)) return;

    const viewportHeight = window.innerHeight;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.remove('is-hidden');
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 },
    );

    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    for (const [index, element] of elements.entries()) {
      // Stagger in groups of four so a row animates as a row.
      element.style.transitionDelay = `${(index % 4) * 60}ms`;
      if (element.getBoundingClientRect().top > viewportHeight * 0.88) {
        element.classList.add('is-hidden');
        observer.observe(element);
      }
    }

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
