import React, { useState } from 'react';
import { Group, Member } from '../types.ts';
import { parseBulkMembersInput } from '../utils/messageHelper.ts';
import {
  X,
  FileSpreadsheet,
  MessageSquare,
  Sparkles,
  Check,
  AlertCircle,
  Users,
} from 'lucide-react';

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  groups: Group[];
  currentGroupId: string;
  onImportMembers: (
    newMembers: Omit<Member, 'id' | 'selected'>[],
    targetGroupId: string
  ) => void;
}

export const BulkImportModal: React.FC<BulkImportModalProps> = ({
  isOpen,
  onClose,
  groups,
  currentGroupId,
  onImportMembers,
}) => {
  const [activeTab, setActiveTab] = useState<'text' | 'excel'>('text');
  const [targetGroup, setTargetGroup] = useState(currentGroupId);
  const [inputText, setInputText] = useState('');

  if (!isOpen) return null;

  const parsedList = parseBulkMembersInput(inputText, targetGroup);

  const handleFillSample = () => {
    if (activeTab === 'text') {
      setInputText(`김준호, 은경이~♥, 박수현 (순장), 이동원, 최지우, 정다은, 한소희`);
    } else {
      setInputText(`김준호\t순원\t010-3841-9210\t찬양팀
은경이~♥\t순원\t010-8291-0391\t새가족부
박수현\t순장\t010-2104-5829\t순모임인도
이동원\t순원\t010-4492-1182\t주일학교
최지우\t새가족\t010-9932-8471\t청년부`);
    }
  };

  const handleConfirm = () => {
    if (parsedList.length === 0) return;
    onImportMembers(parsedList, targetGroup);
    onClose();
    setInputText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-100/70 text-blue-700">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                명단 일괄 등록
              </h3>
              <p className="text-xs text-slate-500">
                엑셀이나 카카오톡 채팅방 명단을 복사해 붙여넣으세요
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
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Target Group Selector */}
          <div className="flex items-center justify-between gap-3 p-3 bg-blue-50/50 border border-blue-100 rounded-xl text-xs">
            <span className="font-semibold text-slate-700">
              등록할 순/그룹 선택:
            </span>
            <select
              value={targetGroup}
              onChange={(e) => setTargetGroup(e.target.value)}
              className="bg-white border border-slate-200 text-slate-800 rounded-lg px-3 py-1.5 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          {/* Format Tabs */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('text');
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === 'text'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                카톡 쉼표 / 줄바꿈 형식
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('excel');
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === 'excel'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                엑셀 표 (Tab 구분) 복붙
              </button>
            </div>

            <button
              type="button"
              onClick={handleFillSample}
              className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>샘플 붙여넣기</span>
            </button>
          </div>

          {/* Paste Textarea */}
          <div>
            <textarea
              rows={6}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                activeTab === 'text'
                  ? `순원 이름을 쉼표(,)나 줄바꿈으로 입력하세요.\n예시:\n김준호, 은경이~♥\n박수현\n이동원`
                  : `엑셀에서 복사(Ctrl+C)한 표를 그대로 붙여넣으세요.\n열 순서: 이름 | 직분 | 연락처 | 메모\n예시:\n김준호\t순원\t010-3841-9210\t새가족`
              }
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white resize-none"
            />
          </div>

          {/* Live Parsed Preview Table */}
          {parsedList.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">
                  인식된 순원 목록 (
                  <strong className="text-blue-600 font-mono">
                    {parsedList.length}
                  </strong>
                  명):
                </span>
                <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  파싱 완료
                </span>
              </div>

              <div className="max-h-36 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100 text-xs">
                {parsedList.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2 px-3 flex items-center justify-between hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-400 text-[10px] w-4">
                        {idx + 1}
                      </span>
                      <span className="font-semibold text-slate-800">
                        {item.name}
                      </span>
                      {item.role && (
                        <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          {item.role}
                        </span>
                      )}
                    </div>
                    {item.phone && (
                      <span className="text-slate-400 text-[11px] font-mono">
                        {item.phone}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200/50 rounded-xl transition-colors"
          >
            취소
          </button>
          <button
            type="button"
            disabled={parsedList.length === 0}
            onClick={handleConfirm}
            className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-all shadow-xs flex items-center gap-1.5"
          >
            <Users className="w-4 h-4" />
            <span>{parsedList.length}명 순원으로 등록하기</span>
          </button>
        </div>
      </div>
    </div>
  );
};
