import { Member, Group } from '../types.ts';

/**
 * Replace dynamic placeholders in text for a specific member
 */
export function formatPersonalizedMessage(
  template: string,
  member: Member,
  groupName: string
): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const date = now.getDate();
  const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  const dayName = days[now.getDay()];

  const dateStr = `${year}년 ${month}월 ${date}일`;
  const roleStr = member.role || '순원';

  return template
    .replace(/\{이름\}/g, member.name)
    .replace(/\{순명\}/g, groupName)
    .replace(/\{직분\}/g, roleStr)
    .replace(/\{오늘날짜\}/g, dateStr)
    .replace(/\{요일\}/g, dayName);
}

/**
 * Parse bulk input string from Excel or KakaoTalk chat list
 */
export function parseBulkMembersInput(
  rawInput: string,
  targetGroupId: string
): Omit<Member, 'id' | 'selected'>[] {
  const lines = rawInput.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const results: Omit<Member, 'id' | 'selected'>[] = [];

  for (const line of lines) {
    // Check if line contains tab (Excel copy) or commas
    if (line.includes('\t')) {
      const parts = line.split('\t').map(p => p.trim());
      const name = parts[0];
      if (name) {
        results.push({
          groupId: targetGroupId,
          name,
          role: parts[1] || '순원',
          phone: parts[2] || '',
          note: parts[3] || '',
        });
      }
    } else if (line.includes(',')) {
      // Comma-separated list in a single line
      const names = line.split(',').map(n => n.trim()).filter(Boolean);
      for (const name of names) {
        // Clean out possible prefixes like numbering (e.g. "1. 김준호" -> "김준호")
        const cleanName = name.replace(/^\d+[\.\)\-\s]+/, '').trim();
        if (cleanName) {
          results.push({
            groupId: targetGroupId,
            name: cleanName,
            role: '순원',
          });
        }
      }
    } else {
      // Single line per member
      const cleanName = line.replace(/^\d+[\.\)\-\s]+/, '').trim();
      if (cleanName) {
        results.push({
          groupId: targetGroupId,
          name: cleanName,
          role: '순원',
        });
      }
    }
  }

  return results;
}
