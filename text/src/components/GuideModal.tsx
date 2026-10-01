import React from 'react';
import { X, CheckCircle, ShieldCheck, Heart, Zap, Sparkles } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
              💡
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                순원 말씀 알림이 이용 가이드
              </h3>
              <p className="text-xs text-slate-500">
                따뜻한 순원 사역을 위한 1분 핵심 팁
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

        {/* Guide Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700 leading-relaxed">
          <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-2xl flex items-start gap-3">
            <Heart className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-blue-900 text-sm mb-1">
                왜 단체방보다 1:1 개별 전송이 좋을까요?
              </h4>
              <p className="text-blue-800/90 text-xs">
                수많은 공지가 쏟아지는 단체 카톡방과 달리, 순원의 이름이 적힌 1:1 메시지는
                나만을 위해 기도하고 신경 써준다는 깊은 존중과 감동을 전해줍니다.
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-1">
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
                1
              </span>
              <div>
                <strong className="text-slate-900 block font-semibold mb-0.5">
                  이름 자동 치환 {'{이름}'}
                </strong>
                본문 어디에든 <code className="bg-slate-100 px-1 py-0.5 rounded text-blue-600 font-mono">{'{이름}'}</code>을
                입력하면 각 순원의 이름으로 쏙 바뀝니다. (예: "안녕하세요 {'{이름}'} 순원님!")
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
                2
              </span>
              <div>
                <strong className="text-slate-900 block font-semibold mb-0.5">
                  명단 일괄 등록
                </strong>
                단체 카톡방 멤버 이름이나 엑셀 파일을 복사(Ctrl+C)하여 한번에
                수십 명의 순원을 추가할 수 있습니다.
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
                3
              </span>
              <div>
                <strong className="text-slate-900 block font-semibold mb-0.5">
                  전송 딜레이 권장값 (안전 전송)
                </strong>
                카카오톡의 전송 제한(스팸 방지)을 피하기 위해 기본 0.5초 또는 1.0초 이상의 딜레이를 권장합니다.
                소규모 순원 전송 시에는 <strong>초고속 쾌속 모드(0.3초)</strong>도 안전하게 사용 가능합니다.
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-xs"
          >
            확인했습니다
          </button>
        </div>
      </div>
    </div>
  );
};
