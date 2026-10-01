import React from 'react';
import { SendLog } from '../types.ts';
import {
  Send,
  Clock,
  CheckCircle2,
  AlertCircle,
  Copy,
  RotateCcw,
  Square,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface SendControlsPanelProps {
  selectedCount: number;
  sendDelay: number;
  onChangeSendDelay: (delay: number) => void;
  isSending: boolean;
  onStartSend: () => void;
  onStopSend: () => void;
  progressPercent: number;
  currentSendingName: string;
  logs: SendLog[];
  onClearLogs: () => void;
  onCopyAllMessages: () => void;
}

export const SendControlsPanel: React.FC<SendControlsPanelProps> = ({
  selectedCount,
  sendDelay,
  onChangeSendDelay,
  isSending,
  onStartSend,
  onStopSend,
  progressPercent,
  currentSendingName,
  logs,
  onClearLogs,
  onCopyAllMessages,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-4">
      {/* Top Controls: Delay & Primary CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Delay Control */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-semibold text-slate-700 whitespace-nowrap">
              전송 딜레이
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <input
              type="number"
              step="0.1"
              min="0.2"
              max="5.0"
              value={sendDelay}
              onChange={(e) =>
                onChangeSendDelay(Math.max(0.2, parseFloat(e.target.value) || 0.5))
              }
              className="w-16 text-center text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-lg py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
            <span className="text-xs font-medium text-slate-500">초</span>
          </div>

          {/* Quick delay presets */}
          <div className="flex items-center gap-1">
            {[0.3, 0.5, 1.0].map((sec) => (
              <button
                key={sec}
                type="button"
                onClick={() => onChangeSendDelay(sec)}
                className={`px-2 py-1 text-[11px] font-medium rounded-md transition-colors ${
                  Math.abs(sendDelay - sec) < 0.05
                    ? 'bg-blue-100 text-blue-700 font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {sec}s
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={onCopyAllMessages}
            disabled={selectedCount === 0 || isSending}
            className="px-3.5 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-colors flex items-center gap-1.5"
            title="선택된 모든 순원의 맞춤 메시지를 클립보드에 복사"
          >
            <Copy className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden md:inline">맞춤 텍스트 일괄 복사</span>
            <span className="md:hidden">일괄 복사</span>
          </button>

          {isSending ? (
            <button
              type="button"
              onClick={onStopSend}
              className="px-6 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-xl transition-all shadow-sm flex items-center gap-2 animate-pulse"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>전송 일시 중지</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onStartSend}
              disabled={selectedCount === 0}
              className="flex-1 sm:flex-initial px-6 py-3 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 active:from-blue-800 active:to-sky-800 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-all shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2"
            >
              <span className="text-sm">💙</span>
              <span>{selectedCount}명에게 메시지 보내기</span>
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-slate-600">
            {isSending ? (
              <span className="text-blue-600 font-semibold flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                {currentSendingName}님께 전송 진행 중...
              </span>
            ) : progressPercent === 100 ? (
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                전체 발송 완료!
              </span>
            ) : (
              <span className="text-slate-500">발송 대기 중</span>
            )}
          </span>
          <span className="font-mono tabular-nums font-bold text-slate-700">
            {progressPercent}%
          </span>
        </div>

        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/80">
          <div
            className={`h-full transition-all duration-300 rounded-full ${
              progressPercent === 100
                ? 'bg-emerald-500'
                : 'bg-gradient-to-r from-blue-500 to-sky-500'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Real-time Status Console */}
      <div className="bg-slate-900 rounded-xl p-3 border border-slate-800 font-mono text-xs">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-semibold text-slate-300">전송 콘솔 로그</span>
            <span className="text-slate-500 font-normal">
              ({logs.length}건 기록됨)
            </span>
          </div>
          {logs.length > 0 && (
            <button
              type="button"
              onClick={onClearLogs}
              className="text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>로그 지우기</span>
            </button>
          )}
        </div>

        <div className="max-h-28 overflow-y-auto space-y-1.5 pr-1">
          {logs.length === 0 ? (
            <div className="py-3 text-center text-slate-500 text-[11px]">
              &gt; 아직 전송 기록이 없습니다. '메시지 보내기'를 누르면 실시간 전송 내역이 표시됩니다.
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="flex items-start justify-between gap-2 text-[11px] leading-relaxed"
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="text-slate-500 tabular-nums">
                    [{log.timestamp}]
                  </span>
                  <span className="font-semibold text-slate-200">
                    {log.memberName}
                  </span>
                  <span className="text-slate-400">➔</span>
                  <span
                    className={
                      log.status === 'success'
                        ? 'text-emerald-400'
                        : log.status === 'sending'
                        ? 'text-amber-400'
                        : 'text-rose-400'
                    }
                  >
                    {log.status === 'success' && '전송 완료 (1:1 카카오톡)'}
                    {log.status === 'sending' && '전송 진행 중...'}
                    {log.status === 'failed' && '전송 실패'}
                  </span>
                </div>
                {log.detail && (
                  <span className="text-slate-400 text-[10px] shrink-0">
                    {log.detail}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
