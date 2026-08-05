# 04 — 뉴스룸: DB · URL 자동 수집 · 썸네일

요구사항 3가지를 설계로 옮긴 문서. **아직 아무것도 구현되지 않았다.**
호스팅 갈래(§2)를 고르기 전에는 착수하지 않는다 — 고르는 것에 따라 §4 이후가 통째로 달라진다.

## 요구사항

1. 뉴스를 **DB**에서 관리한다.
2. 관리자가 **기사 URL을 붙여넣으면 자동으로 가져온다.** 실패하면 **직접 입력하라고 안내**한다.
3. **썸네일**도 가져온다.

---

## 1. 지금 상태와 무엇이 막히는가

현재 뉴스는 `data/site.ts`의 `newsItems` 배열이다. 6건이 하드코딩되어 있고, 하나 추가하려면 개발자가 TypeScript를 고쳐 푸시해야 한다.

DB를 붙이지 못하는 이유는 "아직 안 붙여서"가 아니라 **붙일 자리가 없어서**다. `output: 'export'` + GitHub Pages는 정적 파일만 서빙한다. 서버가 없다.

| 요구 | 필요한 것 | 지금 없는 이유 |
|---|---|---|
| 뉴스 저장 | DB에 쓰는 서버 코드 | Route Handler를 쓸 수 없다 (`output: 'export'`) |
| URL 스크랩 | 서버 측 fetch | 브라우저에서 타 도메인을 fetch하면 **CORS로 차단**된다. 대리 요청할 서버가 필요 |
| 썸네일 저장 | 파일 스토리지 | `public/`은 빌드 시점에 고정된다. 런타임에 쓸 수 없다 |
| 관리자 로그인 | 세션 검증 | 검증할 주체가 없다 |

> **CORS를 오해하지 말 것.** 관리자 화면이 브라우저에서 `fetch('https://news.example.com/article/1')`을 호출하면 실패한다. 뉴스 사이트가 `Access-Control-Allow-Origin`을 우리에게 열어줄 이유가 없기 때문이다. 이건 우회하는 게 아니라 **서버가 대신 요청**해야 하는 구조적 제약이다.

---

## 2. 갈래 — 먼저 고를 것 ⬜

### A. Vercel 전환 (권장)

Next.js를 원래 쓰임대로 서버 포함 실행한다.

```
app/admin/            관리자 화면 (URL 붙여넣기 → 미리보기 → 저장)
app/api/scrape/       URL 수집 엔드포인트 (서버에서 fetch → CORS 무관)
app/news/[slug]/      뉴스 상세, ISR
lib/db.ts             Neon Postgres (Vercel 통합)
```

- 코드가 한 저장소에서 끝난다. 지금 만들어 둔 App Router 코드가 그대로 쓰인다.
- 뉴스 목록·상세가 서버에서 렌더되므로 **SEO를 지킨다.**
- 이미지: Vercel Blob. `next/image` 최적화도 되살아난다(현재는 `unoptimized`).
- 비용: 이 규모는 Hobby 플랜 무료.
- **대가:** GitHub Pages를 떠난다. 배포 워크플로(`.github/workflows/deploy.yml`)를 걷어낸다.

### B. GitHub Pages 유지 + Supabase

배포처를 그대로 두고 Supabase가 DB·인증·스토리지·스크랩 함수를 담당한다.

- 배포처를 안 바꿔도 된다.
- **대가 1:** 코드가 저장소와 Supabase 두 곳으로 나뉜다. Edge Function은 별도 배포.
- **대가 2:** 공개 뉴스 목록을 브라우저에서 조회하면 **검색엔진이 못 읽는다.** 이걸 지키려면 Supabase 웹훅 → `repository_dispatch` → GitHub Actions 재빌드 배선을 추가해야 한다. 결국 A보다 부품이 많아진다.

### C. 헤드리스 CMS (Sanity 등)

관리 화면을 만들 필요가 없다. 다만 **URL 자동 수집이 기본 기능이 아니라서** 커스텀 입력 플러그인을 따로 짜야 한다. 정작 원하는 기능이 제일 손이 많이 간다.

### 판단

**A를 권한다.** 요구 3가지가 한 곳에서 해결되고, 관리자 화면과 스크랩 API가 같은 타입을 공유한다.
B는 "GitHub Pages를 꼭 유지해야 한다"는 제약이 있을 때만 의미가 있다.

---

## 3. 데이터 모델 (갈래 무관 · 공통)

```sql
create table news (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,      -- URL 경로. 제목에서 생성, 수동 수정 가능
  title        text not null,
  excerpt      text,                      -- 카드에 보이는 2줄 요약
  category     text not null,             -- PRESS | BUSINESS | RESEARCH | COMPANY
  published_at date not null,             -- 기사 발행일 (등록일 아님)

  source_url   text,                      -- 원문 링크. 카드 클릭 시 여기로
  source_name  text,                      -- 언론사명 ("전자신문")

  image_url    text,                      -- 썸네일 (스토리지에 복사한 것)
  image_alt    text,

  status       text not null default 'draft',  -- draft | published
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

create index news_published_idx on news (status, published_at desc);
```

**설계 근거**

- `published_at`이 `created_at`과 별개다. 3개월 전 기사를 오늘 등록해도 목록은 기사 날짜순이어야 한다.
- `status`가 있어야 **자동 수집이 어설프게 된 항목을 비공개로 두고 고칠 수 있다.** 이게 없으면 잘못 긁힌 데이터가 곧바로 라이브에 나간다.
- `source_url`은 nullable. 자체 보도자료는 원문 링크가 없다.
- `image_url`은 **원본 URL이 아니라 우리 스토리지 경로**다. 이유는 §5.

기존 `NewsItem` 타입은 이 스키마에 맞춰 확장한다(`url`, `source`, `image` 추가).

---

## 4. URL 자동 수집 ⬜

### 흐름

```
관리자가 URL 붙여넣기
      ↓
POST /api/scrape { url }        ← 서버에서 실행. CORS 무관
      ↓
 ① fetch + HTML 파싱 → OG 메타
      ↓ 실패
 ② Playwright 렌더 후 재시도     ← JS로 메타를 넣는 사이트 대응
      ↓ 실패
 ③ { ok: false, reason } 반환
      ↓
관리자 화면: 채워진 폼 미리보기 (③이면 빈 폼 + 안내 문구)
      ↓
관리자가 확인·수정 후 저장
```

**핵심: 자동 수집은 폼을 미리 채워주는 것이지, 저장까지 하는 게 아니다.** 사람이 한 번 보고 저장한다. 요구사항 2의 "아니라면 직접 등록해 달라고 표시"가 정확히 이 지점이다.

### 추출 대상

| 필드 | 우선순위 |
|---|---|
| title | `og:title` → `<title>` → `<h1>` |
| excerpt | `og:description` → `<meta name="description">` |
| image | `og:image` → `twitter:image` |
| published_at | `article:published_time` → JSON-LD `datePublished` → 본문 날짜 정규식 |
| source_name | `og:site_name` → 도메인명 |

**본문은 가져오지 않는다.** 기사 전문 복제는 저작권 침해다. 제목·요약·썸네일·발행일까지가 링크 프리뷰의 범위이고, 카드는 원문으로 링크아웃한다. 기업 뉴스룸의 표준 형태다.

### 실패를 전제로 설계할 것

한국 언론사는 상당수가 막혀 있다.

| 상황 | 대응 |
|---|---|
| 네이버 뉴스 등 봇 차단 | 재시도하지 않는다. 즉시 수동 입력으로 넘긴다 |
| JS 렌더 후 메타 삽입 | Playwright 폴백 (②) |
| `robots.txt` 금지 | **수집하지 않는다.** 확인 후 수동 입력 안내 |
| 타임아웃 | 8초 상한. 넘으면 수동 입력 |

> Playwright는 이미 이 환경에 있다(`/opt/pw-browsers/chromium`). `playwright install`을 실행하지 말고 `executablePath`로 가리킨다. 단, **서버리스 환경에서는 Chromium이 안 뜬다** — Vercel이면 `@sparticuz/chromium` 같은 경량 빌드가 필요하고, 콜드스타트가 붙는다. 폴백 ②를 넣을지는 §7에서 실측 후 결정한다.

### 관리자 화면 상태

수집 결과에 따라 화면이 달라져야 한다.

| 상태 | 표시 |
|---|---|
| 수집 성공 | 채워진 폼 + "자동으로 가져왔습니다. 확인 후 저장하세요" |
| 일부만 성공 | 채워진 필드 + 빈 필드 강조 + "썸네일을 가져오지 못했습니다. 직접 올려주세요" |
| 전체 실패 | 빈 폼 + **실패 이유 명시** ("이 언론사는 자동 수집을 차단합니다") |

**실패 이유를 반드시 보여줄 것.** "가져오기 실패"만 뜨면 관리자는 계속 재시도한다.

---

## 5. 썸네일 ⬜

### 원본 URL을 그대로 쓰면 안 되는 이유

`og:image` URL을 `<img src>`에 그대로 넣고 싶어지지만, 세 가지가 깨진다.

1. **핫링크 차단** — 상당수 언론사가 외부 참조를 막는다. 어느 날 갑자기 전부 깨진다.
2. **원본이 사라진다** — 기사가 내려가면 우리 뉴스룸에 빈 칸이 남는다.
3. **크기 통제 불가** — 5MB PNG가 올 수도 있다.

따라서 **수집 시점에 우리 스토리지로 복사**한다.

```
og:image 다운로드
  → 1200px 이하로 리사이즈, WebP 변환 (sharp)
  → 스토리지 업로드 (Vercel Blob / Supabase Storage)
  → image_url 에 우리 경로 저장
```

- 상한: 원본 10MB 초과 시 거부.
- 실패 시: 관리자에게 직접 업로드 요청. 그것도 없으면 현재의 `.ph-lines` 플레이스홀더로 폴백.
- `image_alt`는 자동 생성하지 않는다. **비워두고 관리자가 쓰게 한다** — 자동 생성한 alt는 대체로 쓸모없고, 없느니만 못하다.

### 카드 디자인 변경이 따라온다

현재 `.news-ph`는 높이 170px 줄무늬 플레이스홀더다. 썸네일이 들어가면:

- `.news-ph`에 실제 `<img>` 배치 (`.ph-img` 규칙 재사용 가능)
- 이미지 유/무 두 상태 모두 카드 높이가 같아야 한다
- 언론사명 표시 자리 필요 (`.news-meta`에 추가)
- 홈의 `.news-row`(가로형)도 동일 데이터로 갱신

**UI 작업이므로 `frontend-design` 스킬을 먼저 호출한다.** nocturne 토큰 안에서 처리한다.

---

## 6. 인증 ⬜

관리자 화면은 **인증 없이 배포하면 안 된다.** 누구나 뉴스를 쓸 수 있게 된다.

| 방식 | 평가 |
|---|---|
| GitHub OAuth | 권장. 허용 계정 목록만 통과. 비밀번호를 보관하지 않아도 된다 |
| 이메일 매직링크 | 비개발자에게 익숙. 메일 발송 서비스 연동 필요 |
| 이메일 + 비밀번호 | 재설정·유출 대응까지 직접 책임져야 한다 |

**최소 요건:** `/admin` 전 경로와 모든 쓰기 API가 세션 검증을 통과해야 한다. 화면만 가리고 API가 열려 있으면 가린 의미가 없다.

---

## 7. 착수 전 검증 — 가장 먼저 할 일 ⬜

**실제로 넣을 기사 URL 2~3개로 수집이 되는지 먼저 확인한다.**

매체마다 막힘 정도가 달라서, 되는지 모르고 스크립트부터 짜면 헛일이 될 수 있다.

```bash
# OG 메타가 있는지 확인
curl -sL -A "Mozilla/5.0" "<기사 URL>" | grep -iE 'og:(title|image|description)|article:published_time'
```

- 나오면 → ①만으로 충분. Playwright 폴백 불필요.
- 안 나오면 → Playwright로 렌더 후 재확인.
- 그래도 없으면 → **그 매체는 수동 입력 전용**으로 문서화한다.

---

## 실행 순서

- [ ] **0.** §7 검증 — 실제 기사 URL로 수집 가능 여부 확인 ← **여기부터**
- [ ] **1.** §2 갈래 선택 (사용자 결정)
- [ ] **2.** 호스팅·DB 세팅, 스키마 생성
- [ ] **3.** `NewsItem` 타입 확장, 기존 6건 마이그레이션
- [ ] **4.** `/api/scrape` — OG 파싱 + 실패 응답
- [ ] **5.** 썸네일 파이프라인 (다운로드 → 리사이즈 → 업로드)
- [ ] **6.** 인증
- [ ] **7.** `/admin` 화면 (붙여넣기 → 미리보기 → 저장, 실패 시 수동 입력)
- [ ] **8.** 공개 페이지 갱신 — 카드 썸네일·언론사, 원문 링크 (`frontend-design` 필수)
- [ ] **9.** 뉴스 상세 페이지 `app/news/[slug]/`

## 사용자 결정이 필요한 항목

| # | 항목 | 기본값 제안 |
|---|---|---|
| 1 | 호스팅 갈래 (§2) | **A. Vercel 전환** |
| 2 | 관리자 인증 (§6) | **GitHub OAuth** |
| 3 | 기존 더미 뉴스 6건 | DB로 이관 후 관리자에서 정리 |
| 4 | 실제 기사 URL 샘플 (§7) | — 반드시 필요 |
