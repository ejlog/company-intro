import type { Metadata } from 'next';
import { historyByYear } from '@/data/site';

export const metadata: Metadata = {
  title: '연혁',
  description: '2019년 설립부터 현재까지 애드센의 주요 연혁입니다.',
};

export default function HistoryPage() {
  return (
    <main className="page">
      <div className="wrap">
        <p className="kicker">03 — HISTORY</p>
        <h1 className="page-title mb-lg">연혁</h1>

        {historyByYear.map((block) => (
          <section className="hist-block" key={block.year} data-reveal aria-label={`${block.year}년`}>
            <h2 className="hist-year">{block.year}</h2>
            <ul className="hist-items">
              {block.items.map((item) => (
                <li className="hist-item" key={`${block.year}-${item.month}`}>
                  <time className="hist-m" dateTime={`${block.year}-${item.month}`}>
                    {item.month}
                  </time>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
