# ⏱️ Study Stopwatch

A focused study timer that makes every minute count. Track sessions with a slick chrome stopwatch, run Pomodoro cycles, set daily goals, and watch your progress build up across the week — all synced to the cloud so your data follows you everywhere.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38BDF8?logo=tailwindcss&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Auth%20%2B%20Firestore-FFCA28?logo=firebase&logoColor=black)

## ✨ Features

- **Stopwatch & Pomodoro** — count up freely or run focused 25/5 work–break cycles with optional auto-loop.
- **Chrome digital stopwatch** — a hand-built device UI with a cyan seven-segment LCD, tick dial, and working side pushers.
- **Fullscreen focus mode** — distraction-free giant readout with a soft glowing panel.
- **Daily goals** — pick a target (1–12h), tracked live with a progress ring.
- **Insights** — a Sunday–Saturday weekly bar chart and a per-subject time breakdown.
- **Sessions** — save each study block with a name and subject, and review your history.
- **Streaks** — keep your day-over-day study streak alive.
- **Accounts & sync** — email/password or Google sign-in, with data saved per user in Firestore.
- **Light / dark theme** and a fully responsive layout.

## 🛠️ Tech Stack

- **React 18** + **Vite 6**
- **Tailwind CSS v4** with a custom oklch theme
- **Firebase** Authentication + Cloud Firestore
- **Framer Motion** for animation
- **lucide-react** + custom SVG logo icons

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A Firebase project with **Authentication** (Email/Password + Google) and **Cloud Firestore** enabled

### Installation

```bash
git clone https://github.com/iamrishavgupta/study-timer.git
cd study-timer
npm install
```

### Configure Firebase

Update the config in `src/firebase.js` with your own Firebase web app credentials:

```js
const firebaseConfig = {
  apiKey: "…",
  authDomain: "…",
  projectId: "…",
  storageBucket: "…",
  messagingSenderId: "…",
  appId: "…",
};
```

In the Firebase console:
1. **Authentication → Sign-in method** — enable **Email/Password** and **Google**.
2. **Authentication → Settings → Authorized domains** — add `localhost` and your deployed domain.
3. **Firestore** — create the database and lock the rules down to authenticated users.

### Run

```bash
npm run dev      # start the dev server
npm run build    # production build
npm run preview  # preview the build locally
```

## 🔤 Brand Font

The header uses the **Redtown** font from `public/fonts/Redtown-Regular.otf`. If the file is missing, it gracefully falls back to a similar slab serif. Swap in your own font by replacing the file and updating the `@font-face` rule in `src/index.css`.

## ☁️ Deployment (Vercel)

1. Push the repo to GitHub.
2. Import it at [vercel.com](https://vercel.com) — the **Vite** preset is auto-detected (Build: `npm run build`, Output: `dist`).
3. Deploy, then add your `*.vercel.app` domain to Firebase **Authorized domains** so sign-in works.

An `vercel.json` rewrite is already included so the SPA serves correctly on every route.

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                  # Button, Card, Input, Label
│   ├── StopwatchDevice.jsx  # the chrome stopwatch
│   ├── SevenSegmentDisplay.jsx
│   ├── WeeklyChart.jsx
│   ├── SubjectBreakdown.jsx
│   ├── GoalRing.jsx
│   └── Icons.jsx            # custom colored logo icons
├── lib/
│   ├── stats.js             # analytics helpers
│   └── utils.js
├── App.jsx                  # main app
├── AuthContext.jsx          # auth provider
├── Login.jsx                # auth screen
└── firebase.js              # Firebase init
```

## 📄 License

Released under the MIT License. The bundled Redtown font is subject to its own license — verify usage rights before commercial deployment.

---

Made with ❤️ by [Rishav](https://github.com/iamrishavgupta)
