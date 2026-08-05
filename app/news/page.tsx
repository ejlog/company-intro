import type { Metadata } from 'next';
import { formatDate, newsItems } from '@/data/site';

export const metadata: Metadata = {
  title: '뉴스 · 보도자료',
  description: '애드센의 보도자료, 사업 소식, 연구 성과를 전합니다.',
};

export default function NewsPage() {
  return (
    <main className="page">
      <div className="wrap">
        <p className="kicker">04 — NEWSROOM</p>
        <h1 className="page-title mb-lg">뉴스 · 보도자료</h1>

        <ul className="news-grid">
          {newsItems.map((item) => (
            <li key={item.slug}>
              <article className="card news-card" data-reveal>
                <div className="ph news-ph">
                  <div className="ph-lines" aria-hidden="true" />
                </div>
                <div className="news-body">
                  <div className="news-meta">
                    <span className="news-tag">{item.category}</span>
                    <time dateTime={item.date}>{formatDate(item.date)}</time>
                  </div>
                  <h2>{item.title}</h2>
                  <p className="muted sm">{item.excerpt}</p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
