import { Group, Member, BibleVerse, MessageTemplate, PhotoAttachment } from '../types.ts';

export const INITIAL_GROUPS: Group[] = [
  { id: 'g1', name: '1순' },
  { id: 'g2', name: '2순' },
  { id: 'g3', name: '청년부 3순' },
  { id: 'g4', name: '새가족 섬김팀' },
];

export const INITIAL_MEMBERS: Member[] = [
  { id: 'm1', groupId: 'g1', name: '김준호', role: '순원', phone: '010-3841-9210', selected: true },
  { id: 'm2', groupId: 'g1', name: '은경이~♥', role: '순원', phone: '010-8291-0391', selected: true },
  { id: 'm3', groupId: 'g1', name: '박수현', role: '부순장', phone: '010-2104-5829', selected: true },
  { id: 'm4', groupId: 'g1', name: '이동원', role: '순원', phone: '010-4492-1182', selected: true },
  { id: 'm5', groupId: 'g1', name: '최지우', role: '새가족', phone: '010-9932-8471', selected: false },

  { id: 'm6', groupId: 'g2', name: '정다은', role: '순장', phone: '010-5512-8831', selected: true },
  { id: 'm7', groupId: 'g2', name: '최민재', role: '순원', phone: '010-7721-3948', selected: true },
  { id: 'm8', groupId: 'g2', name: '한소희', role: '순원', phone: '010-6629-1940', selected: true },
  { id: 'm9', groupId: 'g2', name: '임태훈', role: '순원', phone: '010-3129-9481', selected: true },

  { id: 'm10', groupId: 'g3', name: '강하늘', role: '청년리더', phone: '010-4820-1923', selected: true },
  { id: 'm11', groupId: 'g3', name: '윤서준', role: '순원', phone: '010-8819-2041', selected: true },
  { id: 'm12', groupId: 'g3', name: '송혜린', role: '순원', phone: '010-7723-5591', selected: true },

  { id: 'm13', groupId: 'g4', name: '오세훈', role: '팀장', phone: '010-1284-5920', selected: true },
  { id: 'm14', groupId: 'g4', name: '배수지', role: '간사', phone: '010-9482-1049', selected: true },
];

export const INITIAL_MESSAGE = `안녕하세요 {이름} 순원님! 😊
이번 주 순모임 말씀 나눔 안내드립니다.

[말씀 본문] 요한복음 3장 16절
"하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니 이는 그를 믿는 자마다 멸망하지 않고 영생을 얻게 하려 하심이라"

한 주간도 주님 안에서 평안하시고, 주일에 기쁨으로 뵙겠습니다!`;

export const BIBLE_VERSES: BibleVerse[] = [
  {
    id: 'bv1',
    reference: '요한복음 3:16',
    category: '사랑 & 복음',
    text: '하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니 이는 그를 믿는 자마다 멸망하지 않고 영생을 얻게 하려 하심이라',
  },
  {
    id: 'bv2',
    reference: '시편 23:1-3',
    category: '위로 & 평안',
    text: '여호와는 나의 목자시니 내게 부족함이 없으리로다 그가 나를 푸른 풀밭에 누이시며 쉴 만한 물 가로 인도하시는도다 내 영혼을 소생시키시고 자기 이름을 위하여 의의 길로 인도하시는도다',
  },
  {
    id: 'bv3',
    reference: '이사야 41:10',
    category: '용기 & 힘',
    text: '두려워하지 말라 내가 너와 함께 함이라 놀라지 말라 나는 네 하나님이 됨이라 내가 너를 굳세게 하리라 참으로 너를 도와 주리라 참으로 나의 의로운 오른손으로 너를 붙들리라',
  },
  {
    id: 'bv4',
    reference: '빌립보서 4:13',
    category: '믿음 & 승리',
    text: '내게 능력 주시는 자 안에서 내가 모든 것을 할 수 있느니라',
  },
  {
    id: 'bv5',
    reference: '민수기 6:24-26',
    category: '축복 & 평강',
    text: '여호와는 네게 복을 주시고 너를 지키시기를 원하며 여호와는 그의 얼굴을 네게 비추사 은혜 베푸시기를 원하며 여호와는 그 얼굴을 네게로 향하여 드사 평강 주시기를 원하노라 할지니라 하라',
  },
  {
    id: 'bv6',
    reference: '여호수아 1:9',
    category: '담대함 & 동행',
    text: '내가 네게 명령한 것이 아니냐 강하고 담대하라 두려워하지 말며 놀라지 말라 네가 어디로 가든지 네 하나님 여호와가 너와 함께 하느니라 하시니라',
  },
  {
    id: 'bv7',
    reference: '데살로니가전서 5:16-18',
    category: '감사 & 기쁨',
    text: '항상 기뻐하라 쉬지 말고 기도하라 범사에 감사하라 이것이 그리스도 예수 안에서 너희를 향하신 하나님의 뜻이니라',
  },
  {
    id: 'bv8',
    reference: '로마서 8:28',
    category: '소망 & 신뢰',
    text: '우리가 알거니와 하나님을 사랑하는 자 곧 그의 뜻대로 부르심을 입은 자들에게는 모든 것이 합력하여 선을 이루느니라',
  },
  {
    id: 'bv9',
    reference: '잠언 3:5-6',
    category: '지혜 & 인도',
    text: '너는 마음을 다하여 여호와를 신뢰하고 네 명철을 의지하지 말라 너는 범사에 그를 인정하라 그리하면 네 길을 지도하시리라',
  },
];

export const MESSAGE_TEMPLATES: MessageTemplate[] = [
  {
    id: 'tpl1',
    title: '주일 순모임 말씀 나눔 (기본형)',
    category: '정기 공지',
    description: '주일 순모임 주제 및 암송 구절 전달용',
    content: `안녕하세요 {이름} 순원님! 😊
이번 주 순모임 말씀 나눔 안내드립니다.

[말씀 본문] 요한복음 3장 16절
"하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니 이는 그를 믿는 자마다 멸망하지 않고 영생을 얻게 하려 하심이라"

한 주간도 주님 안에서 평안하시고, 이번 주일 은혜의 자리에서 기쁨으로 뵙겠습니다! ✨`,
  },
  {
    id: 'tpl2',
    title: '주중 안부 & 중보기도 격려',
    category: '심방 / 안부',
    description: '바쁜 주중 순원들을 응원하고 기도제목을 나누는 메시지',
    content: `사랑하는 {이름} {직분}님, 평안한 한 주 보내고 계신가요? 🌿

"두려워하지 말라 내가 너와 함께 함이라 놀라지 말라 나는 네 하나님이 됨이라" (사 41:10)

지치기 쉬운 주중이지만, 주님이 주시는 참된 쉼과 평안이 {이름}님의 삶 속에 가득하길 순장으로서 늘 기도하고 응원합니다.
혹시 나누고 싶은 기도제목이 있으시면 편하게 답장 남겨주세요! 사랑하고 축복합니다. 🙏`,
  },
  {
    id: 'tpl3',
    title: '순모임 장소 & 시간 안내',
    category: '모임 안내',
    description: '모임 일시와 장소, 준비물 공지',
    content: `샬롬! {이름}님, 이번 주 [{순명}] 순모임 안내드립니다. ☕

📅 일시: 이번 주일 예배 직후 오후 1시 30분
📍 장소: 본당 3층 소예배실 (또는 카페 로뎀)
📖 나눔 주제: 지난 주일 설교 '믿음의 발걸음' 나눔

서로의 삶을 축복하며 따뜻한 교제 나누는 시간이 되길 소망합니다.
참석 여부를 미리 알려주시면 감사하겠습니다! 😊`,
  },
  {
    id: 'tpl4',
    title: '순원 생일 축하 메시지',
    category: '축하',
    description: '순원의 특별한 생일을 축복하는 맞춤 메시지',
    content: `🎉 축복합니다! 오늘은 사랑하는 {이름}님의 생일입니다! 🎂✨

"여호와는 네게 복을 주시고 너를 지키시기를 원하며 그 얼굴을 네게로 향하여 드사 평강 주시기를 원하노라" (민 6:24,26)

하나님의 귀한 자녀로 이 땅에 보내주신 {이름}님을 순원 모두가 마음 다해 축하드립니다.
오늘 하루 그 어느 날보다 주님의 풍성한 사랑과 기쁨을 누리는 특별한 날 되세요! 축복합니다 💖`,
  },
  {
    id: 'tpl5',
    title: '새가족 환영 메시지',
    category: '새가족',
    description: '처음 등록한 순원을 따뜻하게 맞이하는 메시지',
    content: `샬롬! {이름}님, 우리 [{순명}]의 가족이 되신 것을 진심으로 환영하고 축복합니다! 🌸

처음이라 낯설고 어색하실 텐데, 주님 안에서 한 식구 되어 기쁨으로 함께 신앙생활 해나가길 기대합니다.
궁금하신 점이나 도움이 필요하신 것이 있다면 언제든 편하게 말씀해주세요.
주일날 반갑게 맞이하겠습니다! 축복합니다. 😊`,
  },
];

// High-quality SVG preset photo cards (clean, elegant Christian motifs with zero broken links)
export const PRESET_PHOTOS: PhotoAttachment[] = [
  {
    id: 'preset-1',
    name: '은혜의 성경과 빛.jpg',
    isPreset: true,
    size: '142 KB',
    url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><defs><linearGradient id="bg1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23FFFBEB"/><stop offset="50%" stop-color="%23FEF3C7"/><stop offset="100%" stop-color="%23FDE68A"/></linearGradient><radialGradient id="sun" cx="50%" cy="30%" r="50%"><stop offset="0%" stop-color="%23FFFFFF" stop-opacity="0.9"/><stop offset="100%" stop-color="%23FDE68A" stop-opacity="0"/></radialGradient></defs><rect width="600" height="400" fill="url(%23bg1)"/><circle cx="300" cy="140" r="180" fill="url(%23sun)"/><path d="M180 280 C240 260 290 270 300 285 C310 270 360 260 420 280 L420 310 C360 290 310 300 300 315 C290 300 240 290 180 310 Z" fill="%2378350F" opacity="0.15"/><path d="M190 270 C245 252 290 260 300 275 C310 260 355 252 410 270 L410 295 C355 277 310 285 300 300 C290 285 245 277 190 295 Z" fill="%23FFFFFF"/><path d="M299 265 L299 305" stroke="%23D97706" stroke-width="2"/><text x="300" y="160" font-family="sans-serif" font-size="28" font-weight="bold" fill="%2392400E" text-anchor="middle">은혜와 평강</text><text x="300" y="200" font-family="sans-serif" font-size="16" fill="%23B45309" text-anchor="middle">여호와는 네게 복을 주시고 너를 지키시기를 원하며</text></svg>`,
  },
  {
    id: 'preset-2',
    name: '아침 십자가와 소망.jpg',
    isPreset: true,
    size: '128 KB',
    url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><defs><linearGradient id="bg2" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="%23E0F2FE"/><stop offset="50%" stop-color="%23BAE6FD"/><stop offset="100%" stop-color="%23F0F9FF"/></linearGradient></defs><rect width="600" height="400" fill="url(%23bg2)"/><circle cx="300" cy="180" r="130" fill="%23FFFFFF" opacity="0.6"/><path d="M295 100 H305 V260 H295 Z M265 140 H335 V150 H265 Z" fill="%230369A1"/><text x="300" y="310" font-family="sans-serif" font-size="24" font-weight="bold" fill="%23075985" text-anchor="middle">주의 빛으로 걸어가는 한 주</text><text x="300" y="340" font-family="sans-serif" font-size="15" fill="%230284C7" text-anchor="middle">내게 능력 주시는 자 안에서 내가 모든 것을 할 수 있느니라</text></svg>`,
  },
  {
    id: 'preset-3',
    name: '따뜻한 사랑과 축복.jpg',
    isPreset: true,
    size: '135 KB',
    url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><defs><linearGradient id="bg3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23FDF2F8"/><stop offset="50%" stop-color="%23FCE7F3"/><stop offset="100%" stop-color="%23FBCFE8"/></linearGradient></defs><rect width="600" height="400" fill="url(%23bg3)"/><path d="M300 230 C270 200 240 170 240 140 C240 110 265 90 295 90 C310 90 325 100 330 110 C335 100 350 90 365 90 C395 90 420 110 420 140 C420 170 390 200 360 230 Z" transform="translate(-30, 20)" fill="%23DB2777" opacity="0.2"/><text x="300" y="190" font-family="sans-serif" font-size="30" font-weight="bold" fill="%239D174D" text-anchor="middle">주님의 사랑으로 축복합니다</text><text x="300" y="230" font-family="sans-serif" font-size="16" fill="%23BE185D" text-anchor="middle">서로 사랑하라 내가 너희를 사랑한 것 같이 너희도 서로 사랑하라</text></svg>`,
  },
];
