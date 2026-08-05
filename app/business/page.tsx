import type { Metadata } from 'next';
import { asset } from '@/lib/asset';
import { businessAreas } from '@/data/site';

export const metadata: Metadata = {
  title: '사업 영역',
  description: '모델 연구부터 하드웨어 통합, 현장 운영까지 하나의 스택으로 제공합니다.',
};

export default function BusinessPage() {
  return (
    <main className="page">
      <div className="wrap">
        <p className="kicker">02 — BUSINESS</p>
        <h1 className="page-title">사업 영역</h1>
        <p className="page-lead">
          모델 연구부터 하드웨어 통합, 현장 운영까지 하나의 스택으로 제공합니다.
        </p>

        {businessAreas.map((area) => (
          <section className="feature-row" key={area.id} id={area.id} data-reveal>
            <div>
              <p className="kicker">{area.kicker}</p>
              <h2>{area.title}</h2>
              <p className="muted">{area.detail}</p>
              <ul className="tags">
                {area.tags.map((tag) => (
                  <li key={tag} className="tag tag-outline">
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
            <div className="ph feature-ph">
              {area.image ? (
                <img
                  className="ph-img"
                  src={asset(area.image.src)}
                  alt={area.image.alt}
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <>
                  <div className="ph-lines" aria-hidden="true" />
                  <span className="ph-label">{area.placeholder}</span>
                </>
              )}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
