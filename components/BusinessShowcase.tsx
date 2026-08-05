'use client';

import { useEffect, useRef, useState } from 'react';
import { asset } from '@/lib/asset';
import { businessAreas } from '@/data/site';

/**
 * Home-page business section: a scrolling list of areas paired with a sticky
 * stage that cross-fades to match whichever entry sits nearest the middle of
 * the viewport.
 *
 * List and stage share one `active` index, which is why they live in a single
 * component rather than two siblings coordinating through the DOM as the
 * original script did.
 */
export default function BusinessShowcase() {
  const [active, setActive] = useState(0);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    let ticking = false;

    const frame = () => {
      ticking = false;
      const middle = window.innerHeight / 2;
      let nearest = 0;
      let nearestDistance = Infinity;

      itemRefs.current.forEach((el, index) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const distance = Math.abs(rect.top + rect.height / 2 - middle);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearest = index;
        }
      });

      setActive(nearest);
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
    <div className="wrap biz">
      <div className="biz-list">
        {businessAreas.map((area, index) => (
          <article
            key={area.id}
            className={`biz-item${index === active ? ' is-active' : ''}`}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
          >
            <p className="kicker">{area.kicker}</p>
            <h3>{area.title}</h3>
            <p className="biz-desc">{area.summary}</p>
            <ul className="tags">
              {area.tags.map((tag) => (
                <li key={tag} className="tag tag-outline">
                  {tag}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div className="biz-stage" aria-hidden="true">
        {businessAreas.map((area, index) => (
          <div
            key={area.id}
            className={`biz-pane${index === active ? ' is-active' : ''}`}
          >
            {area.image ? (
              <img
                className="ph-img"
                src={asset(area.image.src)}
                alt=""
                loading="lazy"
                decoding="async"
              />
            ) : (
              <>
                <div className="ph-lines" />
                <span className="ph-label">{area.placeholder}</span>
              </>
            )}
          </div>
        ))}
        <div className="biz-dots">
          {businessAreas.map((area, index) => (
            <span
              key={area.id}
              className={`biz-dot${index === active ? ' is-active' : ''}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
