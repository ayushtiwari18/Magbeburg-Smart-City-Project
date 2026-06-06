# 🏙️ Magdeburg Smart City Dashboard

> A modern, data-driven web dashboard for the city of **Magdeburg**, built for the **Smart City Magdeburg 2026** initiative. Explore live city data across transport, climate, economy, housing, safety, and more — all in one place.

---

## 🌐 Live Demo

> **Deployed on Vercel:** [magdeburg-smart-city.vercel.app](https://magdeburg-smart-city.vercel.app)

---

## 📸 Preview

| Home | Insights | Housing |
|------|----------|---------|
| Animated hero + city stats | Revenue charts & animated ring | Rent map & district donut |

---

## ✨ Features

### 🗂️ Pages & Modules

| Route | Description |
|---|---|
| `/` | Home — animated hero, city snapshot strip, feature grid, welcome toaster |
| `/safety` | Public safety stats — crime trends, incident heatmaps |
| `/transportation` | MVB transit data — ridership, routes, vehicle fleet |
| `/climate` | Weather & environmental data — monthly trends, land use |
| `/economy` | Business & industry data — IHK companies, manufacturing |
| `/housing` | Rental market — avg net cold rent by district, donut chart |
| `/ai-streetlights` | AI-driven streetlight simulation dashboard |
| `/projects` | Smart city initiative projects listing |
| `/insights` | Tax revenue 2010–2025 — animated charts, ring chart, ticker tape |
| `/events` | City events calendar |

### 🎨 UI & UX Highlights

- **Animated Welcome Toaster** — slides up on first visit per session, with shimmer headline, city skyline SVG, tag pills, and a live countdown progress bar
- **Inline SVG Logo** — custom city skyline badge + MAGDEBURG wordmark, no image file dependency
- **Dark / Light Mode** — full theme toggle, persisted via context
- **DE / EN Language Toggle** — bilingual navigation and content
- **Sticky Navbar** — responsive desktop + mobile hamburger menu
- **Page Transitions** — smooth animated route changes
- **Skeleton Loaders** — graceful loading states on all data-heavy pages

### 📊 Data Visualisations

- **Insights Page** — stacked bar chart (2010–2025), animated SVG ring/donut chart, radial gauge (YoY growth), scrolling live ticker tape, floating revenue icons (coin, banknote, bar chart), coin rain canvas animation
- **Housing Page** — animated SVG donut (district rent categories), compact top-10 ranked list with mini progress bars
- **Transportation, Climate, Safety** — trend charts, sparklines, data tables

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 15](https://nextjs.org/) (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Icons | [Lucide React](https://lucide.dev/) |
| Fonts | Geist Sans + Geist Mono (Google Fonts) |
| Data Source | [SmartCityMagdeburg2026/Datasources](https://github.com/SmartCityMagdeburg2026/Datasources) (raw JSON via fetch) |
| Deployment | [Vercel](https://vercel.com/) |
| Package Manager | pnpm |

---

## 📁 Project Structure

```
magdeburg-smart-city/
├── app/
│   ├── page.tsx                  # Home
│   ├── layout.tsx                # Root layout (Navbar, Footer, Providers)
│   ├── globals.css               # CSS variables & global styles
│   ├── insights/page.tsx         # Revenue insights dashboard
│   ├── housing/page.tsx          # Housing & rent dashboard
│   ├── transportation/page.tsx   # Transit dashboard
│   ├── climate/page.tsx          # Climate dashboard
│   ├── economy/page.tsx          # Economy dashboard
│   ├── safety/page.tsx           # Safety dashboard
│   ├── ai-streetlights/page.tsx  # AI streetlights simulation
│   ├── events/page.tsx           # Events calendar
│   └── projects/page.tsx         # Projects listing
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx            # Sticky navbar with SVG logo
│   │   ├── Footer.tsx            # Site footer
│   │   ├── Container.tsx         # Max-width wrapper
│   │   └── PageTransition.tsx    # Animated route transitions
│   ├── home/
│   │   ├── Hero.tsx              # Landing hero section
│   │   ├── FeatureGrid.tsx       # Dashboard feature cards
│   │   ├── CitySnapshot.tsx      # Live city stats strip
│   │   └── WelcomeToast.tsx      # Animated welcome toaster
│   ├── ai-streetlights/          # AI streetlight components
│   └── ui/                       # Shared UI primitives
│
├── context/
│   ├── LanguageContext.tsx       # DE/EN language toggle
│   └── ThemeContext.tsx          # Dark/light theme toggle
│
├── lib/                          # Utility functions
├── public/                       # Static assets
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- pnpm ≥ 8 (`npm install -g pnpm`)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/ayushtiwari18/Magbeburg-Smart-City-Project.git
cd Magbeburg-Smart-City-Project

# 2. Install dependencies
pnpm install

# 3. Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
pnpm build
pnpm start
```

---

## 📡 Data Sources

All data is fetched at runtime from the public data repository:

```
https://raw.githubusercontent.com/SmartCityMagdeburg2026/Datasources/main/data/
```

Key datasets used:

| Dataset | Path |
|---|---|
| Tax revenue 2010–2025 | `steuereinnahmen/json/steuereinnahmen-2010-2025.json` |
| Housing / rent by district | `wohnen/json/...` |
| MVB transit ridership | `verkehr/json/...` |
| Climate / weather monthly | `klima/json/...` |
| Traffic accidents | `unfaelle/json/...` |

No API keys or environment variables are required — all data is open and publicly hosted.

---

## 🌍 Internationalisation

The app supports **German (DE)** and **English (EN)** via a lightweight `LanguageContext`. The toggle is in the navbar. Navigation labels, section headings, and key UI text switch instantly without a page reload.

---

## 🎨 Theming

Light and dark mode are controlled by a `ThemeContext` that sets CSS custom properties on `<html>`. The toggle is in the navbar. Theme variables are defined in `app/globals.css`.

---

## 🏗️ Deployment

The project is configured for zero-config deployment on **Vercel**:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

A `vercel.json` is included in the repo root with optimal settings.

---

## 👥 Team

Built by **Team 12** for the **Smart City Magdeburg 2026** hackathon / course project.

| Role | Contributor |
|---|---|
| Lead Developer | [@ayushtiwari18](https://github.com/ayushtiwari18) |
| Organisation | [SmartCityMagdeburg2026](https://github.com/SmartCityMagdeburg2026) |

---

## 📄 License

This project is built for educational and civic purposes as part of the Smart City Magdeburg 2026 initiative. Data is sourced from publicly available city statistics.

---

<div align="center">
  <strong>🏙️ Smart City Magdeburg 2026</strong><br/>
  <sub>Making city data accessible, visual, and actionable.</sub>
</div>
