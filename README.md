# PolarStar Web

도서 검색 웹앱의 초기 프론트엔드 저장소입니다.

## Stack

- Next.js App Router
- React
- React Query
- TypeScript
- CSS Modules
- Feature-Sliced Design

## Commands

```bash
npm run dev
npm run build
npm run lint
```

## Structure

```text
docs/
src/app/
src/features/
src/entities/
src/widgets/
src/shared/
```

## Workflow

- 기능 단위 브랜치에서 작업합니다.
- 브랜치에서 커밋 후 원격으로 푸시합니다.
- PR은 사용자 기준으로 올리고 병합합니다.

## Local Development

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 을 열면 됩니다.

상세 제품 명세와 작업 이력은 `docs/` 아래 문서를 기준으로 관리합니다.
