# Kids Reward App — Project Plan

## Concept
A fun, colorful reward system for children. Parents assign tasks, kids complete them for stars, stars unlock rewards.

## Core Features

### Parent Mode (PIN protected)
- Add/edit/delete tasks with star values
- Add/edit/delete rewards with star costs
- View task completion history
- Approve pending completions
- Manage child profiles

### Kid Mode
- See available tasks with star values
- Mark tasks as "done" (pending parent approval)
- View star balance
- Browse & redeem rewards
- Fun animations & sounds on achievements

## Tech Stack
- **Frontend**: Next.js 14 (App Router)
- **Database**: Supabase (auth + Postgres)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Deployment**: Vercel
- **PWA**: next-pwa for installable app

## Database Schema

### families
- id (uuid, pk)
- name (text)
- parent_pin (text, hashed)
- created_at (timestamp)

### children
- id (uuid, pk)
- family_id (uuid, fk)
- name (text)
- avatar (text) — emoji or color
- stars (int, default 0)
- created_at (timestamp)

### tasks
- id (uuid, pk)
- family_id (uuid, fk)
- title (text)
- description (text, nullable)
- stars (int)
- icon (text) — emoji
- is_active (bool, default true)
- created_at (timestamp)

### completions
- id (uuid, pk)
- task_id (uuid, fk)
- child_id (uuid, fk)
- status (enum: pending, approved, rejected)
- completed_at (timestamp)
- approved_at (timestamp, nullable)

### rewards
- id (uuid, pk)
- family_id (uuid, fk)
- title (text)
- description (text, nullable)
- star_cost (int)
- icon (text) — emoji
- is_active (bool, default true)
- created_at (timestamp)

### redemptions
- id (uuid, pk)
- reward_id (uuid, fk)
- child_id (uuid, fk)
- redeemed_at (timestamp)

## UI/UX Design

### Color Palette
- Primary: Bright purple (#8B5CF6)
- Secondary: Warm yellow (#FCD34D)
- Success: Green (#10B981)
- Background: Soft cream (#FEF3C7)
- Cards: White with rounded corners + shadows

### Typography
- Headers: Rounded, playful font
- Body: Clean, readable

### Animations
- Stars burst on task completion
- Confetti on reward redemption
- Bouncy buttons
- Smooth page transitions

## Screens

1. **Welcome** — Family setup or login
2. **Child Select** — Pick which kid is using the app
3. **Kid Dashboard** — Tasks, star balance, quick actions
4. **Task List** — All available tasks
5. **Rewards Shop** — Browse & redeem rewards
6. **Parent Dashboard** — Approve completions, manage everything
7. **Settings** — Edit family, kids, PIN

## MVP Scope (v1)
- Single family (no auth, just PIN)
- Basic CRUD for tasks/rewards
- Star tracking
- Approval workflow
- Mobile-first responsive design
- PWA installable

## Future Ideas (v2+)
- Multiple families with auth
- Push notifications
- Streak bonuses
- Achievement badges
- Leaderboard (for siblings)
- Recurring tasks
- Sound effects

## Timeline
1. **Setup** — Repo, Supabase, Next.js scaffold (30 min)
2. **Database** — Schema + seed data (20 min)
3. **Core UI** — Layout, navigation, themes (30 min)
4. **Kid Features** — Task list, completions, rewards (1 hr)
5. **Parent Features** — Dashboard, approvals, CRUD (1 hr)
6. **Polish** — Animations, PWA, responsive (30 min)
7. **Deploy** — Vercel + live link (10 min)

---

*Created: 2026-01-31*
*Status: Planning*
