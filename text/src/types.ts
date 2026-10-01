export interface Group {
  id: string;
  name: string;
}

export interface Member {
  id: string;
  groupId: string;
  name: string;
  role?: string;
  phone?: string;
  note?: string;
  selected: boolean;
}

export interface PhotoAttachment {
  id: string;
  name: string;
  url: string;
  size?: string;
  isPreset?: boolean;
}

export interface BibleVerse {
  id: string;
  reference: string;
  text: string;
  category: string;
}

export interface MessageTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  content: string;
}

export interface SendLog {
  id: string;
  timestamp: string;
  memberName: string;
  status: 'pending' | 'sending' | 'success' | 'failed';
  messagePreview: string;
  detail?: string;
}
