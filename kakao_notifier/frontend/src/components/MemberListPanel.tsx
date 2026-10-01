import React, { useState } from 'react';
import { Group, Member } from '../types.ts';
import {
  Users,
  UserPlus,
  Plus,
  Trash2,
  FileSpreadsheet,
  Search,
  CheckSquare,
  Square,
  MessageCircle,
  X,
  FolderPlus,
  Edit2,
} from 'lucide-react';

interface MemberListPanelProps {
  groups: Group[];
  currentGroupId: string;
  onSelectGroup: (groupId: string) => void;
  onAddGroup: () => void;
  onDeleteGroup: () => void;
  onRenameGroup: () => void;
  members: Member[];
  onToggleMember: (id: string) => void;
  onToggleAll: (selectAll: boolean) => void;
  onDeleteMember: (id: string) => void;
  onAddMember: (name: string, role?: string) => void;
  onOpenBulkImport: () => void;
  onPreviewMember: (member: Member) => void;
}

export const MemberListPanel: React.FC<MemberListPanelProps> = ({
  groups,
  currentGroupId,
  onSelectGroup,
  onAddGroup,
  onDeleteGroup,
  onRenameGroup,
  members,
  onToggleMember,
  onToggleAll,
  onDeleteMember,
  onAddMember,
  onOpenBulkImport,
  onPreviewMember,
}) => {
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('순원');
  const [searchQuery, setSearchQuery] = useState('');

  const currentGroup = groups.find((g) => g.id === currentGroupId) || groups[0];

  const filteredMembers = members.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const selectedCount = members.filter((m) => m.selected).length;
  const allSelected = members.length > 0 && selectedCount === members.length;
  const isPartiallySelected = selectedCount > 0 && selectedCount < members.length;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;
    onAddMember(newMemberName.trim(), newMemberRole);
    setNewMemberName('');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm flex flex-col h-[615px] overflow-hidden">
      {/* Header */}
      <div className="p-4 pb-3 border-b border-slate-100 bg-gradient-to-b from-slate-50/70 to-white">
        <div className="flex items-center gap-2 mb-0.5">
          <div className="p-1 rounded-lg bg-blue-50 text-blue-600">
            <Users className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            누구에게 보낼까요?
          </h2>
        </div>
        <p className="text-[11px] text-slate-500 pl-7">
          메시지를 받을 순원을 선택하거나 추가하세요
        </p>

        {/* Group Selector & Actions */}
        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-600 whitespace-nowrap">
            그룹
          </label>
          <div className="relative flex-1">
            <select
              value={currentGroupId}
              onChange={(e) => onSelectGroup(e.target.value)}
              className="w-full text-xs font-semibold bg-white border border-slate-200 text-slate-800 rounded-lg px-3 py-2 pr-7 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow appearance-none cursor-pointer"
            >
              {groups.map((group) => {
                const count = members.filter((m) => m.groupId === group.id).length;
                return (
                  <option key={group.id} value={group.id}>
                    {group.name} {count > 0 ? `(${count}명)` : ''}
                  </option>
                );
              })}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>

          <button
            type="button"
            onClick={onAddGroup}
            className="px-2.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1 shrink-0"
            title="새 그룹 추가"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">+ 추가</span>
          </button>

          <button
            type="button"
            onClick={onRenameGroup}
            className="p-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors shrink-0"
            title="그룹 이름 변경"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          {groups.length > 1 && (
            <button
              type="button"
              onClick={onDeleteGroup}
              className="p-2 text-xs font-medium text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors shrink-0"
              title="현재 그룹 삭제"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Bulk Import Button */}
        <div className="mt-3">
          <button
            type="button"
            onClick={onOpenBulkImport}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-blue-700 bg-blue-50/90 hover:bg-blue-100/90 active:bg-blue-200/90 border border-blue-200/70 rounded-xl transition-all shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-blue-600" />
            <span>명단 일괄 등록 (엑셀 / 카톡 복붙)</span>
          </button>
        </div>
      </div>

      {/* Selection Control & Search */}
      <div className="px-4 py-2.5 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between gap-3 text-xs">
        <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 select-none">
          <input
            type="checkbox"
            checked={allSelected}
            ref={(el) => {
              if (el) el.indeterminate = isPartiallySelected;
            }}
            onChange={(e) => onToggleAll(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
          />
          <span className="font-semibold text-slate-800">전체 선택</span>
        </label>

        <div className="flex items-center gap-3">
          <span className="font-mono tabular-nums text-xs text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
            ({selectedCount}/{members.length}명 선택됨)
          </span>
        </div>
      </div>

      {/* Member Filter Search */}
      {members.length > 5 && (
        <div className="px-4 py-2 border-b border-slate-100">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="순원 검색..."
              className="w-full text-xs pl-8 pr-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
            />
          </div>
        </div>
      )}

      {/* Scrollable Member List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1">
        {filteredMembers.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <UserPlus className="w-10 h-10 mb-2 stroke-[1.5] text-slate-300" />
            <p className="text-xs font-medium text-slate-600">등록된 순원이 없습니다</p>
            <p className="text-[11px] text-slate-400 mt-1 max-w-[200px]">
              아래에 이름을 입력하거나 상단의 일괄 등록 버튼을 눌러보세요
            </p>
          </div>
        ) : (
          filteredMembers.map((member) => (
            <div
              key={member.id}
              className={`group flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors ${
                member.selected
                  ? 'bg-blue-50/50 hover:bg-blue-50/80 border border-blue-100/60'
                  : 'hover:bg-slate-50 border border-transparent'
              }`}
            >
              <label className="flex items-center gap-2.5 flex-1 min-w-0 cursor-pointer">
                <input
                  type="checkbox"
                  checked={member.selected}
                  onChange={() => onToggleMember(member.id)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer shrink-0"
                />
                <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 text-xs font-bold shrink-0">
                  {member.name.slice(0, 1)}
                </div>
                <div className="min-w-0 flex-1 flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-slate-800 truncate">
                    {member.name}
                  </span>
                  {member.role && (
                    <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded font-normal">
                      {member.role}
                    </span>
                  )}
                </div>
              </label>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => onPreviewMember(member)}
                  className="p-1.5 text-slate-400 hover:text-amber-700 hover:bg-amber-50 rounded-md transition-colors"
                  title={`${member.name}님 카톡 미리보기`}
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteMember(member.id)}
                  className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-md transition-colors"
                  title="삭제"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bottom Direct Add Input */}
      <form
        onSubmit={handleAddSubmit}
        className="p-3 bg-slate-50 border-t border-slate-200/80 flex items-center gap-2"
      >
        <input
          type="text"
          value={newMemberName}
          onChange={(e) => setNewMemberName(e.target.value)}
          placeholder="순원 이름 (예: 김준호)"
          className="flex-1 text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-2xs"
        />
        <select
          value={newMemberRole}
          onChange={(e) => setNewMemberRole(e.target.value)}
          className="text-xs bg-white border border-slate-200 text-slate-700 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="순원">순원</option>
          <option value="순장">순장</option>
          <option value="부순장">부순장</option>
          <option value="집사">집사</option>
          <option value="권사">권사</option>
          <option value="새가족">새가족</option>
        </select>
        <button
          type="submit"
          disabled={!newMemberName.trim()}
          className="px-3 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors whitespace-nowrap shadow-xs shrink-0"
        >
          직접 추가
        </button>
      </form>
    </div>
  );
};
