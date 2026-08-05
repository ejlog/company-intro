/**
 * Single source of truth for site content.
 *
 * The five source HTML pages repeated the nav, the footer and the business
 * copy verbatim; keeping the copy here means a wording change happens once.
 * Everything is plain data so pages stay declarative and a future CMS can
 * replace this module without touching the components.
 */

export const company = {
  nameKo: '(주)애드센',
  nameEn: 'ADDSEN Co., Ltd.',
  brand: 'ADDSEN',
  brandSub: 'Physical AI',
  footerSub: 'PHYSICAL AI RESEARCH',
  tagline: 'Physical AI',
  address: '경기도 성남시 분당구 판교로 235, 애드센타워 7F',
  addressShort: '경기도 성남시 분당구 판교로 235',
  tel: '031-000-0000',
  email: 'contact@addsen.ai',
  hours: '평일 09:00 – 18:00 (점심 12:00 – 13:00)',
  copyright: '© 2026 ADDSEN CO., LTD. ALL RIGHTS RESERVED.',
} as const;

export type NavItem = { href: string; label: string };

export const navItems: NavItem[] = [
  { href: '/about/', label: '회사소개' },
  { href: '/business/', label: '사업영역' },
  { href: '/history/', label: '연혁' },
  { href: '/news/', label: '뉴스룸' },
  { href: '/#contact', label: '오시는 길' },
];

export const footerColumns: { heading: string; links: NavItem[] }[] = [
  {
    heading: 'COMPANY',
    links: [
      { href: '/about/', label: '회사소개' },
      { href: '/history/', label: '연혁' },
      { href: '/business/', label: '사업영역' },
    ],
  },
  {
    heading: 'RESOURCES',
    links: [
      { href: '/news/', label: '뉴스룸' },
      { href: '/#contact', label: '오시는 길' },
    ],
  },
];

export const stats = [
  { value: '2019', label: '설립 연도' },
  { value: '84명', label: '연구·개발 인력' },
  { value: '31건', label: '등록 특허' },
  { value: '12개', label: '산업 현장 도입' },
];

/**
 * Business areas. `summary` is the short copy used on the home page stage,
 * `detail` the longer copy on /business/. `image` is null where the source
 * site still shows a placeholder rather than a photograph.
 */
export type BusinessArea = {
  id: string;
  kicker: string;
  title: string;
  summary: string;
  detail: string;
  tags: string[];
  image: { src: string; alt: string } | null;
  placeholder: string;
};

export const businessAreas: BusinessArea[] = [
  {
    id: 'foundation-model',
    kicker: 'FOUNDATION MODEL',
    title: '로봇 파운데이션 모델',
    summary:
      '수천 시간의 조작 데이터로 학습한 범용 제어 모델. 새로운 작업을 소량의 시연만으로 습득합니다.',
    detail:
      '실제 로봇에서 수집한 조작 데이터와 대규모 시뮬레이션을 함께 학습해, 작업별 재프로그래밍 없이 지시만으로 동작하는 범용 제어 모델을 개발합니다. 신규 공정 적용까지 평균 3일이 소요됩니다.',
    tags: ['Imitation Learning', 'Sim2Real', 'VLA Model'],
    image: { src: '/img/biz-01-simulation.jpg', alt: '로봇 학습 시뮬레이션 화면' },
    placeholder: '[ IMAGE ] 로봇 학습 시뮬레이션',
  },
  {
    id: 'manipulation',
    kicker: 'MANIPULATION',
    title: '자율 매니퓰레이션',
    summary: '비정형 물체를 인식하고 파지·조립·검사까지 수행하는 로봇 팔 솔루션입니다.',
    detail:
      '형상과 재질이 일정하지 않은 부품을 다루는 산업 공정을 대상으로 파지, 조립, 외관 검사를 자동화합니다. 힘 제어 기반 컴플라이언스로 파손 없이 정밀 작업을 수행합니다.',
    tags: ['Force Control', 'Bin Picking', 'Assembly'],
    image: { src: '/img/biz-02-gripper.jpg', alt: '금속 부품을 파지하는 2지 그리퍼' },
    placeholder: '[ IMAGE ] 2지 그리퍼 파지',
  },
  {
    id: 'sensing',
    kicker: 'SENSING',
    title: '센서 퓨전 · 인식',
    summary: '카메라·라이다·촉각 센서를 통합해 조명과 오염에 강인한 3D 인식을 제공합니다.',
    detail:
      'RGB-D 카메라, 라이다, 촉각 센서 신호를 하나의 표현으로 융합해 조명 변화·분진·반사가 심한 현장에서도 안정적인 3D 장면 이해를 제공합니다.',
    tags: ['3D Perception', 'Tactile', 'Calibration'],
    image: { src: '/img/biz-03-perception.jpg', alt: '작업대를 스캔한 3D 포인트 클라우드' },
    placeholder: '[ IMAGE ] 3D 포인트 클라우드',
  },
  {
    id: 'deployment',
    kicker: 'DEPLOYMENT',
    title: '현장 통합 · 운영',
    summary: '기존 설비와 MES에 연동되는 통합 설계부터 원격 모니터링, 모델 재학습까지 지원합니다.',
    detail:
      '기존 설비와 MES에 연동되는 통합 설계부터 원격 모니터링, 모델 재학습까지 운영 전 주기를 지원합니다. 가동률과 이상 이벤트를 대시보드로 관리합니다.',
    tags: ['MES 연동', 'Fleet Ops', 'OTA Update'],
    image: null,
    placeholder: '[ IMAGE ] 제조 라인 설치 현장',
  },
];

/** Home-page history digest: one headline per milestone year. */
export const historyHighlights = [
  {
    year: '2026',
    text: '피지컬 AI 파운데이션 모델 ADDSEN-M2 공개, 국내 완성차 부품사 양산 라인 적용',
  },
  { year: '2024', text: '시리즈 B 320억 원 투자 유치, 판교 로보틱스 연구소 설립' },
  { year: '2022', text: '자율 매니퓰레이션 솔루션 첫 상용 도입, 등록 특허 10건 돌파' },
  { year: '2019', text: '(주)애드센 설립, 로봇 인식 연구팀 구성' },
];

/** Full history for /history/, newest first. `month` is the two-digit month. */
export type HistoryYear = { year: string; items: { month: string; text: string }[] };

export const historyByYear: HistoryYear[] = [
  {
    year: '2026',
    items: [
      { month: '05', text: '파운데이션 모델 ADDSEN-M2 공개' },
      { month: '02', text: '국내 완성차 부품사 양산 라인 적용 계약 체결' },
    ],
  },
  {
    year: '2025',
    items: [
      { month: '11', text: '물류 창고 자동 피킹 시스템 실증 완료' },
      { month: '06', text: '산업통상자원부 로봇 실증 국책과제 주관기관 선정' },
    ],
  },
  {
    year: '2024',
    items: [
      { month: '09', text: '시리즈 B 320억 원 투자 유치' },
      { month: '03', text: '판교 로보틱스 연구소 설립, 연구 인력 60명 확대' },
    ],
  },
  {
    year: '2022',
    items: [
      { month: '10', text: '자율 매니퓰레이션 솔루션 첫 상용 도입' },
      { month: '04', text: '등록 특허 10건 돌파' },
    ],
  },
  {
    year: '2021',
    items: [
      { month: '07', text: '시리즈 A 65억 원 투자 유치' },
      { month: '01', text: '벤처기업 인증 및 기업부설연구소 설립' },
    ],
  },
  {
    year: '2019',
    items: [{ month: '03', text: '(주)애드센 설립' }],
  },
];

/**
 * Newsroom entries, newest first. `date` is an ISO date so it can drive both
 * the display string and a machine-readable <time datetime>.
 */
export type NewsCategory = 'PRESS' | 'BUSINESS' | 'RESEARCH' | 'COMPANY';

export type NewsItem = {
  slug: string;
  date: string;
  category: NewsCategory;
  title: string;
  excerpt: string;
};

export const newsItems: NewsItem[] = [
  {
    slug: 'addsen-m2',
    date: '2026-07-28',
    category: 'PRESS',
    title: '애드센, 피지컬 AI 모델 ADDSEN-M2 공개',
    excerpt: '소량 시연만으로 신규 공정을 습득하는 범용 로봇 제어 모델을 발표했습니다.',
  },
  {
    slug: 'automotive-line',
    date: '2026-06-11',
    category: 'BUSINESS',
    title: '완성차 부품 양산 라인에 자율 매니퓰레이션 도입',
    excerpt: '비정형 부품 조립 공정에 적용해 사이클 타임을 18% 단축했습니다.',
  },
  {
    slug: 'icra-2026',
    date: '2026-04-02',
    category: 'RESEARCH',
    title: 'ICRA 2026 논문 2편 채택',
    excerpt: '촉각 기반 컴플라이언스 제어와 시뮬레이션 전이 학습 연구가 채택되었습니다.',
  },
  {
    slug: 'pangyo-lab',
    date: '2026-02-19',
    category: 'COMPANY',
    title: '판교 연구소 확장 이전 완료',
    excerpt: '실물 로봇 12대 규모의 실험 공간을 갖춘 연구소로 이전했습니다.',
  },
  {
    slug: 'warehouse-picking',
    date: '2025-11-05',
    category: 'BUSINESS',
    title: '물류 창고 자동 피킹 시스템 실증 완료',
    excerpt: '다품종 소량 피킹 환경에서 6개월 무중단 운영을 검증했습니다.',
  },
  {
    slug: 'motie-project',
    date: '2025-06-24',
    category: 'COMPANY',
    title: '산업통상자원부 국책과제 주관기관 선정',
    excerpt: '3년간 로봇 자율 조작 실증 과제를 주관합니다.',
  },
];

/** `2026-07-28` -> `2026.07.28`, the format the design uses. */
export function formatDate(iso: string): string {
  return iso.replaceAll('-', '.');
}

export const corporateProfile = [
  { term: '회사명', description: '(주)애드센 / ADDSEN Co., Ltd.' },
  { term: '설립일', description: '2019년 3월 12일' },
  { term: '대표이사', description: '홍길동' },
  { term: '사업 분야', description: '피지컬 AI 연구개발, 로봇 소프트웨어' },
  { term: '임직원', description: '128명 (연구·개발 84명)' },
  { term: '본사', description: '경기도 성남시 분당구 판교로 235' },
];

export const principles = [
  {
    kicker: 'RESEARCH FIRST',
    title: '연구가 먼저다',
    body: '매출보다 먼저 문제를 정의합니다. 전체 인력의 절반 이상이 연구·개발에 속해 있습니다.',
  },
  {
    kicker: 'FIELD PROVEN',
    title: '현장에서 증명한다',
    body: '데모가 아닌 가동률로 평가합니다. 모든 기술은 실제 라인에서 검증한 뒤 제품이 됩니다.',
  },
  {
    kicker: 'SAFETY BY DESIGN',
    title: '안전이 설계다',
    body: '사람과 함께 일하는 기계를 만듭니다. 안전은 기능이 아니라 전제 조건입니다.',
  },
];

export const contactDetails = [
  { term: 'ADDRESS', description: company.address },
  { term: 'TEL', description: company.tel },
  { term: 'EMAIL', description: company.email },
  { term: 'HOURS', description: company.hours },
];
