import type { Metadata, Viewport } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';
import { company } from '@/data/site';
import '@/styles/nocturne.css';
import '@/styles/site.css';

export const metadata: Metadata = {
  // Absolute URLs for OG/canonical tags. Overridable so a custom domain does
  // not require a code change.
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ejlog.github.io/company-intro'),
  title: {
    default: `${company.nameKo} — ${company.tagline}`,
    template: `%s — ${company.brand}`,
  },
  description:
    '애드센은 로봇이 스스로 보고, 판단하고, 움직이도록 하는 피지컬 AI를 연구 개발합니다. 파운데이션 모델과 실제 하드웨어를 함께 설계하여 제조, 물류, 인프라 현장의 노동을 자동화합니다.',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: company.brand,
  },
};

export const viewport: Viewport = {
  themeColor: '#161826',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Noto+Sans+KR:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Nav />
        {children}
        <Footer />
        <ScrollReveal />
      </body>
    </html>
  );
}
