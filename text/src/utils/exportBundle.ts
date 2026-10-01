import JSZip from 'jszip';

export interface ProjectFile {
  path: string;
  content: string;
}

export const PROJECT_FILES: ProjectFile[] = [
  {
    path: 'package.json',
    content: `{
  "name": "kakao-scripture-sender",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "tsc --noEmit",
    "preview": "vite preview"
  },
  "dependencies": {
    "canvas-confetti": "^1.9.4",
    "lucide-react": "^0.546.0",
    "react": "^19.0.1",
    "react-dom": "^19.0.1"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.3.3",
    "@types/canvas-confetti": "^1.9.0",
    "@types/node": "^22.14.0",
    "@types/react": "^19.3.0",
    "@types/react-dom": "^19.3.0",
    "@vitejs/plugin-react": "^6.1.1",
    "tailwindcss": "^4.3.3",
    "typescript": "^7.0.2",
    "vite": "^8.3.0"
  }
}`,
  },
  {
    path: 'vite.config.ts',
    content: `import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});`,
  },
  {
    path: 'tsconfig.json',
    content: `{
  "compilerOptions": {
    "target": "ES2022",
    "experimentalDecorators": true,
    "useDefineForClassFields": false,
    "module": "ESNext",
    "types": ["vite/client"],
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "isolatedModules": true,
    "moduleDetection": "force",
    "allowJs": true,
    "jsx": "react-jsx",
    "paths": {
      "@/*": ["./*"]
    },
    "noEmit": true
  }
}`,
  },
  {
    path: 'index.html',
    content: `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>순원 말씀 알림이 - 카카오톡 1:1 개별 전송</title>
    <meta name="description" content="교회 순모임, 구역 공지 및 맞춤 성경 구절을 순원들에게 1:1로 정성스럽게 개별 전송하는 스마트 발송기" />
    <link rel="stylesheet" as="style" crossOrigin="anonymous" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
  </head>
  <body class="bg-[#F8F9FA] text-[#1E293B] antialiased">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,
  },
  {
    path: 'README.md',
    content: `# 순원 말씀 알림이 - 카카오톡 1:1 개별 전송 (Kakao Scripture Sender)

교회 순모임, 구역 공지 및 맞춤 성경 구절을 순원들에게 1:1로 정성스럽게 개별 전송하는 고품질 리액트 웹 애플리케이션입니다.

## ✨ 주요 기능
- 👥 **순/그룹 및 순원 관리**: 엑셀/카톡 복사-붙여넣기 일괄 파싱 등록, 순원 추가/삭제, 직분 관리
- ✍️ **맞춤 말씀 작성**: \`{이름}\`, \`{직분}\`, \`{순명}\`, \`{오늘날짜}\` 등 동적 치환 태그 지원
- 📜 **은혜의 말씀 라이브러리**: 인기 성경 구절 및 순모임 공지 템플릿 원클릭 삽입
- 🖼️ **사진 첨부 및 은혜 카드 프리셋**: 로컬 사진 업로드 및 사전 디자인된 SVG 은혜 카드 즉시 첨부
- 📱 **카카오톡 1:1 실시간 미리보기**: 순원별로 치환된 실제 카카오톡 노란색 대화창 시뮬레이션
- ⚡ **스마트 발송 제어**: 초고속 쾌속 모드, 전송 딜레이 조정, 실시간 프로그레스 바 및 전송 콘솔 로그

## 🚀 로컬 실행 방법
\`\`\`bash
# 1. 의존성 설치
npm install

# 2. 로컬 개발 서버 실행
npm run dev
\`\`\`
브라우저에서 \`http://localhost:3000\` 또는 Vite 콘솔에 출력된 주소로 접속합니다.
`,
  },
];

/**
 * Trigger download of the entire source code as a ZIP file
 */
export async function downloadSourceCodeZip(): Promise<void> {
  const zip = new JSZip();

  // Add static files
  PROJECT_FILES.forEach((f) => {
    zip.file(f.path, f.content);
  });

  // Generate ZIP
  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = url;
  a.download = `kakao-scripture-sender-${new Date().toISOString().slice(0, 10)}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
