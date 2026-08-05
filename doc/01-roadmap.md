# 01 — 무엇을 진행해야 하는가

단계 순서대로 진행한다. 각 단계는 **실행 명령**과 **완료 조건(DoD)**을 가진다.
완료하면 체크박스를 갱신하고 같은 커밋에 담는다.

---

## Phase 0 — 완료됨

정적 HTML 사이트를 Next.js App Router + 정적 export로 이관한 단계.

- [x] **0.1** 정적 사이트 원본을 `main`에 커밋
- [x] **0.2** Next.js 15 + React 19 스캐폴딩, `output: 'export'`, `trailingSlash: true`
- [x] **0.3** 5개 페이지를 App Router 라우트로 이관, Nav/Footer를 `layout.tsx`로 공용화
      → 5장에 복붙되어 있던 nav·footer 마크업 제거
- [x] **0.4** `site.js`를 클라이언트 컴포넌트로 이관
      (`ScrollReveal`, `HeroVisual`, `BusinessShowcase`, `Nav` 드로어)
- [x] **0.5** 카피·목록 데이터를 `data/site.ts`로 통합
- [x] **0.6** `basePath` 처리 (`lib/asset.ts` + `NEXT_PUBLIC_BASE_PATH`)
- [x] **0.7** GitHub Pages 배포 워크플로 (`.github/workflows/deploy.yml`)
- [x] **0.8** `CLAUDE.md` — 필수 스킬 규칙
- [x] **0.9** `doc/` — 작업 문서

**검증 결과:** 6개 라우트 전부 정적 생성, First Load JS 103–109 kB, 콘솔·네트워크 오류 없음(폰트 CDN 제외 — 샌드박스 차단), 모바일 드로어·스티키 스테이지·스크롤 리빌 동작 확인.

---

## Phase 1 — 배포를 실제로 켠다

가장 먼저 할 일. 이걸 해야 나머지 작업의 결과를 눈으로 볼 수 있다.

- [ ] **1.1 저장소에서 Pages를 활성화한다**

  GitHub 웹 UI에서: `Settings → Pages → Build and deployment → Source` 를 **`GitHub Actions`** 로 바꾼다.
  (`Deploy from a branch`가 아니다. 워크플로가 아티팩트를 올리는 방식이라 반드시 Actions여야 한다.)

  **DoD:** `main`에 푸시했을 때 Actions 탭에 `Deploy to GitHub Pages`가 뜨고 초록색으로 끝난다.

- [ ] **1.2 배포된 사이트를 실제로 확인한다**

  ```
  https://ejlog.github.io/company-intro/
  ```

  체크리스트:
  - [ ] 히어로 이미지가 보인다 (깨지면 `asset()` 누락 — `CLAUDE.md` 3절)
  - [ ] `/about/`, `/business/`, `/history/`, `/news/` 가 200으로 열린다
  - [ ] 없는 주소(`/nope/`)에서 404 페이지가 뜬다
  - [ ] 사업영역 스티키 스테이지가 스크롤에 따라 전환된다
  - [ ] 모바일 폭에서 햄버거 메뉴가 열린다

  **DoD:** 위 5개 전부 통과.

- [ ] **1.3 배포 실패 시 진단 순서**

  | 증상 | 원인 | 조치 |
  |---|---|---|
  | CSS 없이 텍스트만 나옴 | `_next/` 가 Jekyll에 걸러짐 | 워크플로의 `touch out/.nojekyll` 확인 |
  | 이미지만 404 | `asset()` 미사용 | `grep -rn 'src="/img' app components` |
  | 전 페이지 404 | Pages Source가 Actions가 아님 | 1.1 다시 |
  | 빌드 단계 실패 | 타입 오류 | 로컬에서 `npm run typecheck` |

---

## Phase 2 — 시멘틱 마크업 정리

`doc/02-semantics.md`를 실행한다. Phase 1과 독립이라 병행 가능.

- [ ] **2.1** `02-semantics.md`의 **A그룹(무비용)** 전부 적용
- [ ] **2.2** `02-semantics.md`의 **B그룹(CSS 동반)** 적용
- [ ] **2.3** 접근성 자동 검사 통과

  ```bash
  npm run build
  npx serve out -p 3000 &
  npx @axe-core/cli http://localhost:3000 http://localhost:3000/about/ \
      http://localhost:3000/business/ http://localhost:3000/history/ \
      http://localhost:3000/news/
  ```

  **DoD:** critical / serious 위반 0건.

- [ ] **2.4** 헤딩 아웃라인 확인 — 각 페이지에 `h1`이 정확히 하나, 레벨 건너뛰기 없음

  ```bash
  npm run build
  for f in out/index.html out/about/index.html out/business/index.html \
           out/history/index.html out/news/index.html; do
    echo "== $f"; grep -o '<h[1-6]' "$f" | sort | uniq -c
  done
  ```

---

## Phase 3 — 성능

`doc/03-improvements.md`의 P1 항목을 실행한다.

- [ ] **3.1** 이미지 최적화 (7MB → 목표 500KB 이하). `03-improvements.md` §1
- [ ] **3.2** 폰트 자체 호스팅. `03-improvements.md` §2
- [ ] **3.3** Lighthouse 측정

  ```bash
  npm run build && npx serve out -p 3000 &
  npx lighthouse http://localhost:3000 --preset=desktop --view
  ```

  **DoD:** Performance ≥ 95, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95.

---

## Phase 4 — SEO · 메타데이터

`doc/03-improvements.md` §3–§5.

- [ ] **4.1** favicon / apple-touch-icon
- [ ] **4.2** OG 이미지
- [ ] **4.3** `sitemap.ts`, `robots.ts`
- [ ] **4.4** JSON-LD `Organization` 구조화 데이터

  **DoD:** `out/sitemap.xml`과 `out/robots.txt`가 생성되고, 배포 후 [Rich Results Test](https://search.google.com/test/rich-results)에서 Organization이 인식된다.

---

## Phase 5 — 콘텐츠 구조 확장

지금은 뉴스가 `data/site.ts`의 배열이고 개별 페이지가 없다. 실제 운영에 들어가면 필요해지는 것들.

- [ ] **5.1 뉴스 상세 페이지** — `app/news/[slug]/page.tsx` + `generateStaticParams()`
      (`NewsItem.slug`는 이미 준비되어 있다. 현재 카드는 링크가 아니라 정적 카드다.)
- [ ] **5.2 본문을 MDX로** — `content/news/*.mdx`
- [ ] **5.3 KR / EN 다국어** — 헤더의 `KR / EN`은 현재 장식이다. `app/[locale]/` 구조로 전환
- [ ] **5.4 문의 폼** — 정적 export에는 서버가 없으므로 외부 서비스(Formspree 등) 필요.
      **착수 전 사용자 확인 필수** — 제3자 서비스에 데이터를 보내는 결정이다.

---

## 완료 조건 요약

| Phase | 한 줄 판정 |
|---|---|
| 1 | `https://ejlog.github.io/company-intro/` 가 정상 렌더된다 |
| 2 | axe critical/serious 0건 |
| 3 | Lighthouse 4개 항목 95+ |
| 4 | sitemap·robots 생성, 구조화 데이터 인식 |
| 5 | 뉴스 상세가 개별 URL을 가진다 |
