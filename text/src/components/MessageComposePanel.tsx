import React, { useRef, useState } from 'react';
import { PhotoAttachment } from '../types.ts';
import { PRESET_PHOTOS } from '../data/defaultData.ts';
import {
  PenLine,
  Image as ImageIcon,
  X,
  Upload,
  Sparkles,
  BookOpen,
  Eye,
  Info,
  Palette,
  Check,
} from 'lucide-react';

interface MessageComposePanelProps {
  message: string;
  onChangeMessage: (val: string) => void;
  attachedPhoto: PhotoAttachment | null;
  onAttachPhoto: (photo: PhotoAttachment | null) => void;
  onOpenVersePicker: () => void;
  onOpenTemplates: () => void;
  onOpenPreview: () => void;
}

export const MessageComposePanel: React.FC<MessageComposePanelProps> = ({
  message,
  onChangeMessage,
  attachedPhoto,
  onAttachPhoto,
  onOpenVersePicker,
  onOpenTemplates,
  onOpenPreview,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showPresetsDropdown, setShowPresetsDropdown] = useState(false);

  // Insert variable into cursor position
  const insertVariable = (tag: string) => {
    if (!textareaRef.current) {
      onChangeMessage(message + tag);
      return;
    }
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const nextText = message.substring(0, start) + tag + message.substring(end);
    onChangeMessage(nextText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + tag.length, start + tag.length);
    }, 10);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      const sizeKB = Math.round(file.size / 1024);
      onAttachPhoto({
        id: `upload-${Date.now()}`,
        name: file.name,
        url,
        size: `${sizeKB} KB`,
      });
    };
    reader.readAsDataURL(file);
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm flex flex-col h-[780px] overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 bg-gradient-to-b from-slate-50/70 to-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
                <PenLine className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                어떤 말씀을 전할까요?
              </h2>
            </div>
            <p className="text-xs text-slate-500 pl-8">
              정성 담긴 말씀과 공지, 사진을 함께 준비해보세요
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenVersePicker}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100/80 rounded-lg transition-colors border border-blue-200/70"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>성경 구절 추천</span>
            </button>
            <button
              type="button"
              onClick={onOpenPreview}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-900 bg-[#FEE500] hover:bg-[#FDD835] active:bg-[#FBC02D] rounded-lg transition-all shadow-xs"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>카톡 미리보기</span>
            </button>
          </div>
        </div>

        {/* Photo Attachment Bar */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />

          <div className="flex items-center justify-between gap-3 p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors shadow-2xs"
              >
                <Upload className="w-3.5 h-3.5 text-blue-600" />
                <span>내 사진 첨부하기</span>
              </button>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowPresetsDropdown(!showPresetsDropdown)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
                >
                  <Palette className="w-3.5 h-3.5 text-amber-600" />
                  <span>은혜 카드 프리셋</span>
                </button>

                {showPresetsDropdown && (
                  <div className="absolute left-0 mt-1 w-64 bg-white border border-slate-200 rounded-xl shadow-lg z-20 p-2 space-y-1.5">
                    <p className="text-[11px] font-semibold text-slate-500 px-2 py-1">
                      클릭하여 즉시 첨부:
                    </p>
                    {PRESET_PHOTOS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          onAttachPhoto(preset);
                          setShowPresetsDropdown(false);
                        }}
                        className="w-full flex items-center gap-2 p-1.5 hover:bg-slate-50 rounded-lg transition-colors text-left"
                      >
                        <img
                          src={preset.url}
                          alt={preset.name}
                          className="w-10 h-7 object-cover rounded border border-slate-200"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-800 truncate">
                            {preset.name}
                          </p>
                          <p className="text-[10px] text-slate-400">{preset.size}</p>
                        </div>
                        {attachedPhoto?.id === preset.id && (
                          <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Attached Photo Info or Empty state */}
            {attachedPhoto ? (
              <div className="flex items-center gap-2 max-w-[280px]">
                <img
                  src={attachedPhoto.url}
                  alt={attachedPhoto.name}
                  className="w-8 h-8 object-cover rounded-lg border border-slate-200 shrink-0"
                />
                <span className="text-xs font-medium text-slate-700 truncate">
                  {attachedPhoto.name}
                </span>
                <button
                  type="button"
                  onClick={() => onAttachPhoto(null)}
                  className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors shrink-0"
                  title="사진 삭제"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <span className="text-xs text-slate-400 pr-2">
                선택된 사진 없음 (글만 전송)
              </span>
            )}
          </div>
        </div>

        {/* Dynamic Variable Chips & Guide Card */}
        <div className="mt-3 p-3 bg-blue-50/70 border border-blue-100 rounded-xl">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-xs text-blue-900 leading-relaxed">
              <span className="font-semibold">이름 치환 안내:</span> 본문에{' '}
              <code className="font-mono font-bold bg-white px-1.5 py-0.5 rounded text-blue-700 border border-blue-200/80">
                {'{이름}'}
              </code>{' '}
              을 넣으면 각 순원의 이름으로 쏙 치환됩니다.
              <span className="text-blue-700/80 text-[11px] block mt-0.5">
                예: 안녕하세요 {'{이름}'} 순원님! ➔ 안녕하세요 김준호 순원님!
              </span>
            </div>
          </div>

          <div className="mt-2.5 pt-2 border-t border-blue-100/80 flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-medium text-blue-700 mr-1">
              빠른 삽입:
            </span>
            {[
              { tag: '{이름}', label: '{이름}' },
              { tag: '{직분}', label: '{직분}' },
              { tag: '{순명}', label: '{순명}' },
              { tag: '{오늘날짜}', label: '{오늘날짜}' },
              { tag: '{요일}', label: '{요일}' },
            ].map(({ tag, label }) => (
              <button
                key={tag}
                type="button"
                onClick={() => insertVariable(tag)}
                className="px-2 py-0.5 text-xs font-mono font-semibold bg-white hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-md transition-colors shadow-2xs"
              >
                + {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Message Textarea */}
      <div className="flex-1 flex flex-col p-4">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => onChangeMessage(e.target.value)}
          placeholder="순원들에게 전할 정성 담긴 말씀과 공지사항을 입력하세요..."
          className="flex-1 w-full p-4 bg-slate-50/60 rounded-xl border border-slate-200 text-slate-800 text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-sans"
        />

        {/* Textarea Footer Stats */}
        <div className="mt-2 flex items-center justify-between text-xs text-slate-400 px-1">
          <div className="flex items-center gap-3">
            <span>
              글자 수:{' '}
              <strong className="text-slate-600 font-mono tabular-nums">
                {message.length}
              </strong>
              자
            </span>
            <span>·</span>
            <span>
              줄 수:{' '}
              <strong className="text-slate-600 font-mono tabular-nums">
                {message.split('\n').length}
              </strong>
              줄
            </span>
          </div>

          <button
            type="button"
            onClick={onOpenTemplates}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium hover:underline"
          >
            기본 템플릿 다시 불러오기
          </button>
        </div>
      </div>
    </div>
  );
};
