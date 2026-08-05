# company-intro

(주)애드센(ADDSEN) 기업 소개 사이트. Next.js App Router 정적 export.

## 시작하기

```bash
npm install
npm run dev        # http://localhost:3000
```

## 명령어

| 명령 | 설명 |
|---|---|
| `npm run dev` | 개발 서버 |
| `npm run build` | 정적 export → `out/` |
| `npm run typecheck` | `tsc --noEmit` |
| `npm start` | 빌드 결과를 로컬에서 서빙 |

GitHub Pages와 동일한 조건으로 빌드하려면:

```bash
NEXT_PUBLIC_BASE_PATH=/company-intro npm run build
```

## 구조

```
app/         App Router 라우트 (홈, 회사소개, 사업영역, 연혁, 뉴스룸)
components/  Nav · Footer · 스크롤 인터랙션
data/        모든 카피와 목록 데이터
styles/      nocturne.css(디자인 토큰) + site.css(레이아웃)
public/img/  이미지
doc/         작업 문서 — 로드맵 · 시멘틱 가이드 · 개선 백로그
```

## 배포

`main`에 푸시하면 `.github/workflows/deploy.yml`이 빌드 후 GitHub Pages에 배포한다.

**최초 1회 설정:** 저장소 `Settings → Pages → Source`를 **GitHub Actions**로 지정해야 한다.
자세한 내용은 [`doc/01-roadmap.md`](./doc/01-roadmap.md) Phase 1.

## 문서

- [`CLAUDE.md`](./CLAUDE.md) — 개발 규칙, 필수 스킬
- [`doc/01-roadmap.md`](./doc/01-roadmap.md) — 무엇을 진행할 것인가
- [`doc/02-semantics.md`](./doc/02-semantics.md) — 어떻게 시멘틱하게 바꿀 것인가
- [`doc/03-improvements.md`](./doc/03-improvements.md) — 무엇을 보완할 것인가
