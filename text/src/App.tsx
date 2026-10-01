import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Group, Member, PhotoAttachment, BibleVerse, MessageTemplate, SendLog } from './types.ts';
import {
  INITIAL_GROUPS,
  INITIAL_MEMBERS,
  INITIAL_MESSAGE,
} from './data/defaultData.ts';
import { formatPersonalizedMessage } from './utils/messageHelper.ts';
import { Header } from './components/Header.tsx';
import { MemberListPanel } from './components/MemberListPanel.tsx';
import { MessageComposePanel } from './components/MessageComposePanel.tsx';
import { SendControlsPanel } from './components/SendControlsPanel.tsx';
import { KakaoPreviewModal } from './components/KakaoPreviewModal.tsx';
import { BulkImportModal } from './components/BulkImportModal.tsx';
import { BibleVerseModal } from './components/BibleVerseModal.tsx';
import { TemplateModal } from './components/TemplateModal.tsx';
import { GuideModal } from './components/GuideModal.tsx';
import { ExportModal } from './components/ExportModal.tsx';
import { Check, AlertCircle } from 'lucide-react';

export default function App() {
  // Groups State
  const [groups, setGroups] = useState<Group[]>(() => {
    const saved = localStorage.getItem('kakao_sender_groups');
    return saved ? JSON.parse(saved) : INITIAL_GROUPS;
  });
  const [currentGroupId, setCurrentGroupId] = useState<string>('g1');

  // Members State
  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem('kakao_sender_members');
    return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
  });

  // Message & Attachment State
  const [message, setMessage] = useState<string>(() => {
    const saved = localStorage.getItem('kakao_sender_message');
    return saved !== null ? saved : INITIAL_MESSAGE;
  });
  const [attachedPhoto, setAttachedPhoto] = useState<PhotoAttachment | null>(null);

  // Transmission Configuration
  const [sendDelay, setSendDelay] = useState<number>(0.5);
  const [expressMode, setExpressMode] = useState<boolean>(true);

  // Sending execution state
  const [isSending, setIsSending] = useState<boolean>(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [currentSendingName, setCurrentSendingName] = useState<string>('');
  const [logs, setLogs] = useState<SendLog[]>([]);
  const cancelSendingRef = useRef<boolean>(false);

  // Modals state
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewMemberId, setPreviewMemberId] = useState<string | undefined>(undefined);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [isVerseModalOpen, setIsVerseModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (text: string) => {
    setToastMessage(text);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('kakao_sender_groups', JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    localStorage.setItem('kakao_sender_members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('kakao_sender_message', message);
  }, [message]);

  // Current group info
  const currentGroup = groups.find((g) => g.id === currentGroupId) || groups[0];
  const currentGroupMembers = members.filter((m) => m.groupId === currentGroupId);
  const selectedMembers = currentGroupMembers.filter((m) => m.selected);

  // Express mode toggles
  const handleToggleExpressMode = () => {
    const nextMode = !expressMode;
    setExpressMode(nextMode);
    if (nextMode) {
      setSendDelay(0.3);
      showToast('⚡ 초고속 쾌속 모드가 활성화되었습니다 (딜레이 0.3초)');
    } else {
      setSendDelay(1.5);
      showToast('🛡️ 안전 전송 모드가 활성화되었습니다 (딜레이 1.5초)');
    }
  };

  // Member Handlers
  const handleToggleMember = (id: string) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, selected: !m.selected } : m))
    );
  };

  const handleToggleAll = (selectAll: boolean) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.groupId === currentGroupId ? { ...m, selected: selectAll } : m
      )
    );
  };

  const handleDeleteMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    showToast('순원이 삭제되었습니다.');
  };

  const handleAddMember = (name: string, role = '순원') => {
    const newMember: Member = {
      id: `m-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      groupId: currentGroupId,
      name,
      role,
      selected: true,
    };
    setMembers((prev) => [...prev, newMember]);
    showToast(`'${name}' 순원이 추가되었습니다.`);
  };

  const handleImportMembers = (
    newMembersData: Omit<Member, 'id' | 'selected'>[],
    targetGroupId: string
  ) => {
    const created: Member[] = newMembersData.map((data, index) => ({
      ...data,
      id: `m-bulk-${Date.now()}-${index}`,
      groupId: targetGroupId,
      selected: true,
    }));
    setMembers((prev) => [...prev, ...created]);
    showToast(`${created.length}명의 순원이 성공적으로 등록되었습니다!`);
  };

  // Group Handlers
  const handleAddGroup = () => {
    const name = window.prompt('새로 만들 순/소그룹 이름을 입력하세요:', '3순');
    if (!name || !name.trim()) return;
    const newGroup: Group = {
      id: `g-${Date.now()}`,
      name: name.trim(),
    };
    setGroups((prev) => [...prev, newGroup]);
    setCurrentGroupId(newGroup.id);
    showToast(`'${newGroup.name}' 그룹이 생성되었습니다.`);
  };

  const handleRenameGroup = () => {
    const newName = window.prompt(
      '그룹의 새 이름을 입력하세요:',
      currentGroup?.name || ''
    );
    if (!newName || !newName.trim()) return;
    setGroups((prev) =>
      prev.map((g) => (g.id === currentGroupId ? { ...g, name: newName.trim() } : g))
    );
    showToast('그룹 이름이 변경되었습니다.');
  };

  const handleDeleteGroup = () => {
    if (groups.length <= 1) {
      alert('최소 1개 이상의 그룹이 있어야 합니다.');
      return;
    }
    if (
      window.confirm(
        `'${currentGroup.name}' 그룹과 속한 순원을 모두 삭제하시겠습니까?`
      )
    ) {
      const remaining = groups.filter((g) => g.id !== currentGroupId);
      setGroups(remaining);
      setMembers((prev) => prev.filter((m) => m.groupId !== currentGroupId));
      setCurrentGroupId(remaining[0].id);
      showToast(`그룹이 삭제되었습니다.`);
    }
  };

  // Preview Handler
  const handlePreviewMember = (member: Member) => {
    setPreviewMemberId(member.id);
    setIsPreviewOpen(true);
  };

  // Scripture & Template Handlers
  const handleSelectVerse = (verse: BibleVerse, mode: 'append' | 'replace') => {
    const formattedVerse = `\n\n[말씀 본문] ${verse.reference}\n"${verse.text}"`;
    if (mode === 'append') {
      setMessage((prev) => prev + formattedVerse);
    } else {
      // Replace existing bible verse section if possible or append
      const regex = /\[말씀 본문\][\s\S]*?(?=\n\n|$)/;
      if (regex.test(message)) {
        setMessage((prev) => prev.replace(regex, `[말씀 본문] ${verse.reference}\n"${verse.text}"`));
      } else {
        setMessage((prev) => prev + formattedVerse);
      }
    }
    showToast(`'${verse.reference}' 구절이 본문에 적용되었습니다.`);
  };

  const handleSelectTemplate = (template: MessageTemplate) => {
    setMessage(template.content);
    showToast(`'${template.title}' 템플릿이 적용되었습니다.`);
  };

  // Send Execution Simulator
  const handleStartSend = async () => {
    if (selectedMembers.length === 0) {
      alert('메시지를 보낼 순원을 1명 이상 선택해주세요.');
      return;
    }
    if (!message.trim()) {
      alert('보낼 말씀 내용을 입력해주세요.');
      return;
    }

    cancelSendingRef.current = false;
    setIsSending(true);
    setProgressPercent(0);

    const total = selectedMembers.length;
    const newLogs: SendLog[] = [];

    for (let i = 0; i < total; i++) {
      if (cancelSendingRef.current) {
        showToast('전송이 중지되었습니다.');
        break;
      }

      const member = selectedMembers[i];
      setCurrentSendingName(member.name);

      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
        now.getMinutes()
      ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

      // Interim sending log
      const pendingLogId = `log-${Date.now()}-${i}`;
      const sendingLog: SendLog = {
        id: pendingLogId,
        timestamp: timeStr,
        memberName: member.name,
        status: 'sending',
        messagePreview: formatPersonalizedMessage(message, member, currentGroup.name).slice(0, 30) + '...',
      };

      setLogs((prev) => [sendingLog, ...prev]);

      // Wait for the delay
      await new Promise((resolve) => setTimeout(resolve, sendDelay * 1000));

      if (cancelSendingRef.current) break;

      // Update to success
      setLogs((prev) =>
        prev.map((l) =>
          l.id === pendingLogId
            ? {
                ...l,
                status: 'success',
                detail: attachedPhoto ? '사진 + 텍스트 완료' : '텍스트 완료',
              }
            : l
        )
      );

      const currentProgress = Math.round(((i + 1) / total) * 100);
      setProgressPercent(currentProgress);
    }

    if (!cancelSendingRef.current) {
      setIsSending(false);
      setProgressPercent(100);
      setCurrentSendingName('');
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3B82F6', '#FEE500', '#10B981', '#EC4899'],
      });
      showToast(`🎉 총 ${total}명의 순원에게 1:1 발송이 완료되었습니다!`);
    } else {
      setIsSending(false);
    }
  };

  const handleStopSend = () => {
    cancelSendingRef.current = true;
    setIsSending(false);
  };

  const handleClearLogs = () => {
    setLogs([]);
    setProgressPercent(0);
    showToast('전송 로그가 초기화되었습니다.');
  };

  // Bulk copy all personalized texts
  const handleCopyAllMessages = () => {
    if (selectedMembers.length === 0) return;
    const allTexts = selectedMembers
      .map((member, i) => {
        const text = formatPersonalizedMessage(message, member, currentGroup.name);
        return `==============================\n[${i + 1}] ${member.name} (${member.role || '순원'})\n==============================\n${text}`;
      })
      .join('\n\n');

    navigator.clipboard.writeText(allTexts);
    showToast(`선택된 ${selectedMembers.length}명의 맞춤 메시지가 복사되었습니다!`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl border border-slate-700/80 flex items-center gap-2.5 animate-in slide-in-from-bottom-3 duration-200">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <Header
        expressMode={expressMode}
        onToggleExpressMode={handleToggleExpressMode}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenTemplates={() => setIsTemplateModalOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        totalMembersCount={currentGroupMembers.length}
        selectedCount={selectedMembers.length}
        currentGroupName={currentGroup?.name || '1순'}
      />

      {/* Main App Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
        {/* Two-Column Grid matching the user's software workflow */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Panel: Recipients List (5 cols on wide screens) */}
          <section className="lg:col-span-5 w-full">
            <MemberListPanel
              groups={groups}
              currentGroupId={currentGroupId}
              onSelectGroup={setCurrentGroupId}
              onAddGroup={handleAddGroup}
              onDeleteGroup={handleDeleteGroup}
              onRenameGroup={handleRenameGroup}
              members={currentGroupMembers}
              onToggleMember={handleToggleMember}
              onToggleAll={handleToggleAll}
              onDeleteMember={handleDeleteMember}
              onAddMember={handleAddMember}
              onOpenBulkImport={() => setIsBulkImportOpen(true)}
              onPreviewMember={handlePreviewMember}
            />
          </section>

          {/* Right Panel: Message Compose & Send Controls (7 cols on wide screens) */}
          <section className="lg:col-span-7 w-full space-y-5">
            <MessageComposePanel
              message={message}
              onChangeMessage={setMessage}
              attachedPhoto={attachedPhoto}
              onAttachPhoto={setAttachedPhoto}
              onOpenVersePicker={() => setIsVerseModalOpen(true)}
              onOpenTemplates={() => setIsTemplateModalOpen(true)}
              onOpenPreview={() => {
                setPreviewMemberId(selectedMembers[0]?.id || currentGroupMembers[0]?.id);
                setIsPreviewOpen(true);
              }}
            />

            {/* Bottom Controls & Realtime Progress Console */}
            <SendControlsPanel
              selectedCount={selectedMembers.length}
              sendDelay={sendDelay}
              onChangeSendDelay={setSendDelay}
              isSending={isSending}
              onStartSend={handleStartSend}
              onStopSend={handleStopSend}
              progressPercent={progressPercent}
              currentSendingName={currentSendingName}
              logs={logs}
              onClearLogs={handleClearLogs}
              onCopyAllMessages={handleCopyAllMessages}
            />
          </section>
        </div>
      </main>

      {/* Interactive Modals */}
      <KakaoPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        messageTemplate={message}
        members={currentGroupMembers.length > 0 ? currentGroupMembers : INITIAL_MEMBERS}
        groupName={currentGroup?.name || '1순'}
        attachedPhoto={attachedPhoto}
        initialMemberId={previewMemberId}
      />

      <BulkImportModal
        isOpen={isBulkImportOpen}
        onClose={() => setIsBulkImportOpen(false)}
        groups={groups}
        currentGroupId={currentGroupId}
        onImportMembers={handleImportMembers}
      />

      <BibleVerseModal
        isOpen={isVerseModalOpen}
        onClose={() => setIsVerseModalOpen(false)}
        onSelectVerse={handleSelectVerse}
      />

      <TemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSelectTemplate={handleSelectTemplate}
      />

      <GuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />
    </div>
  );
}
