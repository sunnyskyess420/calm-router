# Calm Router — Mood-to-Skill Coping Companion

A 30-second check-in app that matches your current mood to the right coping skill from the [Coping Skills Menu](https://i.imgur.com/placeholder.png). Built with Next.js 16, TypeScript, Tailwind CSS, and shadcn/ui.

## Features

- **6 mood options** — Overwhelmed, Anxious, Scattered, Exhausted, Low/Sad, Fine
- **Smart routing** — Matches mood to the right tier (Emergency Reset, Quick Starters, etc.)
- **Interactive exercises** — Box Breathing with animated circle, 5-4-3-2-1 sensory grounding
- **Star ratings** — Rate how you feel after each skill (1-5)
- **"Skills that worked for you"** — Auto-generated top-3 per mood based on your history
- **Insights dashboard** — Top Skills, Mood Map, and History tabs
- **No database needed** — All data stored in your browser's localStorage

## Deploy to Vercel (Free, 2 minutes)

### Prerequisites
- A [GitHub](https://github.com) account
- A [Vercel](https://vercel.com) account (free, sign in with GitHub)

### Steps

1. **Push this code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Calm Router"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/calm-router.git
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import" on your `calm-router` repo
   - Click "Deploy" — that's it!
   - Vercel auto-detects Next.js and configures everything

3. **You're live!** 🎉
   - Vercel gives you a URL like `calm-router.vercel.app`
   - Every `git push` auto-deploys

## Run Locally

```bash
# Clone your repo
git clone https://github.com/YOUR_USERNAME/calm-router.git
cd calm-router

# Install dependencies
npm install

# Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- **Next.js 16** with App Router
- **TypeScript**
- **Tailwind CSS 4**
- **shadcn/ui** components
- **Framer Motion** for animations
- **Zustand** for state management (persisted to localStorage)

## Project Structure

```
calm-router/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with metadata
│   │   ├── page.tsx            # Main app (all views)
│   │   └── globals.css         # Global styles
│   ├── components/ui/          # shadcn/ui components
│   └── lib/
│       ├── skills-data.ts     # All 25 coping skills
│       ├── store.ts            # Zustand store (localStorage)
│       └── utils.ts            # Utility functions
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
├── postcss.config.mjs
└── README.md
```

## Based On

The [Coping Skills Menu](https://i.imgur.com/placeholder.png) — 25 skills organized into 5 tiers:

| Tier | Purpose |
|------|---------|
| Quick Starters | 5-minute calming tools |
| Main Regulation | Deep coping strategies |
| Emergency Reset | Panic / overwhelm |
| Comfort Picks | Gentle self-soothing |
| Daily Maintenance | Preventive habits |
