import Link from 'next/link';
import HeroVisual from '@/components/HeroVisual';
import BusinessShowcase from '@/components/BusinessShowcase';
import {
  contactDetails,
  formatDate,
  historyHighlights,
  newsItems,
  stats,
} from '@/data/site';

export default function HomePage() {
  // The home page shows only the four most recent entries; /news/ has the rest.
  const latestNews = newsItems.slice(0, 4);

  return (
    <main id="top">
      <section className="hero">
        <div className="hero-glow" aria-hidden="true" />
        <div className="wrap hero-inner">
          <p className="kicker hero-kicker">PHYSICAL INTELLIGENCE FOR THE REAL WORLD</p>
          <h1 className="hero-title">
            지능을 물리 세계로
            <br />
            옮기는 일
          </h1>
          <div className="hero-foot">
            <p className="hero-lead">
              애드센은 로봇이 스스로 보고, 판단하고, 움직이도록 하는 피지컬 AI를 연구
              개발합니다. 파운데이션 모델과 실제 하드웨어를 함께 설계하여 제조, 물류, 인프라
              현장의 노동을 자동화합니다.
            </p>
            <Link className="btn btn-primary" href="/about/">
              회사 소개 보기
            </Link>
          </div>
        </div>
        <HeroVisual />
      </section>

      <section className="stats" aria-label="회사 주요 지표">
        <div className="wrap stats-grid">
          {stats.map((stat) => (
            <div className="stat" key={stat.label} data-reveal>
              <div className="stat-v">{stat.value}</div>
              <div className="stat-k">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="sec" id="about" aria-labelledby="about-heading">
        <div className="wrap sec-grid">
          <div className="sec-head" data-reveal>
            <p className="kicker">01 — ABOUT</p>
            <h2 id="about-heading">회사 소개</h2>
            <p className="sec-sub">Vision &amp; Mission</p>
          </div>
          <div>
            <p className="lead" data-reveal>
              사람이 하기 어려운 일을 기계가 안전하게 해내는 사회를 만듭니다.
            </p>
            <div className="two-col">
              <div className="card" data-reveal>
                <div className="card-kicker">VISION</div>
                <p className="card-body">
                  모든 기계가 물리 세계를 이해하는 시대. 애드센은 인식과 제어를 하나의 모델로
                  통합하여, 정해진 동작을 반복하는 자동화가 아닌 상황을 이해하고 판단하는
                  자율성을 만듭니다.
                </p>
              </div>
              <div className="card" data-reveal>
                <div className="card-kicker">MISSION</div>
                <p className="card-body">
                  연구를 현장으로. 논문에 머무르는 기술이 아니라 24시간 가동되는 산업 현장에서
                  검증된 피지컬 AI를 공급하는 것이 우리의 역할입니다.
                </p>
              </div>
            </div>
            <Link className="btn btn-primary mt-lg" data-reveal href="/about/">
              회사 소개 자세히 보기 →
            </Link>
          </div>
        </div>
      </section>

      <section className="sec" id="business" aria-labelledby="business-heading">
        <div className="wrap sec-top" data-reveal>
          <div>
            <p className="kicker">02 — BUSINESS</p>
            <h2 id="business-heading">사업 영역</h2>
          </div>
          <Link className="btn btn-ghost" href="/business/">
            전체 보기 →
          </Link>
        </div>
        <BusinessShowcase />
      </section>

      <section className="sec sec-tint" id="history" aria-labelledby="history-heading">
        <div className="wrap sec-grid">
          <div className="sec-head sticky" data-reveal>
            <p className="kicker">03 — HISTORY</p>
            <h2 id="history-heading">연혁</h2>
            <p className="sec-sub">2019 — 2026</p>
            <Link className="btn btn-primary mt-md" href="/history/">
              전체 연혁 →
            </Link>
          </div>
          <div>
            {historyHighlights.map((entry) => (
              <div className="hist-row" key={entry.year} data-reveal>
                <div className="hist-y">{entry.year}</div>
                <div className="hist-t">{entry.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec" id="news" aria-labelledby="news-heading">
        <div className="wrap sec-top" data-reveal>
          <div>
            <p className="kicker">04 — NEWSROOM</p>
            <h2 id="news-heading">뉴스 · 보도자료</h2>
          </div>
          <Link className="btn btn-ghost" href="/news/">
            전체 보기 →
          </Link>
        </div>
        <div className="wrap news-list">
          {latestNews.map((item) => (
            <Link className="news-row" key={item.slug} data-reveal href="/news/">
              <time className="news-d" dateTime={item.date}>
                {formatDate(item.date)}
              </time>
              <span className="news-t">{item.title}</span>
              <span className="news-tag">{item.category}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="sec" id="contact" aria-labelledby="contact-heading">
        <div className="wrap two-col align-start sec-pad">
          <div data-reveal>
            <p className="kicker">05 — CONTACT</p>
            <h2 className="mb-md" id="contact-heading">
              오시는 길
            </h2>
            <dl className="deflist">
              {contactDetails.map((detail) => (
                <div className="def" key={detail.term}>
                  <dt>{detail.term}</dt>
                  <dd>{detail.description}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="ph map" data-reveal>
            <div className="ph-lines" aria-hidden="true" />
            <span className="ph-label">[ MAP ] 창원 본사 약도</span>
          </div>
        </div>
      </section>
    </main>
  );
}
