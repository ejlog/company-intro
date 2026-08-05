import type { Metadata } from 'next';
import { corporateProfile, principles } from '@/data/site';

export const metadata: Metadata = {
  title: '회사 소개',
  description:
    '애드센(ADDSEN)은 2019년 설립된 피지컬 AI 연구개발 기업입니다. 인식·판단·제어를 하나의 학습 시스템으로 통합해, 정형화되지 않은 현장에서도 스스로 작업을 수행하는 로봇 소프트웨어를 만듭니다.',
};

export default function AboutPage() {
  return (
    <main className="page">
      <div className="wrap">
        <p className="kicker">01 — ABOUT</p>
        <h1 className="page-title">회사 소개</h1>
        <p className="page-lead">
          애드센(ADDSEN)은 2019년 설립된 피지컬 AI 연구개발 기업입니다. 인식·판단·제어를 하나의
          학습 시스템으로 통합해, 정형화되지 않은 현장에서도 스스로 작업을 수행하는 로봇
          소프트웨어를 만듭니다.
        </p>

        <div className="ph hero-ph">
          <div className="ph-lines" aria-hidden="true" />
          <span className="ph-label">[ IMAGE ] 판교 연구소 전경</span>
        </div>

        <div className="three-col ruled-top">
          {principles.map((principle) => (
            <div key={principle.kicker} data-reveal>
              <p className="kicker">{principle.kicker}</p>
              <h2>{principle.title}</h2>
              <p className="muted">{principle.body}</p>
            </div>
          ))}
        </div>

        <section className="ruled-top mt-lg" aria-labelledby="profile-heading">
          <h2 className="sub-h mb-md" id="profile-heading">
            회사 개요 <span className="muted sm">Corporate Profile</span>
          </h2>
          <dl className="deflist two">
            {corporateProfile.map((row) => (
              <div className="def" key={row.term}>
                <dt>{row.term}</dt>
                <dd>{row.description}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </main>
  );
}
