# NookMe

### Product Requirements Document (PRD)

Version: v0.2
Product: **NookMe**
Domain: **nookme.xyz**
Category: Consumer Social / Communication Layer

---

# 1. Product Overview

NookMe is a **content-native communication platform** designed for people who share large volumes of online content with friends.

Instead of burying shared links inside endless chat streams, NookMe turns every shared item into a **structured conversation object with its own thread and memory**.

The product creates **private content spaces (“Nooks”)** where friends or small groups can share, discuss, and revisit internet culture together.

Over time these shared objects accumulate into a **collective archive of shared taste, ideas, and culture**.

NookMe enables:

* Structured conversations around shared content
* Persistent shared memory
* Private incubation of cultural artifacts
* Optional public publishing of meaningful threads

---

# 2. Problem Statement

People share massive amounts of internet content daily:

* Instagram Reels
* TikTok videos
* YouTube clips
* Tweets
* Articles
* Memes

However existing messaging apps treat these as **regular messages**, causing several issues.

---

## 2.1 Content Gets Lost

Chat apps are chronological streams.

Once messages accumulate, shared content becomes impossible to find.

Example:

Friend sends 100 reels.
User wants to revisit reel #12.
Scroll history makes retrieval extremely difficult.

---

## 2.2 Conversations Lose Context

Discussion about a shared video mixes with unrelated chat.

Example:

```
reel
random chat
another meme
discussion
work message
another reel
```

The original discussion loses context.

---

## 2.3 No Shared Memory

Messaging apps optimize **flow**, not **memory**.

Years of shared content disappear into chat history.

Users cannot easily rediscover:

* favorite memes
* shared inspirations
* recurring interests
* inside jokes

---

## 2.4 Culture Begins Privately but Platforms Are Public-First

Many memes, ideas, and conversations start inside small friend groups.

Current platforms lack a system for:

**Private incubation → Public cultural expression**

---

# 3. Vision

Create the **content messaging layer of the internet**.

Where:

* shared links become structured objects
* conversations stay contextual
* content accumulates into shared memory
* private discussions can evolve into public culture

NookMe becomes the **space where shared internet culture lives between people**.

---

# 4. Target Users

## Primary Users (Initial Wedge)

Friends who share large volumes of online content daily.

Typical behavior:

* 50–200 shared reels per day
* meme exchanges
* social commentary
* viral content discussion

These users experience the highest pain with existing messaging tools.

---

## Secondary Users (Expansion)

Couples
Crypto alpha groups
Startup cofounders
Study groups
Book clubs
Creator communities

These groups benefit from structured discussion around shared content.

---

# 5. Core Product Concept

The central product concept is a **Nook**.

A Nook is a **private shared content space** between:

* two people
* small groups

Within a Nook, users share content objects that accumulate into a shared feed.

---

# 6. Atomic Unit: Shared Object

Every shared item becomes a **content object card**.

Supported sources initially:

* Instagram
* TikTok
* YouTube
* Twitter/X
* web links
* images

Each object includes:

* preview
* source metadata
* timestamp
* discussion thread
* reactions
* tags

---

# 7. Core Product Flow

## Step 1: Share Content

User shares a link using:

* share extension
* copy/paste
* in-app link input

Example:

User copies Instagram Reel link.

---

## Step 2: Object Generation

NookMe converts the link into a **structured content card**.

Card includes:

* preview thumbnail
* title
* creator
* source platform
* timestamp

---

## Step 3: Dedicated Thread

Each content object automatically creates a **threaded conversation**.

All discussion about that content happens within that thread.

This keeps conversations contextual and organized.

---

## Step 4: Shared Feed

Objects accumulate into a **shared feed inside the Nook**.

Users can browse:

* latest content
* most reacted
* tagged topics

This feed becomes a **shared memory timeline**.

---

# 8. Key Features (MVP)

## Content Cards

Structured display of shared links.

Includes preview, metadata, and reactions.

---

## Threaded Conversations

Each shared object has its own conversation thread.

Benefits:

* contextual discussions
* no chat pollution
* replayable conversations

---

## Shared Feed

A feed of all shared content within a Nook.

Users can scroll through shared objects instead of chat messages.

---

## Reactions

Users react to content objects with quick reactions.

Examples:

🔥
😂
🤯
❤️

Reactions highlight meaningful content.

---

## Search

Users can search shared objects by:

* keyword
* platform
* tag
* date

---

## Tags

Users can tag shared objects.

Examples:

memes
travel
startup
ideas

Tags help organize shared culture.

---

# 9. Private → Public Publishing

NookMe allows meaningful threads to become public posts.

Triggers may include:

* high reactions
* large discussion threads
* repeated revisits

Users can convert:

**Private thread → Public cultural post**

This supports the model:

**Private incubation → Public expression**

---

# 10. Future Features

## AI Insights

AI analyzes shared objects to detect patterns.

Examples:

“You both share a lot of travel content.”

“Startup content appears frequently in your Nook.”

---

## Shared Memory Timeline

Visual timeline of shared content history.

Users can revisit earlier moments of shared discovery.

---

## Taste Graph

Graph of shared interests across objects.

Shows clusters of themes.

---

## Cultural Drops

AI-generated collections such as:

* meme compilations
* highlight reels
* themed collections

Based on shared content.

---

# 11. Metrics of Success

## Shared Objects per Nook

Average number of objects shared weekly.

Target: **50+ per active Nook**

---

## Thread Depth

Average comments per object.

Measures conversational engagement.

---

## Revisit Rate

Percentage of objects reopened after initial share.

Indicates memory value.

---

## Pair Retention

30-day retention for active Nooks.

Target: **>40%**

---

## Public Conversion Rate

Percentage of private threads converted into public posts.

Measures cultural incubation.

---

# 12. Distribution Strategy

Initial growth strategy:

Target high-sharing friend groups.

Distribution channels:

* TikTok / Instagram meme communities
* group invite flows
* referral onboarding
* share extension integration

Users can view threads via web before installing the app.

This reduces onboarding friction.

---

# 13. Competitive Landscape

Existing platforms:

WhatsApp
Instagram DMs
Telegram
Discord
Slack

These are **message-first communication systems**.

NookMe is **content-first communication**.

| Platform | Atomic Unit           |
| -------- | --------------------- |
| WhatsApp | Message               |
| Telegram | Message               |
| Slack    | Channel               |
| NookMe   | Shared Content Object |

---

# 14. Long-Term Vision

NookMe becomes the **infrastructure layer where shared internet culture accumulates**.

Instead of disappearing in chat scrolls, shared content forms structured cultural memory.

Over time this enables:

* shared identity formation
* cultural incubation
* discovery of meaningful conversations
* structured social knowledge graphs

---

# 15. MVP Scope

Initial release includes:

* link sharing
* content cards
* threaded discussion
* shared Nooks
* reactions
* search

Excluded initially:

* AI insights
* public feeds
* discovery algorithms
* advanced analytics

Focus: **structured sharing between small groups**.

