# CLAUDE.md

(주)애드센(ADDSEN) 기업 소개 사이트. Next.js App Router + 정적 export.

---

## 1. 필수 스킬 (Mandatory skills)

이 저장소에서 작업할 때 아래 두 스킬은 **선택이 아니라 전제 조건**이다.

### 1.1 `frontend-design` — UI를 만들거나 고칠 때 항상

**언제:** `app/`, `components/`, `styles/` 아래 파일을 새로 만들거나 시각적으로 바꾸는 모든 작업.
새 페이지·새 섹션·새 컴포넌트, 레이아웃 변경, 색·타이포·모션·간격 조정이 모두 해당한다.

**어떻게:** 첫 줄을 쓰기 **전에** 호출한다.

```
Skill(skill="frontend-design", args="<무엇을 만드는지 + 유지해야 할 제약>")
```

**이 저장소에서의 해석 — 중요:**
`styles/nocturne.css`는 이미 완성된 디자인 시스템이다(OKLCH 기반 토큰 램프, 주석에 의사결정 근거까지 기록되어 있음).
따라서 여기서 `frontend-design`은 **새 미학을 발명하라는 뜻이 아니라, nocturne 안에서 완성도를 끌어올리라는 뜻**이다.

- 토큰을 쓴다. `#9184d9`를 직접 쓰지 말고 `var(--color-accent)`를 쓴다.
- 새 색·새 간격 값을 즉흥적으로 만들지 않는다. 필요하면 `nocturne.css`의 램프에서 고른다.
- 램프 자체를 바꿔야 한다면 `nocturne.css`에서 바꾸고, **왜 바꿨는지 주석으로 남긴다** (기존 주석이 그 형식이다).
- 폰트를 갈아끼우거나 라이트 테마를 도입하는 등 시스템 차원의 변경은 사용자 확인 없이 하지 않는다.

**금지:** 스킬을 건너뛰고 "간단하니까" 바로 CSS를 만지는 것. 한 줄짜리 색 변경도 토큰 규칙을 어길 수 있다.

### 1.2 `superpowers` — 다단계 작업의 계획·검증에 항상

**언제:** 3단계 이상이거나, 여러 파일을 건드리거나, 되돌리기 어려운 모든 작업.
마이그레이션, 리팩터링, 의존성 교체, 배포 파이프라인 변경, `doc/` 계획 실행이 모두 해당한다.

**어떻게:**

```
Skill(skill="superpowers", args="<작업>")
```

**설치 상태 — 반드시 먼저 확인할 것:**
`superpowers`는 **현재 이 환경에 설치되어 있지 않다.** 사용자 플러그인 카탈로그에도 없다.
따라서 순서는 이렇다.

1. 스킬 목록에 `superpowers`가 있는지 확인한다.
2. **있으면 위 규칙대로 반드시 호출한다.**
3. **없으면** 사용자에게 설치를 안내한다:
   ```
   /plugin marketplace add obra/superpowers
   /plugin install superpowers@superpowers
   ```
   그리고 설치 전까지는 아래 **대체 절차**를 따른다 — 계획 단계를 생략하지 않는다.

**대체 절차 (superpowers 미설치 시):**
- 착수 전 `TaskCreate`로 작업을 쪼개고, 진행 중 `TaskUpdate`로 상태를 갱신한다.
- 설계 판단이 갈리는 지점에서는 `AskUserQuestion`으로 확인한다.
- 변경 후 반드시 `npm run typecheck && npm run build`로 검증한다. 빌드 없이 완료 보고하지 않는다.

### 1.3 두 스킬의 관계

| 작업 | superpowers | frontend-design |
|---|---|---|
| 새 페이지 추가 | ✅ 계획 | ✅ 구현 |
| 카피 문구 수정 (`data/site.ts`) | — | — |
| 색·간격·모션 조정 | — | ✅ |
| 의존성 업그레이드 / 배포 변경 | ✅ | — |
| `doc/` 문서의 계획 실행 | ✅ | 해당 시 ✅ |

---

## 2. 명령어

```bash
npm run dev        # 개발 서버 (basePath 없음, http://localhost:3000)
npm run build      # 정적 export -> out/
npm run typecheck  # tsc --noEmit
npm start          # out/ 을 로컬에서 서빙 (빌드 결과 확인용)

# GitHub Pages 와 동일한 조건으로 빌드
NEXT_PUBLIC_BASE_PATH=/company-intro npm run build
```

**완료 보고 전 필수:** `npm run typecheck && npm run build` 통과.

---

## 3. 구조

```
app/                  App Router. layout.tsx 가 Nav/Footer/ScrollReveal 을 감싼다
  page.tsx            홈 (hero, stats, about, business, history, news, contact)
  about|business|history|news/page.tsx
components/           Nav, Footer 는 공용. 나머지는 'use client' 인터랙션
data/site.ts          모든 카피와 목록 데이터의 단일 출처
lib/asset.ts          public/ 경로에 basePath 를 붙이는 헬퍼
styles/nocturne.css   디자인 시스템 토큰 — 룩의 source of truth
styles/site.css       사이트 레이어. 토큰을 소비만 한다
public/img/           이미지
doc/                  실행 가능한 작업 문서 (아래 5절)
```

### 지켜야 할 규칙

**카피는 `data/site.ts`에만 있다.**
원본 HTML 5장은 nav·footer·사업 소개를 그대로 복붙해 두고 있었다. 이제는 한 곳만 고친다.
JSX에 한국어 문자열을 새로 하드코딩하지 않는다 — 페이지 고유의 헤딩과 리드 문단은 예외.

**이미지 경로는 반드시 `asset()`을 거친다.**

```tsx
import { asset } from '@/lib/asset';
<img src={asset('/img/foo.jpg')} alt="..." />
```

Next는 `next/link`와 `next/image`에만 basePath를 자동으로 붙인다. 평범한 `<img src>`와 CSS `url()`에는 붙이지 않는다.
이 사이트는 `.ph-img` 규칙을 그대로 쓰려고 평범한 `<img>`를 유지하므로, 이 헬퍼를 빠뜨리면 **로컬에서는 멀쩡하고 배포에서만 깨진다.**

**정적 export 제약.**
`output: 'export'`이므로 서버 런타임이 없다. 다음은 쓸 수 없다:
Server Actions, Route Handlers, middleware, ISR, `next/image` 최적화(`unoptimized: true`), 동적 `rewrites`.
폼·검색·CMS가 필요해지면 외부 서비스를 붙이거나 호스팅을 바꿔야 한다 — 임의로 결정하지 말고 사용자에게 확인한다.

**클라이언트 컴포넌트는 최소한으로.**
`'use client'`는 실제로 브라우저 API가 필요한 곳에만 붙인다.
현재: `Nav`(드로어 상태·활성 링크), `ScrollReveal`, `HeroVisual`, `BusinessShowcase`.

**모션은 `prefers-reduced-motion`을 존중한다.**
스크롤 기반 효과는 모두 감소 모션에서 빠져나가야 한다. 기존 컴포넌트가 그 패턴을 보여준다.

---

## 4. Git

**커밋 계정은 고정이다:**

```bash
git config user.name  "ejlog"
git config user.email "ejlogx@gmail.com"
```

- 기본 브랜치는 `main`이고, 사용자가 명시적으로 지시한 경우 `main`에서 직접 작업한다.
- 커밋 메시지는 명령형 현재시제. 무엇을 왜 바꿨는지 본문에 남긴다.
- PR은 사용자가 요청했을 때만 만든다.

---

## 5. `doc/` — 실행 가능한 작업 문서

| 문서 | 내용 |
|---|---|
| `doc/01-roadmap.md` | 무엇을 해야 하는가. 단계별 실행 순서와 완료 조건 |
| `doc/02-semantics.md` | 어떻게 시멘틱하게 바꿀 것인가. 요소별 before/after |
| `doc/03-improvements.md` | 무엇을 보완할 것인가. 우선순위별 백로그 |
| `doc/04-newsroom.md` | 뉴스 DB·URL 자동 수집·썸네일 설계. 호스팅 갈래 결정 전까지 착수 금지 |

작업을 시작하기 전에 해당 문서를 읽는다. 문서의 항목을 끝내면 **문서의 체크박스를 같이 갱신한다** — 문서가 낡으면 없느니만 못하다.

---

## 6. 알려진 상태

- `npm audit`에 high 3건(`sharp`, `postcss`)이 남아 있다. 둘 다 Next의 전이 의존성이고, `sharp`는 이미지 최적화기 전용이라 정적 export에서는 실행되지 않는다. 해소하려면 Next 16(breaking)이 필요하다. 상세는 `doc/03-improvements.md`.
- `public/img/`의 JPG 4장이 합계 약 7MB다. 최적화 계획은 `doc/03-improvements.md`.
- 폰트는 Google Fonts CDN에서 링크로 불러온다. 자체 호스팅(`next/font`) 전환은 `doc/03-improvements.md`.
