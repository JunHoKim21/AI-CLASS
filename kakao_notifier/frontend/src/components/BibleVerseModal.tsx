import React, { useState } from 'react';
import { BibleVerse } from '../types.ts';
import { BIBLE_VERSES } from '../data/defaultData.ts';
import { X, BookOpen, Plus, Sparkles, Search } from 'lucide-react';

interface BibleVerseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectVerse: (verse: BibleVerse, mode: 'append' | 'replace') => void;
}

export const BibleVerseModal: React.FC<BibleVerseModalProps> = ({
  isOpen,
  onClose,
  onSelectVerse,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!isOpen) return null;

  const categories = [
    '전체',
    '사랑 & 복음',
    '위로 & 평안',
    '용기 & 힘',
    '믿음 & 승리',
    '축복 & 평강',
    '감사 & 기쁨',
  ];

  const filteredVerses = BIBLE_VERSES.filter((v) => {
    const matchCategory =
      selectedCategory === '전체' || v.category === selectedCategory;
    const matchQuery =
      v.reference.includes(searchQuery) ||
      v.text.includes(searchQuery) ||
      v.category.includes(searchQuery);
    return matchCategory && matchQuery;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-100 flex flex-col max-h-[88vh]">
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-100/80 text-amber-700">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                은혜의 성경 구절 모음
              </h3>
              <p className="text-xs text-slate-500">
                순원들에게 전하고 싶은 위로와 축복의 성경 구절을 선택하세요
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

        {/* Categories Bar */}
        <div className="px-6 py-3 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Verses List */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {filteredVerses.map((verse) => (
            <div
              key={verse.id}
              className="p-4 rounded-2xl border border-slate-200/80 hover:border-blue-300 hover:bg-blue-50/30 transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 font-mono">
                    {verse.reference}
                  </span>
                  <span className="text-[10px] font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
                    {verse.category}
                  </span>
                </div>

                <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => {
                      onSelectVerse(verse, 'append');
                      onClose();
                    }}
                    className="px-2.5 py-1 text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200/60"
                  >
                    본문 뒤에 추가
                  </button>
                  <button
                    onClick={() => {
                      onSelectVerse(verse, 'replace');
                      onClose();
                    }}
                    className="px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    구절만 교체
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed font-sans">
                "{verse.text}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
