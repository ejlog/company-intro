'use client';

import { useEffect, useRef } from 'react';
import { asset } from '@/lib/asset';

/**
 * Hero image that scales up slightly as it enters the viewport.
 *
 * The transform is written straight to the node inside a rAF rather than held
 * in React state — it changes on every scroll frame, and a re-render per frame
 * would be wasted work.
 */
export default function HeroVisual() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let ticking = false;

    const frame = () => {
      ticking = false;
      const rect = el.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, 1 - rect.top / window.innerHeight));
      const scale = (0.94 + progress * 0.06).toFixed(4);
      const shift = ((1 - progress) * 20).toFixed(2);
      el.style.transform = `scale(${scale}) translateY(${shift}px)`;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(frame);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div className="wrap hero-visual-wrap">
      <div className="hero-visual" ref={ref}>
        <img
          className="ph-img"
          src={asset('/img/hero-main.jpg')}
          alt="부품을 파지한 6축 로봇 매니퓰레이터"
          width={2400}
          height={1350}
          fetchPriority="high"
        />
      </div>
    </div>
  );
}
