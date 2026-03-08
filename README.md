# NookMe

**Your shared content space.** NookMe turns every shared link into a structured content card with its own threaded conversation. Stop losing great content in endless chat scrolls.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](#license)
[![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android%20%7C%20Web-lightgrey)](#tech-stack)

---

## 🎯 What is NookMe?

NookMe is a **content-native communication platform** designed for people who share large volumes of online content with friends.

Instead of burying shared links inside endless chat streams, NookMe turns every shared item into a **structured conversation object with its own thread and memory**.

### The Problem

| What Happens | Why It's Broken |
|---|---|
| Content gets lost | Shared links buried under hundreds of messages |
| Conversations lose context | Replies fragment across unrelated chats |
| No shared memory | Years of curated taste disappear into chat history |
| Re-sharing is awkward | Same link = re-explaining context every time |

### The Solution

NookMe creates **private content spaces ("Nooks")** where friends or small groups can share, discuss, and revisit internet culture together. Every shared link becomes a rich content card. Every card gets its own threaded discussion.

---

## ✨ Features

| Feature | Description |
|---|---|
| **Nooks** | Private content spaces for your inner circle |
| **Content Cards** | Every link → rich, structured card with platform detection |
| **Threaded Discussions** | Dedicated thread per content card, context never lost |
| **Rich Reactions** | Emoji reactions on cards and messages |
| **Multi-Platform** | Instagram, YouTube, X, TikTok, any URL |
| **Search & Tags** | Find anything instantly, tag for categorization |
| **Waitlist** | Landing page with Supabase-powered email capture |

---

## 🏗 Architecture

```
nookme/
├── apps/
│   ├── mobile/          # React Native (Expo SDK 54)
│   │   ├── app/         # Expo Router (file-based routing)
│   │   ├── stores/      # Zustand state management
│   │   ├── lib/         # Supabase client
│   │   └── data/        # Mock data (being replaced)
│   └── website/         # Next.js 15 landing page
│       └── app/         # App Router
├── packages/
│   └── shared/          # Shared design tokens & types
├── supabase/
│   └── schema.sql       # Database schema + RLS policies
└── PRD.md               # Product Requirements Document
```

---

## 🛠 Tech Stack

### Mobile App
- **Framework**: [Expo](https://expo.dev) SDK 54 with React Native 0.81
- **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/) v6 (file-based routing)
- **State**: [Zustand](https://zustand-demo.pmnd.rs/) for global state management
- **Auth**: [Supabase Auth](https://supabase.com/docs/guides/auth) with AsyncStorage persistence
- **UI**: Custom Apple-style white theme with shared design tokens

### Landing Page
- **Framework**: [Next.js](https://nextjs.org) 15 with App Router
- **Font**: [Inter](https://fonts.google.com/specimen/Inter) via `next/font/google`
- **Styling**: Vanilla CSS with CSS custom properties
- **Animations**: IntersectionObserver scroll-reveal

### Backend
- **Database**: [Supabase](https://supabase.com) (PostgreSQL)
- **Auth**: Supabase Auth (email/password, OAuth ready)
- **Security**: Row Level Security (RLS) on all tables

### Database Schema

| Table | Description |
|---|---|
| `profiles` | User profiles linked to Supabase Auth |
| `nooks` | Private content spaces |
| `nook_members` | Membership with roles (owner/admin/member) |
| `content_cards` | Shared links with platform detection |
| `messages` | Threaded messages per content card |
| `reactions` | Emoji reactions per card per user |
| `waitlist` | Landing page email waitlist |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Supabase](https://supabase.com) project (free tier works)
- Xcode (for iOS simulator) or Android Studio (for Android emulator)

### 1. Clone & Install

```bash
git clone https://github.com/your-username/nookme.git
cd nookme
```

**Mobile app:**
```bash
cd apps/mobile
yarn install --cache-folder /tmp/yarn-cache
```

**Website:**
```bash
cd apps/website
bun install  # or yarn/npm
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run `supabase/schema.sql`
3. Update the Supabase URL and anon key in `apps/mobile/lib/supabase.ts`

### 3. Run

**Mobile (Expo):**
```bash
cd apps/mobile
npx expo start --clear
```
Press `i` for iOS simulator or `a` for Android emulator.

**Website:**
```bash
cd apps/website
bun run dev
```
Open [http://localhost:3000](http://localhost:3000).

---

## 📱 App Screens

| Screen | Description |
|---|---|
| **Onboarding** | 3-slide intro (Share, Threaded, Memory) |
| **Login / Sign Up** | Email/password auth via Supabase |
| **Home (Nooks)** | List of content spaces with unread badges |
| **Nook Detail** | Feed of content cards + share modal |
| **Thread** | Threaded discussion per content card |
| **Search** | Global search with recents & trending |
| **Profile** | Stats, activity, settings, sign out |

---

## 🗺 Roadmap

### ✅ Phase 1 — Landing Page (Complete)
- [x] Next.js 15 landing page with Apple-style design
- [x] 7 sections: Nav, Hero, Problem, Features, How It Works, Waitlist, Footer
- [x] Real platform logos (Instagram, YouTube, 𝕏, TikTok)
- [x] Scroll-reveal animations
- [x] Waitlist form → Supabase

### ✅ Phase 2 — Supabase Integration (Complete)
- [x] Full database schema with RLS
- [x] Supabase Auth (sign up, sign in, sign out)
- [x] Zustand auth store with session persistence
- [x] Auth-gated routing

### 🚧 Phase 3 — Mobile Polish (Next)
- [ ] Replace mock data with Supabase queries
- [ ] App icon & splash screen
- [ ] Pull-to-refresh on feeds
- [ ] Haptic feedback
- [ ] Deep linking
- [ ] Push notifications

### 🔮 Future
- [ ] AI-powered content insights
- [ ] Shared memory timeline
- [ ] Taste graph visualization
- [ ] Private → public thread publishing
- [ ] Share extension (iOS/Android)

---

## 🎨 Design System

NookMe uses an **Apple-style white theme** with a consistent design token system shared between mobile and web.

| Token | Value |
|---|---|
| Primary | `#007AFF` |
| Background | `#FFFFFF` |
| Surface | `#F5F5F7` |
| Text Primary | `#1D1D1F` |
| Text Secondary | `#86868B` |
| Border | `#E5E5EA` |
| Green | `#34C759` |
| Orange | `#FF9500` |
| Pink | `#FF2D55` |
| Purple | `#5856D6` |

---

## 📄 License

MIT © 2026 NookMe

---

<p align="center">
  <strong>NookMe</strong> — Where shared content finds its home.
</p>
