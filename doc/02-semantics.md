# 02 — 어떻게 시멘틱하게 바꿀 수 있는가

원본 정적 HTML은 거의 모든 것이 `<div>`와 `<span>`이었다. 이관하면서 일부는 이미 고쳤고, 나머지는 여기 남긴다.

각 항목은 **적용 여부 · 대상 파일 · before/after 코드 · 왜 · 확인 방법**을 가진다. 항목끼리 의존성이 없으므로 골라서 실행해도 된다.

> **주의 — 클래스 이름을 바꾸지 말 것.**
> `styles/site.css`와 `styles/nocturne.css`는 클래스 선택자로 동작한다. 태그만 바꾸고 클래스는 그대로 둔다.
> 태그를 바꾸면 UA 기본 스타일(마진, `list-style`, `font-size`)이 따라 들어오므로, **B그룹**은 CSS 보정이 함께 필요하다.

---

## A그룹 — 무비용 (CSS 변경 없이 태그/속성만)

### A1. 랜드마크와 내비게이션 레이블 — ✅ 적용됨

`components/Nav.tsx`, `components/Footer.tsx`

```diff
- <nav class="nav-links" id="navLinks">
+ <nav className="nav-links" id="navLinks" aria-label="주요 메뉴">

- <div class="foot-cols">
+ <nav className="foot-cols" aria-label="푸터 메뉴">
```

**왜:** 한 페이지에 `<nav>`가 둘 이상이면 스크린 리더의 랜드마크 목록에 "탐색"이 두 개 뜨고 구분이 안 된다. `aria-label`이 이름을 준다.

---

### A2. 현재 페이지 표시 — ✅ 적용됨

`components/Nav.tsx`

원본은 페이지마다 `class="is-active"`를 손으로 넣어 두었다(=시각 표시만, 보조기기에는 아무 정보도 없음). 이제 라우트에서 파생된다.

```tsx
const isActive = !item.href.includes('#') && pathname.startsWith(item.href);
<Link className={isActive ? 'is-active' : undefined}
      aria-current={isActive ? 'page' : undefined}>
```

**확인:** `/about/`에서 "회사소개"가 `aria-current="page"`를 가진다.

---

### A3. 날짜는 `<time>` — ✅ 적용됨

`app/news/page.tsx`, `app/page.tsx`, `app/history/page.tsx`

```diff
- <span class="news-d">2026.07.28</span>
+ <time className="news-d" dateTime={item.date}>{formatDate(item.date)}</time>
```

`data/site.ts`가 날짜를 ISO(`2026-07-28`)로 들고 있고, `formatDate()`가 표시용 `2026.07.28`을 만든다.

**왜:** `2026.07.28`은 사람만 읽는다. `dateTime`이 있어야 검색엔진·리더가 날짜로 인식한다. 나중에 정렬·필터를 붙일 때도 이 값이 기준이 된다.

**확인:** `grep -o '<time[^>]*>' out/news/index.html` — 6건 모두 `datetime` 보유.

---

### A4. 반복 항목은 `<article>` — ✅ 적용됨

`components/BusinessShowcase.tsx`, `app/news/page.tsx`

뉴스 카드와 사업영역 항목은 각각 독립적으로 말이 되는 단위이므로 `<article>`.

---

### A5. 섹션에 이름 붙이기 — ✅ 적용됨

`app/page.tsx`

```diff
- <section class="sec" id="about">
+ <section className="sec" id="about" aria-labelledby="about-heading">
-   <h2>회사 소개</h2>
+   <h2 id="about-heading">회사 소개</h2>
```

**왜:** 이름 없는 `<section>`은 랜드마크가 되지 않는다. `aria-labelledby`가 붙어야 "회사 소개 영역"으로 목록에 뜬다.

---

### A6. 헤딩 레벨을 크기가 아니라 구조로 — ✅ 적용됨

원본은 `h1` 다음에 바로 `h3`가 오는 곳이 여럿이었다(크기가 마음에 들어서 h3를 고른 경우).

| 위치 | before | after |
|---|---|---|
| `/about/` 3단 원칙 | `h3` | `h2` |
| `/about/` 회사 개요 | `h3` | `h2.sub-h` |
| `/business/` 각 사업 | `h2` | `h2` (유지) |
| `/history/` 연도 | `div.hist-year` | `h2.hist-year` |
| `/news/` 카드 제목 | `h3` | `h2` |

크기는 CSS가 정한다 (`.three-col h2, .three-col h3`, `.sub-h`, `.news-body h2, .news-body h3`).

**확인:** `01-roadmap.md` Phase 2.4의 헤딩 카운트 스크립트.

---

### A7. 버튼에 `type` — ✅ 적용됨

```diff
- <button class="nav-toggle" ...>
+ <button type="button" className="nav-toggle" ... aria-controls="navLinks">
```

`type` 없는 `<button>`은 폼 안에서 submit으로 동작한다. 지금은 폼이 없지만 나중에 생기면 조용히 깨진다.

---

### A8. 장식 요소는 접근성 트리에서 제외 — ✅ 적용됨

```diff
- <div class="hero-glow"></div>
+ <div className="hero-glow" aria-hidden="true" />
```

`.ph-lines`, `.hero-glow`, 그리고 `biz-stage` 전체가 `aria-hidden`이다.
**`biz-stage`가 통째로 숨겨진 이유:** 스테이지는 왼쪽 목록의 시각적 반복이다. 읽히면 같은 내용이 두 번 나온다. 이미지 `alt`도 빈 문자열이다.

---

### A9. 주소는 `<address>` — ⬜ 미적용

`components/Footer.tsx`, `app/page.tsx`

```diff
- <p className="foot-addr">
+ <address className="foot-addr">
    {company.address}<br />
    {`T. ${company.tel} · `}<a href={`mailto:${company.email}`}>{company.email}</a>
- </p>
+ </address>
```

**CSS 보정 필요:** `<address>`는 UA 기본이 `font-style: italic`이다.

```css
/* styles/site.css */
.foot-addr { font-style: normal; }
```

**왜:** `<address>`는 "이 문서/조직의 연락처"라는 뜻이다. 스타일용이 아니라 의미용 태그다.

**확인:** 푸터 주소가 기울어 보이지 않는다.

---

### A10. 전화번호도 링크로 — ⬜ 미적용

`app/page.tsx` (contact 섹션), `components/Footer.tsx`

```diff
- <dd>{detail.description}</dd>
+ <dd>{detail.href
+       ? <a href={detail.href}>{detail.description}</a>
+       : detail.description}</dd>
```

`data/site.ts`의 `contactDetails`에 `href`를 추가한다:

```ts
export const contactDetails = [
  { term: 'ADDRESS', description: company.address },
  { term: 'TEL',     description: company.tel,   href: `tel:${company.tel.replaceAll('-', '')}` },
  { term: 'EMAIL',   description: company.email, href: `mailto:${company.email}` },
  { term: 'HOURS',   description: company.hours },
];
```

**왜:** 모바일에서 전화번호를 눌러 바로 걸 수 있다. 기업 소개 사이트에서 실질적인 전환 경로다.

---

### A11. 리스트 시맨틱 보존 — ⬜ 미적용

`app/news/page.tsx`, `app/business/page.tsx`, `components/BusinessShowcase.tsx`, `app/history/page.tsx`

`list-style: none`을 주면 **Safari + VoiceOver가 목록 시맨틱을 버린다**(의도된 동작이다). `role="list"`로 되살린다.

```diff
- <ul className="tags">
+ <ul className="tags" role="list">

- <ul className="news-grid">
+ <ul className="news-grid" role="list">

- <ul className="hist-items">
+ <ul className="hist-items" role="list">
```

**확인:** macOS Safari + VoiceOver에서 "목록, 3개 항목"으로 읽힌다.

---

## B그룹 — CSS 보정이 함께 필요한 변경

### B1. 통계 수치를 `<dl>`로 — ⬜ 미적용

`app/page.tsx`

지금은 `div.stat > div.stat-v + div.stat-k`. 실제로는 "설립 연도 = 2019"라는 용어–값 쌍이다.

```diff
- <div className="wrap stats-grid">
+ <dl className="wrap stats-grid">
    {stats.map((stat) => (
-     <div className="stat" key={stat.label} data-reveal>
-       <div className="stat-v">{stat.value}</div>
-       <div className="stat-k">{stat.label}</div>
-     </div>
+     <div className="stat" key={stat.label} data-reveal>
+       <dt className="stat-k">{stat.label}</dt>
+       <dd className="stat-v">{stat.value}</dd>
+     </div>
    ))}
- </div>
+ </dl>
```

**순서에 주의:** `<dl>`은 `dt`가 `dd`보다 먼저 와야 한다. 그런데 디자인은 **값이 위, 라벨이 아래**다. 마크업 순서를 지키고 시각 순서만 뒤집는다.

```css
/* styles/site.css */
.stats-grid { margin: 0; }               /* dl 기본 마진 제거 */
.stat { display: flex; flex-direction: column-reverse; }  /* dt/dd 시각 순서 반전 */
.stat dd { margin: 0; }                  /* dd 기본 들여쓰기 제거 */
```

> `.stats-grid`는 `.wrap`과 같은 요소에 붙어 있다. `padding: 0`을 주면 `.wrap`의 좌우 여백이 죽는다 — `margin`만 건드린다.

**왜 `column-reverse`이고 `order`가 아닌가:** `order`는 시각 순서만 바꾸고 탭/읽기 순서는 DOM을 따르므로 둘이 어긋난다. 여기서는 두 요소가 한 쌍이라 어긋나도 의미가 깨지지 않고, `column-reverse`가 규칙 하나로 끝난다.

**확인:** 통계 4개가 이전과 똑같이 보이고, 접근성 트리에서 "설립 연도: 2019"로 읽힌다.

---

### B2. 사업영역 목록을 `<ol>`로 — ⬜ 미적용

`components/BusinessShowcase.tsx`

4개 사업영역은 순서 있는 목록이고, 오른쪽 스테이지의 점 인디케이터가 그 순서를 이미 시각화하고 있다.

```diff
- <div className="biz-list">
+ <ol className="biz-list" role="list">
    {businessAreas.map((area, index) => (
-     <article className={...} ref={...}>
+     <li key={area.id}>
+       <article className={...} ref={...}>
          ...
-     </article>
+       </article>
+     </li>
    ))}
- </div>
+ </ol>
```

**CSS 보정:**

```css
/* styles/site.css */
.biz-list { list-style: none; margin: 0; padding-left: 0; padding-top: 14vh; }
@media (max-width: 1080px) { .biz-list { padding-top: 0; } }
```

> 기존 `.biz-list { padding-top: 14vh; }` 규칙을 위 규칙으로 **교체**한다. `padding: 0` 단축 속성을 쓰면 `14vh`가 지워진다.

**`ref` 주의:** 스크롤 추적은 `article`의 `getBoundingClientRect()`를 쓴다. `li`에 ref를 옮기면 높이 계산이 달라진다 — **`article`에 그대로 둔다.**

**확인:** 스크롤에 따라 스테이지가 전환되고, 활성 항목만 불투명하다.

---

### B3. 스킵 링크 — ⬜ 미적용

`app/layout.tsx` + `styles/site.css`

키보드 사용자가 매 페이지 nav 6개를 지나야 본문에 닿는다.

```diff
  <body>
+   <a className="skip-link" href="#main">본문으로 건너뛰기</a>
    <Nav />
    {children}
```

각 페이지의 `<main>`에 `id="main"`을 준다 (홈은 지금 `id="top"` — `id="main"`으로 바꾸거나 둘 다 준다).

```css
/* styles/site.css */
.skip-link {
  position: absolute; left: 8px; top: -60px; z-index: 100;
  padding: 10px 16px; border-radius: var(--radius-sm);
  background: var(--color-surface); color: var(--color-text);
  border: 1px solid var(--color-accent);
  transition: top .2s ease;
}
.skip-link:focus { top: 8px; }
```

**확인:** 페이지 로드 후 `Tab` 한 번 → 좌상단에 링크가 나타난다. `Enter` → 본문으로 이동.

---

### B4. 포커스 표시 — ⬜ 미적용

`styles/site.css`

현재 링크·버튼에 `:focus-visible` 스타일이 없다. 브라우저 기본 아웃라인은 이 어두운 배경에서 거의 안 보인다.

```css
/* styles/site.css */
:where(a, button, [tabindex]):focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 3px;
  border-radius: var(--radius-sm);
}
```

`:where()`로 감싸 특이도를 0으로 만들어, 컴포넌트가 필요하면 덮어쓸 수 있게 한다.
`nocturne.css`에 이미 `.seg-opt:has(input:focus-visible)` 패턴이 있으니 같은 계열이다.

**확인:** `Tab`으로 nav를 훑을 때 각 링크에 보라색 링이 보인다.

---

### B5. 뉴스 카드를 실제 링크로 — ⬜ 미적용 (Phase 5.1 선행 필요)

`/news/`의 카드는 지금 링크가 아니다. 홈의 뉴스 행은 링크지만 전부 `/news/`로만 간다.
`app/news/[slug]/page.tsx`가 생긴 뒤에 처리한다.

```diff
  <article className="card news-card" data-reveal>
    ...
-   <h2>{item.title}</h2>
+   <h2><Link className="news-card-link" href={`/news/${item.slug}/`}>{item.title}</Link></h2>
```

**"카드 전체 클릭"은 제목만 링크로 두고 CSS로 확장한다** — 카드 전체를 `<a>`로 감싸면 안에 있는 텍스트를 드래그 선택할 수 없고, 링크 이름이 카드 전체 텍스트가 되어 리더에서 장황해진다.

```css
.news-card { position: relative; }
.news-card-link::after { content: ''; position: absolute; inset: 0; }
```

---

## 적용 순서 제안

1. **A9 → A10 → A11** — 파일 3개, CSS 한 줄. 15분.
2. **B4 → B3** — 키보드 접근성. 실사용 영향이 가장 크다.
3. **B1 → B2** — 구조 변경. CSS 보정이 있으니 브라우저로 확인하며.
4. **B5** — Phase 5.1 이후.

각 묶음이 끝날 때마다:

```bash
npm run build && npx serve out -p 3000 &
npx @axe-core/cli http://localhost:3000
```

---

## 체크리스트

- [x] A1 랜드마크 레이블
- [x] A2 `aria-current`
- [x] A3 `<time>`
- [x] A4 `<article>`
- [x] A5 `aria-labelledby`
- [x] A6 헤딩 레벨
- [x] A7 `button type`
- [x] A8 `aria-hidden`
- [ ] A9 `<address>`
- [ ] A10 `tel:` / `mailto:`
- [ ] A11 `role="list"`
- [ ] B1 통계 `<dl>`
- [ ] B2 사업영역 `<ol>`
- [ ] B3 스킵 링크
- [ ] B4 포커스 표시
- [ ] B5 뉴스 카드 링크
