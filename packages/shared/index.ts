// NookMe Shared Package — Apple-Style Light Theme Tokens & Types

// ─── Color Palette (Apple / iOS Inspired) ───────────────────
export const colors = {
  // Backgrounds
  background: '#FFFFFF',
  surface: '#F5F5F7',
  surfaceElevated: '#FFFFFF',
  surfaceHover: '#F0F0F2',

  // Primary (iOS Blue)
  primary: '#007AFF',
  primaryLight: '#409CFF',
  primaryMuted: '#005EC4',
  primarySurface: 'rgba(0, 122, 255, 0.08)',

  // Accents (iOS System Colors)
  accentGreen: '#34C759',
  accentGreenSurface: 'rgba(52, 199, 89, 0.08)',
  accentBlue: '#5856D6',
  accentBlueSurface: 'rgba(88, 86, 214, 0.08)',
  accentOrange: '#FF9500',
  accentOrangeSurface: 'rgba(255, 149, 0, 0.08)',
  accentPink: '#FF2D55',
  accentTeal: '#5AC8FA',
  accentIndigo: '#5856D6',

  // Text
  textPrimary: '#1D1D1F',
  textSecondary: '#86868B',
  textMuted: '#AEAEB2',
  textInverse: '#FFFFFF',

  // Borders
  border: '#E5E5EA',
  borderLight: '#F2F2F7',
  borderFocus: '#007AFF',

  // Status
  online: '#34C759',
  danger: '#FF3B30',
  warning: '#FF9500',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.3)',
  glassBg: 'rgba(255, 255, 255, 0.85)',
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
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
} as const;

// ─── Shadows (Apple-style soft shadows) ─────────────────────
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 6,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
} as const;

// ─── Types ──────────────────────────────────────────────────
export type Platform = 'instagram' | 'tiktok' | 'youtube' | 'twitter' | 'web' | 'image';

export interface User {
  id: string;
  displayName: string;
  username: string;
  avatarColor: string;
  initials: string;
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
  iconName: string;
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
  iconName: string;
  color: string;
  isPinned: boolean;
}

// ─── Platform Colors ────────────────────────────────────────
export const platformColors: Record<Platform, string> = {
  instagram: '#E4405F',
  tiktok: '#000000',
  youtube: '#FF0000',
  twitter: '#1DA1F2',
  web: '#86868B',
  image: '#34C759',
};

// ─── Platform Icon Names (Ionicons) ─────────────────────────
export const platformIcons: Record<Platform, string> = {
  instagram: 'logo-instagram',
  tiktok: 'musical-notes',
  youtube: 'logo-youtube',
  twitter: 'logo-twitter',
  web: 'globe-outline',
  image: 'image-outline',
};

// ─── Platform Labels ────────────────────────────────────────
export const platformLabels: Record<Platform, string> = {
  instagram: 'Instagram',
  tiktok: 'TikTok',
  youtube: 'YouTube',
  twitter: 'Twitter/X',
  web: 'Web Link',
  image: 'Image',
};

// ─── Nook Colors (for avatar backgrounds) ───────────────────
export const nookColors = [
  '#007AFF', '#34C759', '#FF9500', '#FF2D55',
  '#5856D6', '#5AC8FA', '#AF52DE', '#FF3B30',
] as const;
