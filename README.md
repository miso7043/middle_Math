# 중학교 수학 · 정의와 정리

중학교 1~3학년의 정의 35개와 정리 49개를 탐색하고 도형을 직접 조작하는 React 학습 사이트다.

## 로컬 실행

Node.js 22와 npm을 사용한다.

```bash
npm ci
npm run dev
```

Vite가 표시하는 주소의 `/math/`에서 앱을 연다. 링크에 `#T30`처럼 ID를 추가하면 해당 항목을 바로 열 수 있다.

```bash
npm run build
npm run preview
```

## 파일 구조

| 경로 | 역할 |
| --- | --- |
| `src/content/` | 학년별 항목, 검색, 수식과 표 |
| `src/components/` | 항목 탐색, 상세 화면, 공통 수식 렌더러 |
| `src/geometry/` | 공통 캔버스, 좌표 도구, 재생 상태와 조작 화면 |
| `src/geometry/scenes/` | 장면별 입력값, 계산, 도형과 수식 라벨 |
| `deploy/` | Pi의 컨테이너 및 기존 HTTPS 프록시 구성 |

- [구현 계획과 작업 지침](doc/implementation-plan.md)
- [Raspberry Pi 배포](doc/raspberry-pi-deployment.md)
