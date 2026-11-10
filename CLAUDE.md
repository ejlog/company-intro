# CLAUDE.md

(주)애드센(ADDSEN) 기업 홈페이지. Next.js 16 App Router + TypeScript + Tailwind CSS v4, 정적 export로 GitHub Pages에 배포한다.

@AGENTS.md

## 명령어

```bash
npm run dev        # 개발 서버 (basePath 없음, http://localhost:3000)
npm run build      # 정적 export -> out/
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
npm start          # out/ 을 로컬에서 서빙

# GitHub Pages 와 같은 조건으로 빌드
NEXT_PUBLIC_BASE_PATH=/company-intro npm run build
```

**완료 보고 전 필수:** `npm run typecheck && npm run lint && npm run build` 통과.

## 구조

```
app/                  App Router 페이지와 레이아웃
lib/asset.ts          public/ 경로에 basePath 를 붙이는 헬퍼
public/               정적 파일
.github/workflows/    main 푸시 시 GitHub Pages 배포
```

## 규칙

- **Next 16은 이전 버전과 다르다.** 코드를 쓰기 전에 `node_modules/next/dist/docs/`의 해당 문서를 읽는다.
- **정적 export 제약.** 서버 런타임이 없다. Server Actions, Route Handlers, middleware, ISR, 이미지 최적화는 쓸 수 없다. 폼·검색·CMS가 필요해지면 임의로 정하지 말고 사용자에게 확인한다.
- **이미지 경로는 `asset()`을 거친다.** 평범한 `<img src>`와 CSS `url()`에는 basePath가 자동으로 붙지 않아, 빠뜨리면 배포에서만 깨진다.
- **클라이언트 컴포넌트는 최소한으로.** `'use client'`는 브라우저 API가 필요한 곳에만 붙인다.
- **모션은 `prefers-reduced-motion`을 존중한다.**
- **UI 작업 전에 `frontend-design` 스킬을 호출한다.**

## Git

```bash
git config user.name  "ejlog"
git config user.email "ejlogx@gmail.com"
```

- `main`에서 직접 작업한다.
- 커밋 메시지는 명령형 현재시제. 무엇을 왜 바꿨는지 본문에 남긴다.
- PR은 사용자가 요청했을 때만 만든다.
