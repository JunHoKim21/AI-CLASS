import React from 'react';
import { MessageTemplate } from '../types.ts';
import { MESSAGE_TEMPLATES } from '../data/defaultData.ts';
import { X, Sparkles, Check, Bookmark } from 'lucide-react';

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: MessageTemplate) => void;
}

export const TemplateModal: React.FC<TemplateModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-100 flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-100/80 text-purple-700">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                순모임 공지 및 말씀 템플릿
              </h3>
              <p className="text-xs text-slate-500">
                상황에 맞게 준비된 정성스러운 메시지 템플릿을 불러옵니다
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

        {/* Content list */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {MESSAGE_TEMPLATES.map((tpl) => (
            <div
              key={tpl.id}
              className="p-4 rounded-2xl border border-slate-200/80 hover:border-purple-300 hover:bg-purple-50/20 transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    {tpl.title}
                  </h4>
                  <p className="text-[11px] text-slate-500">{tpl.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onSelectTemplate(tpl);
                    onClose();
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors border border-purple-200/60 shrink-0"
                >
                  이 서식 적용
                </button>
              </div>

              <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100 text-[11px] text-slate-600 font-sans leading-relaxed whitespace-pre-wrap max-h-32 overflow-y-auto">
                {tpl.content}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
