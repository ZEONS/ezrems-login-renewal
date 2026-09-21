# ezREMS 로그인 페이지 사용설명서

업데이트: 2026-09-21

## 개요

`login/index.html`은 GitHub Pages에서 제공되는 로그인 화면입니다. 왼쪽 마케팅 영역과 오른쪽 로그인 폼으로 구성되며 Paperlogy를 기본 글꼴로 사용합니다.

- 운영 주소: `https://zeons.github.io/ezrems-login-renewal/`
- 콘텐츠 출처: `https://ezrems-login-admin.pages.dev`

## 동적 콘텐츠

| 콘텐츠 | API | 실패 시 |
|---|---|---|
| 긴급공지 | `/api/public-content/emergency-notice` | 로컬 공지 폴백 또는 숨김 |
| 마케팅 패널·배경 테마 | `/api/public-content/marketing-slides` | 로컬 슬라이드 폴백 |
| 고객사 데이터 | `/api/public-content/client-references` | 로컬 고객사 폴백 |

## 고객사 공개 페이지

공개 고객사·ERP 사례 페이지는 `customers/index.html`이며 운영 주소는 `https://zeons.github.io/ezrems-login-renewal/customers/`입니다. 로그인 화면의 `전체 성공 사례 보기` 링크도 이 주소로 이동합니다. 화면 주소는 로그인 GitHub Pages를 유지하고, 데이터와 고객사 로고만 Cloudflare의 공개 콘텐츠 API에서 불러옵니다. 관리자 화면 및 관리자 저장 API는 사용하지 않습니다.

요청은 최신 값을 받도록 `cache: no-store`를 사용합니다. 상대 이미지 경로는 Cloudflare 관리자 도메인을 기준으로 절대 URL로 변환됩니다.

## 외부 연동

### 로그인 콘텐츠

`CONTENT_ORIGIN`과 `CONTENT_BASE`가 Cloudflare 공개 API의 기준 주소입니다. 이 값을 변경하면 공지, 슬라이드, 테마, 고객사 로고와 IP 위치 조회에 영향을 줍니다.

### IP 위치정보

`/api/location`에서 접속 IP와 대략적인 위치를 읽습니다. GPS가 아니며 최대 5초 후 중단합니다. 실패해도 로그인은 계속 사용할 수 있고 “확인 불가”로 표시됩니다.

### 로그인 계정

현재 제출 동작은 UI 목업이며 실제 내부 계정 인증은 연결되어 있지 않습니다. `formEl.onsubmit`의 주석 표시 구간을 내부 인증 API 호출로 교체해야 합니다. 비밀번호를 URL, 로그, localStorage에 저장해서는 안 됩니다.

## 주요 화면 기능

- 아이디 또는 이메일, 비밀번호 입력과 필수값 오류
- 서버 인증 실패 메시지를 표시할 고정 영역
- 비밀번호 표시/숨김
- 공통 배경 패널형·카드형 테마
- 슬라이드 자동 재생/일시정지
- 고객사 로고와 성과 툴팁
- 글꼴·화면 테마 선택
- 별도 2차 인증 HTML

## 파일

- `index.html`: 화면, 렌더링, API 연동
- `js/marketing-slides.js`: 마케팅 폴백
- `js/client-references-fallback.js`: 고객사 폴백
- `js/emergency-notice-fallback.js`: 공지 폴백
- `js/layout-settings.js`: 로컬 화면 설정
- `images/`: 정적 로고·이미지

## 실행과 배포

`file://`로도 UI는 열리지만 네트워크 보안 정책 차이를 줄이려면 로컬 HTTP 서버를 사용합니다.

```powershell
cd C:\Works\UIUX\ezrems-login-renewal\login
python -m http.server 8080
```

`login/` 내용을 `https://github.com/ZEONS/ezrems-login-renewal`에 직접 업로드하면 GitHub Pages가 로그인 화면을 배포합니다. 콘텐츠 변경은 Cloudflare KV/R2에서 이루어지므로 로그인 페이지를 다시 배포할 필요가 없습니다.

## 점검

1. 개발자 도구 Network에서 공개 API 3종이 200인지 확인합니다.
2. 관리자에서 값을 바꾼 뒤 로그인 페이지를 강력 새로고침합니다.
3. 이미지 URL이 `https://ezrems-login-admin.pages.dev/api/assets/...` 또는 유효한 정적 경로인지 확인합니다.
4. 실제 서비스 적용 전 내부 인증, 오류 코드, 세션, 2차 인증 전환을 검증합니다.
