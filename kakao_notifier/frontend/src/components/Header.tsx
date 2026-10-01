import React from 'react';
import { Feather, Zap, BookOpen, HelpCircle, ShieldCheck, Download } from 'lucide-react';

interface HeaderProps {
  expressMode: boolean;
  onToggleExpressMode: () => void;
  onOpenGuide: () => void;
  onOpenTemplates: () => void;
  onOpenExport: () => void;
  totalMembersCount: number;
  selectedCount: number;
  currentGroupName: string;
}

export const Header: React.FC<HeaderProps> = ({
  expressMode,
  onToggleExpressMode,
  onOpenGuide,
  onOpenTemplates,
  onOpenExport,
  totalMembersCount,
  selectedCount,
  currentGroupName,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark & Domain Context */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-sm ring-2 ring-blue-100">
            <Feather className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-slate-900">
                순원 말씀 알림이
              </span>
              <span className="text-[11px] font-semibold text-amber-800 bg-[#FEE500]/60 px-2 py-0.5 rounded-full border border-amber-300/40">
                카카오톡 1:1 개별 전송
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              {currentGroupName} · 전체 {totalMembersCount}명 중{' '}
              <strong className="text-blue-600 font-semibold">{selectedCount}명</strong> 선택됨
            </p>
          </div>
        </div>

        {/* Zone 2: Navigation & Quick Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* 필요 시 다시 활성화: 소스코드 내보내기 버튼
          <button
            onClick={onOpenExport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-200 shadow-2xs"
            title="안티그래비티로 소스코드 내보내기 / ZIP 다운로드"
          >
            <Download className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">소스코드 내보내기</span>
            <span className="sm:hidden">내보내기</span>
          </button>
          */}

          <button
            onClick={onOpenTemplates}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">말씀/공지 템플릿</span>
            <span className="sm:hidden">템플릿</span>
          </button>

          <button
            onClick={onOpenGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
            <span>이용 가이드</span>
          </button>

          {/* Express Mode Toggle */}
          <button
            onClick={onToggleExpressMode}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all border ${
              expressMode
                ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-xs'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
            title={expressMode ? '0.3~0.5초 고속 전송 활성화' : '1.5초 안전 전송 모드'}
          >
            {expressMode ? (
              <>
                <Zap className="w-3.5 h-3.5 text-blue-600 fill-blue-600" />
                <span>초고속 쾌속 모드 활성</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-500">안전 모드 (1.5s)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
