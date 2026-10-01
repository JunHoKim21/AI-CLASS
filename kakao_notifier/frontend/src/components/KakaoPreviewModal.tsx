import React, { useState } from 'react';
import { Member, PhotoAttachment } from '../types.ts';
import { formatPersonalizedMessage } from '../utils/messageHelper.ts';
import {
  X,
  Copy,
  Check,
  ChevronLeft,
  Search,
  Menu,
  Smile,
  Send,
  User,
} from 'lucide-react';

interface KakaoPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  messageTemplate: string;
  members: Member[];
  groupName: string;
  attachedPhoto: PhotoAttachment | null;
  initialMemberId?: string;
}

export const KakaoPreviewModal: React.FC<KakaoPreviewModalProps> = ({
  isOpen,
  onClose,
  messageTemplate,
  members,
  groupName,
  attachedPhoto,
  initialMemberId,
}) => {
  const [selectedMemberId, setSelectedMemberId] = useState<string>(
    initialMemberId || members[0]?.id || ''
  );
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentMember =
    members.find((m) => m.id === selectedMemberId) || members[0];
  const personalizedText = currentMember
    ? formatPersonalizedMessage(messageTemplate, currentMember, groupName)
    : messageTemplate;

  const handleCopy = () => {
    navigator.clipboard.writeText(personalizedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const now = new Date();
  const timeStr = `${now.getHours() < 12 ? '오전' : '오후'} ${
    now.getHours() % 12 || 12
  }:${String(now.getMinutes()).padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-amber-200" />
            <span className="text-sm font-bold text-slate-800">
              카카오톡 1:1 전송 실시간 미리보기
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Member Selector Bar */}
        <div className="px-4 py-2.5 bg-white border-b border-slate-100 flex items-center justify-between gap-3 text-xs">
          <span className="font-semibold text-slate-600 whitespace-nowrap">
            미리볼 순원 선택:
          </span>
          <select
            value={currentMember?.id}
            onChange={(e) => setSelectedMemberId(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-2.5 py-1.5 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.role || '순원'})
              </option>
            ))}
          </select>
        </div>

        {/* KakaoTalk Mobile Screen Emulation */}
        <div className="flex-1 bg-[#BACEE0] p-4 overflow-y-auto flex flex-col justify-between min-h-[440px]">
          {/* Kakao Header in Chat */}
          <div className="bg-[#BACEE0]/90 pb-3 flex items-center justify-between text-[#3C1E1E] text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <ChevronLeft className="w-4 h-4" />
              <span>{currentMember?.name || '순원'}</span>
              <span className="text-[10px] text-slate-600">1</span>
            </div>
            <div className="flex items-center gap-3 text-slate-700">
              <Search className="w-3.5 h-3.5" />
              <Menu className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Date Divider */}
          <div className="my-2 flex justify-center">
            <span className="bg-black/15 text-white text-[10px] font-medium px-2.5 py-0.5 rounded-full">
              {now.getFullYear()}년 {now.getMonth() + 1}월 {now.getDate()}일
            </span>
          </div>

          {/* Outgoing Message Bubble (Right aligned - You sending to Member) */}
          <div className="flex flex-col items-end my-2 space-y-1.5">
            {/* Attached Photo Preview */}
            {attachedPhoto && (
              <div className="flex items-end gap-1.5 max-w-[85%]">
                <div className="text-[10px] text-slate-600 font-mono text-right pb-0.5">
                  <div className="text-amber-800 font-bold">1</div>
                  <div>{timeStr}</div>
                </div>
                <div className="rounded-2xl overflow-hidden border border-black/10 shadow-sm max-w-[220px] bg-white">
                  <img
                    src={attachedPhoto.url}
                    alt={attachedPhoto.name}
                    className="w-full h-auto max-h-48 object-cover"
                  />
                </div>
              </div>
            )}

            {/* Yellow Message Bubble */}
            <div className="flex items-end gap-1.5 max-w-[85%]">
              <div className="text-[10px] text-slate-600 font-mono text-right pb-0.5 shrink-0">
                <div className="text-amber-800 font-bold">1</div>
                <div>{timeStr}</div>
              </div>

              <div className="relative bg-[#FEE500] text-[#3C1E1E] text-xs leading-relaxed px-3.5 py-2.5 rounded-2xl rounded-tr-xs shadow-xs break-words whitespace-pre-wrap font-sans">
                {personalizedText}
              </div>
            </div>
          </div>

          {/* Bottom Chat Input Bar Emulation */}
          <div className="mt-4 pt-2 border-t border-slate-300/40 flex items-center gap-2">
            <div className="flex-1 bg-white rounded-full px-3 py-1.5 flex items-center justify-between text-xs text-slate-400 shadow-2xs">
              <span className="truncate">{currentMember?.name}님에게 보낼 메시지...</span>
              <Smile className="w-4 h-4 text-slate-400" />
            </div>
            <div className="w-7 h-7 rounded-full bg-[#FEE500] flex items-center justify-center text-[#3C1E1E]">
              <Send className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            {currentMember?.name}님 맞춤 완성 메시지
          </p>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-800 bg-[#FEE500] hover:bg-[#FDD835] active:bg-[#FBC02D] rounded-xl transition-all shadow-xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-700" />
                <span className="text-emerald-900">복사 완료!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>이 메시지 복사하기</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
