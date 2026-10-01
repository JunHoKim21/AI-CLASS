import React, { useState } from 'react';
import { downloadSourceCodeZip } from '../utils/exportBundle.ts';
import {
  X,
  Download,
  Copy,
  Check,
  ExternalLink,
  Code,
  FolderArchive,
  Bot,
  Github,
  Sparkles,
} from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  if (!isOpen) return null;

  const handleDownloadZip = async () => {
    try {
      setDownloading(true);
      await downloadSourceCodeZip();
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyPromptSummary = () => {
    const promptText = `[순원 말씀 알림이 - 카카오톡 1:1 개별 전송 프로젝트 소스코드]

기술 스택: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide-react, canvas-confetti
주요 목적: 순모임 및 교회 구역 리더가 순원들에게 1:1로 이름을 동적 치환하여 맞춤 말씀과 공지, 사진을 카카오톡으로 발송/관리하는 웹 애플리케이션.

주요 파일 구성:
- src/App.tsx (메인 상태 관리, 발송 시뮬레이터, 그룹/순원 연동)
- src/types.ts (Group, Member, PhotoAttachment, BibleVerse, MessageTemplate, SendLog)
- src/data/defaultData.ts (기본 순원 명단, 은혜의 성경 구절, 공지 템플릿, SVG 카드 프리셋)
- src/utils/messageHelper.ts (이름/직분/순명/날짜 치환 로직, 엑셀/카톡 명단 일괄 파서)
- src/components/MemberListPanel.tsx (순원 관리, 엑셀 복붙 등록, 검색, 체크박스 선택)
- src/components/MessageComposePanel.tsx (말씀 작성, 사진 첨부, 치환 태그 빠른 삽입)
- src/components/SendControlsPanel.tsx (딜레이 조정, 실시간 발송 프로그레스 바, 콘솔 로그)
- src/components/KakaoPreviewModal.tsx (실제 노란색 카카오톡 1:1 대화창 실시간 시뮬레이션)
- src/components/BulkImportModal.tsx (엑셀/카톡 명단 대량 파싱 모달)
- src/components/BibleVerseModal.tsx (성경 구절 라이브러리)
- src/components/TemplateModal.tsx (순모임 공지 템플릿 라이브러리)
`;

    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-100 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                안티그래비티(Antigravity)로 소스코드 넘기기
              </h3>
              <p className="text-xs text-slate-500">
                현재 개발된 소스코드를 안티그래비티 환경으로 손쉽게 이전하는 3가지 방법
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Method 1: Instant ZIP Download */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50/60 border border-blue-100 rounded-2xl space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <FolderArchive className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    방법 1. 전체 소스코드 ZIP 파일 다운로드 (가장 추천)
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    React + TypeScript + Vite 설정 및 컴포넌트 전체가 포함된 압축 파일을 다운로드받아, 안티그래비티 워크스페이스에 드래그하거나 압축을 풀어 작업합니다.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDownloadZip}
                disabled={downloading}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl transition-all shadow-xs flex items-center gap-1.5 shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>{downloading ? '압축 중...' : 'ZIP 다운로드'}</span>
              </button>
            </div>
          </div>

          {/* Method 2: AI Studio GitHub Export */}
          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
            <div className="flex items-start gap-2.5">
              <Github className="w-5 h-5 text-slate-700 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  방법 2. AI Studio의 'Export to GitHub' 기능 활용
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  화면 우측 상단의 <strong>AI Studio 메인 메뉴 (점 세개 또는 공유/내보내기 아이콘)</strong>에서 
                  <code className="bg-slate-200/80 px-1.5 py-0.5 rounded text-slate-800 font-mono text-[11px] mx-1">
                    Export to GitHub
                  </code>
                  를 선택하면 본인의 GitHub 레포지토리로 바로 커밋·푸시됩니다. 이후 안티그래비티에서 해당 GitHub Repo를 그대로 불러와 연동할 수 있습니다.
                </p>
              </div>
            </div>
          </div>

          {/* Method 3: Prompt Text Copy */}
          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <Code className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    방법 3. 안티그래비티 프롬프트에 바로 붙여넣기
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    안티그래비티 대화창에 현재 프로젝트의 아키텍처와 전체 구조를 한 번에 전달할 수 있도록 요약본을 복사합니다.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCopyPromptSummary}
                className="px-3.5 py-2 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl transition-colors flex items-center gap-1.5 shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>복사 완료!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>프롬프트 복사</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
