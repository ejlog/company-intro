# doc/

ADDSEN 사이트의 작업 문서. 셋 다 **읽고 끝나는 문서가 아니라 실행하는 문서**다.
각 항목은 그대로 복사해 실행할 수 있는 명령·코드와, 끝났는지 판정할 수 있는 완료 조건을 가진다.

| 문서 | 질문 | 성격 |
|---|---|---|
| [`01-roadmap.md`](./01-roadmap.md) | 무엇을 진행해야 하는가 | 순서가 있는 단계. 위에서부터 |
| [`02-semantics.md`](./02-semantics.md) | 어떻게 시멘틱하게 바꿀 수 있는가 | 요소별 before/after. 독립 실행 가능 |
| [`03-improvements.md`](./03-improvements.md) | 무엇을 보완해야 하는가 | 우선순위 백로그. 골라서 실행 |
| [`04-newsroom.md`](./04-newsroom.md) | 뉴스를 DB로 옮기고 URL 자동 수집·썸네일을 붙이려면 | 설계 문서. **호스팅 갈래 결정 전까지 착수 금지** |

## 사용 규칙

1. 착수 전에 해당 문서의 항목을 읽는다.
2. `superpowers` 스킬로 계획한다(미설치 시 `CLAUDE.md` 1.2절의 대체 절차).
3. UI를 건드리면 `frontend-design` 스킬을 먼저 호출한다.
4. 끝나면 **문서의 체크박스를 갱신하고 같은 커밋에 포함한다.**

## 공통 검증

어느 항목이든 아래를 통과하지 못하면 완료가 아니다.

```bash
npm run typecheck
npm run build
NEXT_PUBLIC_BASE_PATH=/company-intro npm run build   # 배포와 동일 조건
```
