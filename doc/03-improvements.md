# 03 — 무엇을 보완해야 하는가

우선순위 순. **P1은 사용자가 체감하는 문제**, P2는 운영·검색 노출, P3은 장기 유지보수.

각 항목은 **현상(측정값) · 원인 · 조치(실행 가능) · 완료 조건**을 가진다.

---

# P1 — 지금 사용자가 손해를 보는 것

## 1. 이미지가 7MB다 ⬜

### 현상

```
biz-01-simulation.jpg   1536x1024   1732 KB
biz-02-gripper.jpg      1672x940    1480 KB
biz-03-perception.jpg   1536x1024   2341 KB
hero-main.jpg           1672x941    1322 KB
                                   ─────────
                                    6875 KB
```

홈 첫 화면에서만 히어로 1.3MB + 사업영역 이미지 3장이 뜬다. **LTE에서 첫 화면까지 수 초.**

1500px대 JPEG이 1.5~2.3MB라는 건 압축이 거의 안 걸렸다는 뜻이다. 같은 화질로 **10분의 1 이하**가 정상이다.

### 실제 표시 크기

| 이미지 | CSS 표시 크기(데스크톱 1440) | 원본 | 과잉 |
|---|---|---|---|
| hero | ~1200 × 560 | 1672 × 941 | 1.4× |
| biz-stage | ~600 × 620 | 1536 × 1024 | 2.5× |
| feature-ph (`/business/`) | ~570 × 300 | 1536 × 1024 | 2.7× |

### 조치

`sharp`는 이미 `node_modules`에 있다(Next 의존성). 별도 설치가 필요 없다.

`scripts/optimize-images.mjs`를 만든다:

```js
// 원본을 public/img/src/ 로 옮긴 뒤 실행한다.
// 표시 크기 기준 1x/2x 두 벌을 WebP로 뽑는다.
import sharp from 'sharp';
import { readdir, mkdir } from 'node:fs/promises';

const SRC = 'public/img/src';
const OUT = 'public/img';
const WIDTHS = [800, 1600];

await mkdir(OUT, { recursive: true });

for (const file of await readdir(SRC)) {
  if (!/\.(jpe?g|png)$/i.test(file)) continue;
  const base = file.replace(/\.[^.]+$/, '');
  for (const w of WIDTHS) {
    const suffix = w === WIDTHS.at(-1) ? '' : `@${w}`;
    await sharp(`${SRC}/${file}`)
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: 78, effort: 6 })
      .toFile(`${OUT}/${base}${suffix}.webp`);
  }
}
```

```bash
mkdir -p public/img/src && git mv public/img/*.jpg public/img/src/
node scripts/optimize-images.mjs
du -sh public/img
```

그다음 `<img>`에 `srcset`을 붙인다. **`next/image`는 도움이 되지 않는다** — 정적 export에서는 `unoptimized: true`라 `srcset`을 만들어 주지 않는다. 직접 쓴다.

```tsx
// components/HeroVisual.tsx
<img
  className="ph-img"
  src={asset('/img/hero-main.webp')}
  srcSet={`${asset('/img/hero-main@800.webp')} 800w, ${asset('/img/hero-main.webp')} 1600w`}
  sizes="(max-width: 1080px) 100vw, 1200px"
  alt="부품을 파지한 6축 로봇 매니퓰레이터"
  width={1600} height={900}
  fetchPriority="high"
/>
```

사업영역 이미지는 `sizes="(max-width: 1080px) 100vw, 600px"`, `loading="lazy"`.

`data/site.ts`의 `image.src` 확장자를 `.webp`로 바꾸는 것도 잊지 않는다.

> **`width`/`height`는 반드시 유지한다.** `.ph-img`가 `position: absolute; inset: 0`이라 레이아웃 시프트는 안 생기지만, 속성이 있어야 브라우저가 디코딩 버퍼를 미리 잡는다.

### 완료 조건

- `du -sh public/img` ≤ **500KB** (`src/` 제외)
- 홈에서 이미지 4장이 정상 표시
- Lighthouse Performance ≥ 95

### 남는 질문

`public/img/src/`의 원본을 git에 둘 것인가. 두면 저장소가 7MB 무거워지고, 빼면 재생성이 불가능하다.
**권장:** 원본은 커밋하고 `.gitattributes`로 Git LFS에 넘긴다. 사용자 확인 필요.

---

## 2. 폰트를 외부 CDN에서 가져온다 ⬜

### 현상

`app/layout.tsx`가 `fonts.googleapis.com`을 링크하고, `styles/nocturne.css` 1행이 **또 한 번** `@import`한다. 요청이 중복된다.

```
layout.tsx      → Inter 300..600 + Noto Sans KR 300..700
nocturne.css:2  → Inter 400..700          ← 중복
```

렌더 블로킹이고, 외부 도메인 왕복이 붙고, EU에서는 Google Fonts CDN 사용 자체가 GDPR 이슈로 지적된 전례가 있다.

### 조치

`next/font`로 자체 호스팅한다. 빌드 시점에 폰트를 받아 `_next/static`에 넣으므로 런타임 외부 요청이 사라진다.

```tsx
// app/layout.tsx
import { Inter, Noto_Sans_KR } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'], weight: ['300','400','500','600'],
  variable: '--font-inter', display: 'swap',
});
const notoKr = Noto_Sans_KR({
  subsets: ['latin'], weight: ['300','400','500','700'],
  variable: '--font-noto-kr', display: 'swap',
});

// <html lang="ko" className={`${inter.variable} ${notoKr.variable}`}>
// <head>의 preconnect/stylesheet <link> 3개는 삭제
```

```css
/* styles/nocturne.css — 2행의 @import 삭제 */

/* styles/site.css */
body,
h1, h2, h3, h4 {
  font-family: var(--font-inter), var(--font-noto-kr), system-ui, sans-serif;
}
```

> **주의:** `next/font`는 빌드 중 Google에서 폰트를 내려받는다. 네트워크가 막힌 CI에서는 빌드가 실패한다. GitHub Actions는 문제없다. 오프라인 빌드가 필요하면 `next/font/local` + 저장소에 폰트 파일 커밋으로 간다.

### 완료 조건

- 빌드 산출물 HTML에 `fonts.googleapis.com`이 0회 등장
  ```bash
  npm run build && grep -rc 'fonts.googleapis' out/*.html out/**/*.html
  ```
- 한글·영문 렌더가 이전과 동일

---

## 3. favicon이 없다 ⬜

### 현상

브라우저 탭에 기본 문서 아이콘이 뜬다. `/favicon.ico` 요청이 404다.

### 조치

App Router는 `app/` 아래 파일 이름으로 인식한다.

| 파일 | 용도 |
|---|---|
| `app/icon.svg` | favicon |
| `app/apple-icon.png` (180×180) | iOS 홈 화면 |
| `app/opengraph-image.png` (1200×630) | 공유 카드 |

`app/icon.svg` 초안 — nocturne 토큰 색을 그대로 쓴다:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="7" fill="#161826"/>
  <path d="M8 23 16 9l8 14" stroke="#9184d9" stroke-width="2.5"
        fill="none" stroke-linejoin="round"/>
</svg>
```

> 로고 디자인은 `frontend-design` 스킬을 거쳐서 만든다. 위 SVG는 자리 채우기다.

### 완료 조건

`out/`에 아이콘이 생성되고 탭에 표시된다.

---

# P2 — 검색 노출과 운영

## 4. sitemap / robots ⬜

```ts
// app/sitemap.ts
import type { MetadataRoute } from 'next';

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ejlog.github.io/company-intro';

export default function sitemap(): MetadataRoute.Sitemap {
  return ['', '/about', '/business', '/history', '/news'].map((path) => ({
    url: `${BASE}${path}/`,
    lastModified: new Date(),
    changeFrequency: path === '/news' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : 0.8,
  }));
}
```

```ts
// app/robots.ts
import type { MetadataRoute } from 'next';

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ejlog.github.io/company-intro';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${BASE}/sitemap.xml`,
  };
}
```

**완료 조건:** `out/sitemap.xml`, `out/robots.txt` 생성. 배포 후 각각 200.

---

## 5. 구조화 데이터 (JSON-LD) ⬜

기업 소개 사이트는 검색 결과의 지식 패널에 실릴 수 있다. `Organization` 스키마를 넣는다.

```tsx
// app/layout.tsx — <body> 안
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: company.nameKo,
    alternateName: company.nameEn,
    url: process.env.NEXT_PUBLIC_SITE_URL,
    email: company.email,
    telephone: company.tel,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'KR',
      addressRegion: '경기도',
      streetAddress: company.addressShort,
    },
    foundingDate: '2019-03-12',
  }) }}
/>
```

`dangerouslySetInnerHTML`이지만 입력이 전부 `data/site.ts`의 우리 상수라 사용자 입력이 섞이지 않는다. **외부에서 온 값을 여기 넣지 않는다.**

**완료 조건:** [Rich Results Test](https://search.google.com/test/rich-results)에서 Organization 인식.

---

## 6. 404 페이지가 기본값이다 ⬜

`app/not-found.tsx`가 없어 Next 기본 화면이 나온다. 사이트 디자인과 완전히 다르다.

```tsx
// app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="page">
      <div className="wrap">
        <p className="kicker">404 — NOT FOUND</p>
        <h1 className="page-title">페이지를 찾을 수 없습니다</h1>
        <p className="page-lead">주소가 바뀌었거나 삭제된 페이지입니다.</p>
        <Link className="btn btn-primary mt-lg" href="/">홈으로 돌아가기</Link>
      </div>
    </main>
  );
}
```

> GitHub Pages는 `out/404.html`을 자동으로 404 응답에 쓴다. 워크플로에 추가 설정이 필요 없다.

---

## 7. 접근성 항목 ⬜

`doc/02-semantics.md`의 **B3(스킵 링크)**, **B4(포커스 표시)**, **A11(`role="list"`)**.
이 셋은 접근성 관점에서 P2가 아니라 **P1에 가깝다** — 키보드 사용자는 지금 본문에 닿기까지 매번 링크 6개를 지나야 하고, 어디에 포커스가 있는지 보이지 않는다.

---

# P3 — 유지보수

## 8. 의존성 취약점 3건 (high) ⬜

```
sharp   <0.35.0   libvips CVE-2026-33327 / 33328 / 35590 / 35591
postcss <=8.5.22
```

둘 다 **Next의 전이 의존성**이고 직접 참조하지 않는다.

**현재 노출도:** `sharp`는 `next/image` 최적화기에서만 쓰이는데, 이 사이트는 `output: 'export'` + `unoptimized: true`라 **런타임에 실행되지 않는다.** `postcss`도 빌드 타임 전용이다. 즉 배포된 정적 파일에는 어느 쪽도 실려 있지 않다.

**해소:** `npm audit fix --force`가 Next 16으로 올린다 — breaking change다.

**권장 순서:**
1. Next 15 패치 릴리스가 의존성을 올릴 때까지 기다린다 (주기적으로 `npm audit` 확인).
2. 그래도 남으면 별도 브랜치에서 Next 16 업그레이드 → [codemod](https://nextjs.org/docs/app/guides/upgrading) 적용 → 전 페이지 시각 회귀 확인.

> **⚠️ P1 항목 1(이미지 최적화)에서 `sharp`를 빌드 스크립트로 쓰기로 했다면**, 그때는 실제로 실행되는 코드가 되므로 우선순위가 올라간다. `npm i -D sharp@latest`로 최신 버전을 devDependency에 명시하는 편이 낫다.

---

## 9. 테스트가 없다 ⬜

지금은 회귀를 잡을 수단이 `npm run build`뿐이다. 스티키 스테이지·스크롤 리빌 같은 스크롤 의존 동작은 특히 조용히 깨지기 쉽다.

**최소 구성 — Playwright 스모크:**

```bash
npm i -D @playwright/test
```

```ts
// e2e/smoke.spec.ts
import { test, expect } from '@playwright/test';

const pages = ['/', '/about/', '/business/', '/history/', '/news/'];

for (const path of pages) {
  test(`${path} 렌더 + 콘솔 오류 없음`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto(path);
    await expect(page.locator('h1')).toHaveCount(1);
    expect(errors).toEqual([]);
  });
}

test('사업영역 스테이지가 스크롤에 반응한다', async ({ page }) => {
  await page.goto('/');
  await page.locator('.biz-item').nth(2).scrollIntoViewIfNeeded();
  await expect(page.locator('.biz-pane').nth(2)).toHaveClass(/is-active/);
});

test('모바일 드로어가 열린다', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.click('.nav-toggle');
  await expect(page.locator('.nav-links')).toHaveClass(/is-open/);
});
```

> 이 환경에는 Chromium이 `/opt/pw-browsers/chromium`에 이미 있다. `playwright install`을 실행하지 말고 `executablePath`로 가리킨다.

`.github/workflows/`에 CI 잡을 추가해 PR마다 돌린다.

---

## 10. 콘텐츠가 코드에 묶여 있다 ⬜

`data/site.ts`가 5개 HTML의 복붙을 없앤 건 개선이지만, 뉴스를 하나 올리려면 여전히 **개발자가 TypeScript를 고치고 배포**해야 한다.

**단계적 대안:**

| 단계 | 방식 | 비용 |
|---|---|---|
| 1 | 지금 그대로 | 0 |
| 2 | `content/news/*.mdx` + `@next/mdx` | 낮음. 저장소 안에서 해결 |
| 3 | 헤드리스 CMS(Contentful, Sanity) + 빌드 훅 | 중간. 외부 의존 |

**2단계를 권장한다.** 정적 export와 잘 맞고 외부 서비스가 필요 없다.
3단계는 **사용자 결정 사항**이다 — 비용과 데이터 위치가 걸린다. 임의로 진행하지 않는다.

---

## 11. 헤더의 `KR / EN`이 동작하지 않는다 ⬜

지금은 장식용 텍스트다. 링크도 버튼도 아니다.

**둘 중 하나를 골라야 한다:**

- **A. 제거** — 영문 페이지 계획이 없으면 없는 기능을 광고하지 않는다. 5분.
- **B. 구현** — `app/[locale]/` 라우트 그룹 + `data/site.{ko,en}.ts`. 카피 전체 번역이 필요하다.

**사용자 결정 사항.** 그때까지는 A(제거)가 정직하다.

---

# 우선순위 요약

| # | 항목 | 우선순위 | 예상 규모 | 사용자 결정 필요 |
|---|---|---|---|---|
| 1 | 이미지 최적화 (7MB → 500KB) | **P1** | 반나절 | 원본 LFS 여부 |
| 7 | 스킵 링크 · 포커스 표시 | **P1** | 30분 | — |
| 2 | 폰트 자체 호스팅 | P1 | 1시간 | — |
| 3 | favicon / OG 이미지 | P1 | 1시간 | 로고 디자인 |
| 6 | 404 페이지 | P2 | 20분 | — |
| 4 | sitemap / robots | P2 | 20분 | — |
| 5 | JSON-LD | P2 | 30분 | — |
| 9 | Playwright 스모크 테스트 | P3 | 2시간 | — |
| 8 | 의존성 취약점 | P3 | 대기 | Next 16 승인 |
| 10 | 콘텐츠를 MDX로 | P3 | 1일 | CMS 방향 |
| 11 | KR/EN 처리 | P3 | 5분 or 3일 | **제거 vs 구현** |
