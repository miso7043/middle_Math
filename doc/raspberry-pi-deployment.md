# Raspberry Pi Podman 배포 계획

작성일 2026-11-24 (Asia/Seoul). 구현 전 배포 초안이다. 실제 Pi 변경은 배포 요청 후 진행한다.

## 하모니카와 공유할 운영 구조

형제 프로젝트의 `deploy/RASPBERRY_PI.md`와 `hamonica-player-user.service`를 확인했다. 하모니카는 사용자 systemd 서비스의 Gunicorn으로 실행되고, Pi의 Nginx가 기존 HTTPS에서 `/hamonica/`를 프록시한다. 영어 학습 서비스는 HTTPS 루트 경로를 사용한다. 수학 앱은 같은 HTTPS 진입점을 이용하고 별도 Podman 컨테이너로 실행한다.

| 구성 | 계획 |
| --- | --- |
| 접속 경로 | 기존 HTTPS 호스트의 `/math/` |
| 호스트 프록시 | 기존 Nginx에 `/math/`를 전용 루프백 포트로 연결. `/math`는 `/math/`로 리디렉션 |
| 컨테이너 | React 빌드를 제공하는 정적 웹 서버. 컨테이너 8080을 호스트 `127.0.0.1:8040`에 연결하는 안이며 포트 확인 후 확정 |
| 자동 시작 | rootless Podman + systemd 사용자 Quadlet. Quadlet을 지원하지 않는 환경은 사용자 systemd 서비스에서 Podman을 실행 |
| 데이터 | 첫 버전은 정적 파일과 이미지 태그로 배포. DB 볼륨은 서버 기능 추가 시 도입 |

## 배포 준비 완료 기준

1. Pi에서 `uname -m`, `podman version`, 서비스 계정과 사용자 systemd 환경, cgroup 및 Quadlet 지원을 확인한다. 기존 Nginx 경로, 인증서, 리스닝 포트를 조사한다.
2. 다단계 Containerfile에서 잠금 파일로 의존성을 설치하고 정적 빌드를 생성한다. 대상 Pi 아키텍처용 이미지로 빌드하고 검증한 Git 커밋으로 태그한다.
3. Vite의 `base`와 프론트 라우터 기준 경로를 `/math/`로 맞춘다. 호스트 Nginx에서 `/math/` 접두사를 제거해 컨테이너 루트로 전달하는 안을 사용한다. 컨테이너는 상세 URL의 새로고침을 위한 SPA 폴백을 제공하고, 존재하지 않는 정적 자산은 404를 반환하게 한다.
4. 정적 서버에는 비밀값을 넣지 않는다. 이미지, 업데이트할 프록시 파일, 서비스 파일, 상태·로그·롤백 명령을 배포 전에 저장소에 준비한다.

## 승인된 배포 실행 순서

1. 기존 Nginx 설정과 직전 서비스 정의를 백업한다. 기존 HTTPS 루트와 `/hamonica/`의 응답을 기록한다.
2. 새 이미지를 준비하고 서비스 계정의 Quadlet 위치에 설정을 설치한다. `systemctl --user daemon-reload` 후 생성된 서비스를 시작한다. 부팅 시 시작하도록 Quadlet의 설치 대상을 설정하고 계정의 lingering을 확인한다.
3. 루프백 주소에서 시작 화면, JS/CSS, 수식 폰트 및 대표 상세 URL을 검증한다. 사용자 서비스 상태와 로그를 확인한다.
4. Nginx에 수학 전용 경로를 추가한다. `sudo nginx -t` 통과 후 설정을 다시 로드한다.
5. HTTPS에서 `/math/`, 상세 페이지 직접 접속과 새로고침, 모바일 도형 조작을 확인한다. 루트와 `/hamonica/`도 재검증한다. 배포 이미지 태그·시각·검증 결과를 당일 기록에 남긴다.

## 복구

프록시 반영 직후 문제가 생기면 수학 앱에 추가한 설정만 이전 상태로 돌리고 Nginx 설정 검사를 거쳐 다시 로드한다. 앱 업데이트에 문제가 생기면 사용자 서비스 설정을 직전 검증 이미지로 되돌리고 서비스를 재시작한다. 초기 배포라면 수학 경로를 제거하고 수학 서비스만 중지한다. 복구 후 기존 경로와 수학 경로의 기대 응답을 각각 확인한다.

[Podman Quadlet 공식 문서](https://docs.podman.io/en/stable/markdown/podman-systemd.unit.5.html)

## 구축 명령과 설정 파일

아래 명령은 배포 요청을 받은 뒤, Pi의 서비스 계정에서 실행한다. 소스를 Pi에 복사하고 프로젝트 루트에서 빌드한다. `RELEASE_ID`에는 검증한 Git 커밋 해시를 넣는다.

```bash
RELEASE_ID=$(git rev-parse --short HEAD)
podman build -t "localhost/math-web:$RELEASE_ID" -f Containerfile .
podman tag "localhost/math-web:$RELEASE_ID" localhost/math-web:release
install -Dm644 deploy/math-web.container ~/.config/containers/systemd/math-web.container
systemctl --user daemon-reload
systemctl --user restart math-web.service
systemctl --user status math-web.service
curl --fail http://127.0.0.1:8040/healthz
```

Quadlet을 지원하지 않는 경우 `deploy/math-web.service`를 `~/.config/systemd/user/math-web.service`에 설치하고, `systemctl --user daemon-reload` 후 `systemctl --user enable --now math-web.service`를 실행한다. 두 방식을 동시에 설치하면 이름과 포트가 충돌한다. 로그인 없이 자동 시작하려면 계정의 linger 상태를 확인하고, 필요한 경우 Pi 관리자 권한으로 `loginctl enable-linger <서비스계정>`을 실행한다.

`deploy/nginx-host.conf`를 기존 HTTPS 서버 블록에 포함한다. 설정 검사 및 리로드 후 HTTPS의 `/math/`, `/math/#T30`, 정적 자산과 하모니카·영어학습 경로를 확인한다. 런타임 로그는 `journalctl --user -u math-web.service`에서 확인한다. 업데이트는 이전 릴리스 태그를 기록한 뒤 같은 절차를 반복한다. 롤백 시 `localhost/math-web:release`를 직전 릴리스 이미지에 다시 지정하고 서비스를 재시작한다.
