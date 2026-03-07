// NookMe Shared Package — Theme Tokens & Types

// ─── Color Palette ──────────────────────────────────────────
export const colors = {
  // Backgrounds
  background: '#0F0F13',
  surface: '#1A1A24',
  surfaceElevated: '#252536',
  surfaceHover: '#2E2E42',

  // Primary
  primary: '#7C5CFC',
  primaryGlow: '#9B7FFF',
  primaryMuted: '#5A3FBF',
  primarySurface: 'rgba(124, 92, 252, 0.12)',

  // Accents
  accentGreen: '#2DD4A8',
  accentGreenSurface: 'rgba(45, 212, 168, 0.12)',
  accentBlue: '#3B82F6',
  accentBlueSurface: 'rgba(59, 130, 246, 0.12)',
  accentOrange: '#F59E0B',
  accentPink: '#EC4899',

  // Text
  textPrimary: '#F0F0F5',
  textSecondary: '#8B8BA3',
  textMuted: '#5C5C73',
  textInverse: '#0F0F13',

  // Borders
  border: '#2A2A3D',
  borderLight: '#353550',
  borderFocus: '#7C5CFC',

  // Status
  online: '#2DD4A8',
  danger: '#EF4444',
  warning: '#F59E0B',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.6)',
  glassBg: 'rgba(26, 26, 36, 0.85)',
} as const;

// ─── Typography ─────────────────────────────────────────────
export const typography = {
  fontFamily: {
    regular: 'Inter_400Regular',
    medium: 'Inter_500Medium',
    semiBold: 'Inter_600SemiBold',
    bold: 'Inter_700Bold',
    system: 'System',
  },
  size: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },
} as const;

// ─── Spacing ────────────────────────────────────────────────
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
} as const;

// ─── Border Radius ──────────────────────────────────────────
export const radius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 999,
} as const;

// ─── Shadows ────────────────────────────────────────────────
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  lg: {
    shadowColor: '#7C5CFC',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: {
    shadowColor: '#7C5CFC',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
} as const;

// ─── Types ──────────────────────────────────────────────────
export type Platform = 'instagram' | 'tiktok' | 'youtube' | 'twitter' | 'web' | 'image';

export interface User {
  id: string;
  displayName: string;
  username: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
}

export interface Reaction {
  emoji: string;
  count: number;
  userIds: string[];
}

export interface ContentCard {
  id: string;
  url: string;
  platform: Platform;
  title: string;
  description?: string;
  thumbnail?: string;
  creator?: string;
  sharedBy: User;
  sharedAt: string;
  reactions: Reaction[];
  threadCount: number;
  tags: string[];
}

export interface Message {
  id: string;
  text: string;
  sender: User;
  sentAt: string;
  replyTo?: string;
  reactions: Reaction[];
}

export interface Nook {
  id: string;
  name: string;
  description?: string;
  members: User[];
  lastActivity: string;
  unreadCount: number;
  contentCount: number;
  avatar?: string;
  isPinned: boolean;
}

// ─── Platform Colors ────────────────────────────────────────
export const platformColors: Record<Platform, string> = {
  instagram: '#E4405F',
  tiktok: '#00F2EA',
  youtube: '#FF0000',
  twitter: '#1DA1F2',
  web: '#8B8BA3',
  image: '#2DD4A8',
};

// ─── Platform Icons ─────────────────────────────────────────
export const platformLabels: Record<Platform, string> = {
  instagram: 'Instagram',
  tiktok: 'TikTok',
  youtube: 'YouTube',
  twitter: 'Twitter/X',
  web: 'Web Link',
  image: 'Image',
};

// ─── Reaction Emoji Set ─────────────────────────────────────
export const reactionEmojis = ['🔥', '😂', '🤯', '❤️', '👀', '💀', '🙌', '💯'] as const;
