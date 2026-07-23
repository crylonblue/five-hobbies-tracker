# 🏅 Pentathlon — a 5-Hobby Tracker

A playful, no-login-required hobby tracker built for **Till & Nicola** around the
[5-hobby framework](#the-framework). Pick your name, log what you do across the
five dimensions of a balanced life, and cheer each other on.

> The goal isn't to maximise productivity — it's to make sure you're developing
> across multiple dimensions instead of letting work consume everything.

## The framework

| Dimension | Purpose | Examples |
|-----------|---------|----------|
| 💰 **Wealth** | Makes you money | Freelancing, coding, investing, photography |
| 💪 **Body** | Keeps you in shape | Gym, running, climbing, swimming, martial arts |
| 🎨 **Craft** | Lets you be creative | Drawing, writing, music, cooking, design |
| 📚 **Mind** | Builds knowledge | Reading, languages, AI, history, courses |
| 🌱 **Soul** | Grows your mindset | Meditation, journaling, volunteering, travel, chess |

## Features

- **Pick-your-name "login"** — no passwords. Choose Till or Nicola; the choice is
  remembered in `localStorage`.
- **Log with a story** — every mark carries a short note of *what you actually did*,
  not just a checkbox.
- **Weekly balance** — see how many of the five dimensions you've touched this week,
  plus a day streak.
- **Head-to-head** — a pentagon radar and a category-by-category scoreboard comparing
  the two of you this week.
- **Live activity feed** — a shared timeline of everything logged.
- **Delightful details** — category-coloured confetti on every log, glassy dark UI,
  micro-interactions, fully responsive with a mobile quick-add button.

## Data & privacy

Everything is stored locally in your browser (`localStorage`) — there's no server and
no account. Because both people's entries share the same store, **use the same device /
browser** to see each other's stats side by side. Clearing site data resets everything.

## Tech

Vite · React 19 · TypeScript · hand-rolled CSS design system · `lucide-react` icons ·
`canvas-confetti`. No backend.

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build to /dist
npm run preview  # preview the production build
```

## Deploy

Zero-config on **Vercel** — it auto-detects Vite (`npm run build` → `dist/`). Push to
GitHub and import, or run `vercel` from the project root.

---

Built with balance in mind. ⚖️
