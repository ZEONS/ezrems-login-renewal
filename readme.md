# ezREMS 로그인 페이지

`login` 폴더는 ezREMS 로그인 페이지 개편안의 독립 실행형 프런트엔드입니다. 별도 프레임워크나 빌드 과정 없이 `index.html`을 배포하며, 로그인 화면에 표시할 긴급공지·마케팅 슬라이드·고객사 데이터를 Cloudflare 콘텐츠 관리자에서 JSON으로 불러옵니다.

## 주요 기능

- 화면 폭에 자동 대응하는 반응형 로그인 화면
- 왼쪽 마케팅 슬라이드 자동 재생, 이전·다음, 일시정지
- Cloudflare JSON 기반 긴급공지 표시
- 고객사 로고 무한 흐름과 고객사 성과 툴팁
- 고객사 통계/보고서 페이지 연결
- 아이디·비밀번호 필수 입력 확인과 비밀번호 표시 전환
- 도입 상담 안내 모달
- 리빙 커넥트, 앱 스토어, SNS 외부 링크
- Pretendard, Noto Sans KR 등 화면 글꼴 선택 및 브라우저 저장
- 원격 JSON 장애 시 로컬 JavaScript fallback 데이터 사용

> 현재 로그인과 상담 기능은 UI 목업입니다. 실제 인증 API 호출이나 개인정보 전송은 구현되어 있지 않습니다.

## 폴더 구조

```text
login/
├─ index.html                              # 화면, 스타일, JSON 로딩 및 UI 동작
├─ readme.md
├─ readme.html
├─ js/
│  ├─ marketing-slides.js                  # 마케팅 슬라이드 fallback
│  ├─ client-references-fallback.js        # 고객사 데이터 fallback
│  └─ emergency-notice-fallback.js         # 긴급공지 fallback
└─ images/
   ├─ ezrems_bi.png                        # 화면 BI
   ├─ ezrems_bi_blue.png
   ├─ icons/
   │  ├─ trusted-leaders.svg
   │  └─ living-connect-app.svg
   ├─ erp/
   │  ├─ sap_erp.png
   │  └─ douzone_erp.png
   └─ logos/                               # 고객사 로고 로컬 사본
```

`images/logos`에는 고객사 로고 사본이 있지만 현재 로그인 화면의 고객사 로고는 Cloudflare 콘텐츠 주소에서 불러옵니다. BI와 화면 아이콘은 `login/images`의 로컬 파일을 사용합니다.

## 콘텐츠 연동

콘텐츠 기준 주소:

```text
https://ezrems-login-content-admin.pages.dev/content
```

| 콘텐츠 | 요청 주소 |
|---|---|
| 긴급공지 | `/content/emergency-notice.json` |
| 마케팅 슬라이드 | `/content/marketing-slides.json` |
| 고객사 데이터 | `/content/client-references.json` |
| 고객사 로고 | `/content/images/logos/<파일명>` |

전체 URL 예시:

```text
https://ezrems-login-content-admin.pages.dev/content/client-references.json
https://ezrems-login-content-admin.pages.dev/content/images/logos/ktestate.png
```

모든 JSON 요청은 `cache: no-store`로 실행해 최신 데이터를 요청합니다. 로그인 페이지와 콘텐츠 도메인이 다를 수 있으므로 Cloudflare 정적 파일 응답에 CORS 허용 헤더가 필요합니다.

## 데이터 로딩 순서

```text
로그인 페이지 시작
  ├─ marketing-slides.json 요청
  ├─ client-references.json 요청
  └─ emergency-notice.json 요청
        ↓
     정상 응답 → 원격 JSON 렌더링
     요청/형식 오류 → login/js의 fallback 데이터 렌더링
```

JSON 데이터는 서로 독립적으로 로드합니다. 한 파일이 실패하더라도 나머지 콘텐츠는 계속 표시됩니다.

### 마케팅 슬라이드

- `enabled: false` 항목은 제외합니다.
- `visual.type`에 따라 지표 차트 또는 칩 목록을 렌더링합니다.
- 여러 슬라이드는 6초 간격으로 자동 재생됩니다.
- 사용자 환경이 `prefers-reduced-motion: reduce`이면 자동 재생을 시작하지 않습니다.

### 고객사 데이터와 로고

- `enabled: false` 고객사는 제외합니다.
- JSON의 `logoUrl`이 상대 경로이면 Cloudflare 콘텐츠 도메인의 절대 주소로 변환합니다.
- 예: `./content/images/logos/ktestate.png` → `https://ezrems-login-content-admin.pages.dev/content/images/logos/ktestate.png`
- 로고 로딩 실패 시 이미지 대신 고객사명을 표시합니다.
- 마우스 또는 키보드 포커스 시 `achievement`를 툴팁으로 표시합니다.

### 긴급공지

- `enabled: true`이면 공지 영역을 표시합니다.
- `label`, `title`, `message`를 화면에 출력합니다.
- 현재 로그인 소스는 `startsAt`, `endsAt`의 시간 범위를 직접 판정하지 않고 `enabled` 값을 기준으로 표시합니다.

## 주요 로컬 경로

```html
./images/ezrems_bi.png
./images/icons/trusted-leaders.svg
./images/icons/living-connect-app.svg
./js/marketing-slides.js
./js/client-references-fallback.js
./js/emergency-notice-fallback.js
```

파일명과 폴더명의 대소문자를 정확히 맞춰야 Linux 기반 배포 환경에서 정상적으로 표시됩니다.

## 외부 연결

- 고객사 통계/보고서: `https://ezrems-login-content-admin.pages.dev/client_report.html`
- 리빙 커넥트: `https://app.ezrems.com`
- Google Play 및 Apple App Store
- YouTube, Instagram, EasySafe

외부 새 창 링크에는 `rel="noopener noreferrer"`가 적용되어 있습니다.

## 로컬 실행

`file://`로 직접 열어도 fallback 스크립트는 읽을 수 있지만, 브라우저 정책과 원격 요청 환경을 정확하게 확인하려면 로컬 웹 서버로 실행하는 것이 좋습니다.

```powershell
cd login
python -m http.server 8080
```

브라우저에서 다음 주소를 엽니다.

```text
http://localhost:8080/
```

## Cloudflare Pages 배포

로그인 페이지를 별도 Cloudflare Pages 프로젝트로 배포할 경우 권장 설정은 다음과 같습니다.

| 설정 | 값 |
|---|---|
| Framework preset | None |
| Build command | 비워 둠 |
| Build output directory | `login` |
| Root directory | 저장소 구조에 따라 비워 두거나 프로젝트 루트 지정 |

배포 결과에 다음 파일과 폴더가 모두 포함되어야 합니다.

```text
index.html
js/
images/
```

JSON은 콘텐츠 관리자 Pages 프로젝트에서 읽기 때문에 로그인 프로젝트에는 JSON 파일이 없어도 됩니다.

## 배포 후 점검

1. ezREMS BI와 리빙 커넥트 아이콘이 표시되는지 확인합니다.
2. 마케팅 슬라이드가 표시되고 6초마다 전환되는지 확인합니다.
3. 고객사 로고가 Cloudflare 콘텐츠 주소에서 표시되는지 확인합니다.
4. 고객사 로고에 마우스를 올려 성과 툴팁을 확인합니다.
5. 긴급공지가 관리자 JSON 설정과 동일하게 표시되는지 확인합니다.
6. 데스크톱·모바일 화면 폭에서 반응형 레이아웃을 확인합니다.
7. 고객사 통계/보고서 링크와 외부 서비스 링크를 확인합니다.
8. 개발자 도구의 Console과 Network에서 404, CORS, JSON 오류가 없는지 확인합니다.

## 오류 해결

| 증상 | 확인 사항 |
|---|---|
| 고객사 로고가 안 보임 | JSON `logoUrl`, Cloudflare의 `/content/images/logos/` 파일, 파일명 대소문자 확인 |
| 고객사명만 표시됨 | 해당 로고 요청이 실패해 fallback 텍스트가 표시된 상태 |
| 마케팅 슬라이드가 예전 내용임 | 원격 JSON 요청 실패 여부와 로컬 `js/marketing-slides.js` fallback 확인 |
| 긴급공지가 안 보임 | JSON의 `enabled`, `message`, 네트워크 응답 확인 |
| JSON 요청 CORS 오류 | 콘텐츠 Pages 응답의 `Access-Control-Allow-Origin` 헤더 확인 |
| BI 또는 아이콘이 안 보임 | `login/images`가 배포됐는지와 상대 경로 확인 |
| JS 404 오류 | `login/js`가 배포 결과에 포함됐는지 확인 |
| 고객사 보고서가 안 열림 | 콘텐츠 관리자 Pages의 `client_report.html` 배포 여부 확인 |
| 글꼴 선택이 유지되지 않음 | 브라우저의 localStorage 차단 여부 확인 |

## 유지보수 원칙

1. 운영 콘텐츠는 관리자 페이지에서 JSON으로 관리합니다.
2. `login/js` 파일은 원격 장애 시 사용할 fallback이므로 JSON 변경 후 함께 갱신하는 것이 안전합니다.
3. 고객사 로고는 콘텐츠 관리자 프로젝트의 `content/images/logos`에 배포합니다.
4. 로그인 화면 전용 BI·아이콘은 `login/images`에서 관리합니다.
5. 실제 서비스 연결 시 목업 로그인 타이머를 인증 API 호출로 교체하고 개인정보 처리·보안 요구사항을 적용합니다.

---

문서 기준일: 2026-08-14  
분석 대상: `login/index.html`, `login/js/*`, `login/images/*`


## 마케팅 패널 배경 이미지

`marketing-slides.json`은 공통 `background` 객체와 `slides` 배열로 구성됩니다. 공통 배경 객체는 다음 필드를 지원합니다.

- `image`: `./content/images/backgrounds/...` 형식의 상대 경로
- `position`: `center`, `top`, `bottom`, `left`, `right`
- `overlay`: 텍스트 가독성을 위한 어두운 오버레이 농도(권장 0.30~0.72)
- `alt`: 배경 이미지 설명

`background.image`가 없거나 빈 값이면 기존 파란색 그라데이션 배경이 자동으로 사용됩니다. 이미지는 콘텐츠 관리자 Cloudflare 주소를 기준으로 불러옵니다.

### 배경 테마 라이브러리

공통 배경 설정에서 여러 테마를 등록해 재사용할 수 있습니다. `새 테마`로 편집을 초기화하고, 이름·이미지·위치·오버레이·설명을 입력한 뒤 `테마 저장`을 누르면 현재 적용 테마로 지정됩니다. 저장된 테마 선택 시 즉시 공통 배경 미리보기에 적용되며 `삭제`로 제거할 수 있습니다.

`marketing-slides.json`에는 `themes` 배열과 현재 테마를 가리키는 `activeThemeId`가 저장됩니다. 기존 배열 형식과 단일 `background` 형식도 계속 불러올 수 있습니다.
### 카드형 배경 테마

테마의 `표시 방식`에서 다음 중 하나를 선택할 수 있습니다.

- `패널 전체형`: 왼쪽 마케팅 패널 전체에 배경 이미지를 표시합니다.
- `카드형`: 패널의 기본 배경은 유지하고 슬라이드 문구 영역을 감싸는 카드 안에 배경 이미지를 표시합니다.

JSON 테마의 `mode` 값은 `panel` 또는 `card`입니다. 기존 테마에 `mode`가 없으면 `panel`로 처리됩니다.
### 로그인 화면에서 배경 테마 선택

로그인 화면의 팔레트 버튼을 열면 `화면 구성` 아래에서 관리자가 등록한 `배경 이미지 테마`를 선택할 수 있습니다. 목록에는 패널형과 카드형이 구분되어 표시되며, 선택값은 브라우저 `localStorage`에 저장됩니다. `관리자 기본 테마`를 선택하면 개인 선택을 지우고 관리자가 지정한 활성 테마로 복원합니다.