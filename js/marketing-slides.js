/**
 * ezREMS 로그인 V2 — 좌측 마케팅 슬라이드 콘텐츠
 *
 * 관리 방법
 * 1. 아래 배열에서 category, eyebrow, title, description을 수정합니다.
 * 2. visual.type은 "chips", "metric", "security" 중 하나를 사용합니다.
 * 3. 슬라이드 순서는 배열 순서와 같습니다. 항목을 복사하면 슬라이드가 추가됩니다.
 * 4. title 안의 \n은 화면에서 줄바꿈으로 표시됩니다.
 *
 * 주의: 자산 수, 세대 수, 고객사, 인증 관련 문구는 공개 전에 근거와 사용 허가를 확인하세요.
 */
window.EZREMS_MARKETING_SLIDES = [
  {
    id: "efficiency",
    category: "EFFICIENCY",
    eyebrow: "업무 자동화",
    title: "엑셀은 밤새 일하지만,\n이지램스는 당신을\n퇴근시킵니다.",
    description: "반복적인 입금 대조 업무에서 벗어나세요. 청구서 발송부터 자동 수납 매칭까지, 하나의 흐름으로 완벽하게 제어합니다.",
    visual: {
      type: "chips",
      items: ["청구 자동화", "입금 자동 매칭", "실시간 리포트"]
    }
  },
  {
    id: "operation-core",
    category: "PARADIGM",
    eyebrow: "자산운영의 패러다임",
    title: "수익형 부동산\n이제는 소유가 아닌\n운영이 핵심입니다.",
    description: "건물 생애주기비용(LCC)의 83.2%는 지어진 후의 '운영과 유지관리'에서 발생합니다. 단순 보존을 넘어 자산 가치를 극대화하는 전략적 운영을 시작하세요.",
    visual: {
      type: "operation",
      items: ["✓ LCC(생애주기비용) 83.2% 관리", "✓ 자산 가치 상승(Value-up)", "✓ AM·PM·FM 통합 프로세스"]
    }
  },
  {
    id: "roi",
    category: "ROI & VALUE-UP",
    eyebrow: "수익 확보",
    title: "연체료, 눈치 보며\n포기하셨나요?\n시스템은 미안해하지 않습니다.",
    description: "가상계좌와 알림톡 자동 청구로 미수 리스크를 낮추고 자산 수익 관리를 더욱 정교하게 만듭니다.",
    visual: {
      type: "metric",
      value: "98.2%",
      label: "수납 현황 예시",
      bars: [26, 35, 43, 50, 60]
    }
  },
  {
    id: "social-proof",
    category: "SOCIAL PROOF",
    eyebrow: "시장 신뢰",
    title: "전국 180여 개 자산,\n4만 8천 세대의 선택",
    description: "대한민국 대표 프롭테크 기업과 자산관리 전문가들이 이미 이지램스로 자산을 운영하고 있습니다.",
    visual: {
      type: "chips",
      items: ["KT estate", "SHINSEGAE PROPERTY", "MANGROVE"]
    }
  },
  {
    id: "security",
    category: "SECURITY",
    eyebrow: "검증된 보안",
    title: "업계 최초\nKISA CSAP SaaS\n표준등급 획득!",
    description: "검증된 클라우드 보안 체계로 금융·공공 수준의 안전한 자산관리 환경을 제공합니다.",
    visual: {
      type: "security",
      items: ["✓ CSAP SaaS 표준등급", "암호화 통신", "권한 관리"]
    }
  },
  {
    id: "open-api-expansion",
    category: "CONNECTIVITY",
    eyebrow: "오픈 API & 확장성",
    title: "독자적인 브랜드 앱 개발도\n오픈 API 하나로\n비즈니스 한계를 허뭅니다.",
    description: "이지램스의 강력한 공간·계약·수납 데이터를 오픈 API로 즉시 연동하세요. MGRV(맹그로브)처럼 실시간 공실 연동부터 가구 구독, 핀테크 금융 결제까지 원하는 서비스를 자유롭게 결합하여 비즈니스 영역을 무한히 확장할 수 있습니다.",
    visual: {
      type: "api",
      items: ["✓ 실시간 임대 데이터 API 동기화", "✓ 금융·핀테크 카드결제 솔루션 결합", "✓ 이종 산업(가구구독 등) 임베디드 연계"]
    }
  }
];
