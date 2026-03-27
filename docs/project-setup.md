# Project Setup

## 기술 스택
- Framework: Next.js
- Language: TypeScript
- UI: React
- Server State: React Query
- Styling: CSS Modules
- Architecture: Feature-Sliced Design

## 기본 구조 원칙
- 초기 셋업은 Next.js App Router 기준으로 시작한다.
- 전역 스타일은 최소화하고, 화면과 컴포넌트 스타일은 CSS Modules로 관리한다.
- 기능별 코드는 FSD 기준으로 나눈다.
- 공통 요소는 필요가 생길 때만 shared 계층으로 승격한다.

## 권장 디렉터리 초안
```text
src/
  app/
  widgets/
  features/
  entities/
  shared/
```

## 브랜치 및 협업 방식
- 기본 원격 저장소: `https://github.com/yeon-zip/web.git`
- 기본 흐름:
  1. `main`에는 병합된 작업만 둔다.
  2. 기능 단위로 브랜치를 분리한다.
  3. 각 브랜치에서 커밋 후 원격에 푸시한다.
  4. 사용자가 PR을 올리고 병합한다.
- 브랜치 이름은 작업 내용을 드러내도록 짓는다.
- 기본 브랜치 네이밍은 `codex/<작업명>` 형식을 사용한다.
- 첫 셋업은 프로젝트 초기화 브랜치 또는 현재 작업 브랜치에서 올린다.

## 문서 운영 원칙
- 제품 요구사항은 `docs/library-app-master.md`에 유지한다.
- 기술/프로젝트 운영 기준은 이 문서에 유지한다.
- 작업 이력과 후속 작업은 `docs/task-log.md`에 누적한다.
- AI 전용 운영 문서나 개인 메모 파일은 저장소에 두지 않는다.
- 실제 원격 브랜치 푸시 이력도 작업 로그에 함께 남긴다.

## 초기 셋업 범위
- 이번 단계에서는 Next.js 기본 셋업만 수행한다.
- 포함 범위:
  - Next.js + TypeScript 설치
  - React Query 설치 및 루트 Provider 연결
  - 기본 실행 스크립트 구성
  - CSS Modules 기반 기본 화면
  - FSD에 맞춘 초기 폴더 생성
- 제외 범위:
  - 실제 도메인 기능 구현
  - API 연동
  - 인증
  - 상태관리 라이브러리 추가
