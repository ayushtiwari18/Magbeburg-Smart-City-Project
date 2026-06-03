# 🏙️ Magdeburg Smart City Platform

> Built for the **Magdeburg Smart City Hackathon** — a civic tech initiative by Landeshauptstadt Magdeburg (Saxony-Anhalt, Germany).

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js) ![React](https://img.shields.io/badge/React-19-blue?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript) ![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwindcss)

---

## 📌 About the Project

This platform is a **smart city dashboard** for Magdeburg, Germany — visualising initiatives, data, and projects across five key urban domains. It was created as a hackathon submission to demonstrate how digital technology can improve city life for residents and planners alike.

### 🎯 Hackathon Context
The project was submitted as part of the official Magdeburg citizen participation portal:
🔗 [beteiligung.sachsen-anhalt.de](https://beteiligung.sachsen-anhalt.de/portal/magdeburg/beteiligung/themen/1003460)

---

## ✨ Features

| Section | Description |
|---|---|
| 🛡️ **Safety** | Smart surveillance, SOS stations, community watch |
| 🚌 **Smart Transportation** | Live bus tracking, e-bike sharing, multimodal routing |
| 🌿 **Climate** | Air quality sensors, urban greening, heat island reduction |
| 💡 **AI Streetlights** | Adaptive brightness, predictive maintenance, energy savings |
| 📊 **City Insights** | Live KPI dashboard, open data portal, district heatmaps |
| 📁 **Projects** | Transparent overview of all smart city initiatives & status |
| ℹ️ **About** | Vision, mission, and governance pillars |

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4
- **Icons**: [Lucide React](https://lucide.dev)
- **Font**: Geist (via `next/font`)
- **Package Manager**: pnpm

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm (`npm install -g pnpm`)

### Installation

```bash
# Clone the repo
git clone https://github.com/ayushtiwari18/Magbeburg-Smart-City-Project.git
cd Magbeburg-Smart-City-Project

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
pnpm build
pnpm start
```

---

## 📁 Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout (Navbar + Footer)
│   ├── page.tsx            # Homepage (Hero + FeatureGrid)
│   ├── safety/             # Safety page
│   ├── transportation/     # Smart Transportation page
│   ├── climate/            # Climate page
│   ├── ai-streetlights/    # AI Streetlights page
│   ├── insights/           # City Insights page
│   ├── projects/           # Projects overview page
│   ├── about/              # About / Vision page
│   └── not-found.tsx       # Custom 404 page
├── components/
│   ├── home/
│   │   ├── Hero.tsx        # Homepage hero banner
│   │   └── FeatureGrid.tsx # Feature cards grid
│   └── layout/
│       ├── Navbar.tsx      # Sticky responsive navbar
│       ├── Footer.tsx      # Footer with legal links
│       └── Container.tsx   # Reusable max-width wrapper
└── public/
    └── image/              # City logo + banner image
```

---

## 🎨 Design System

| Token | Value |
|---|---|
| Primary Navy | `#061B46` |
| Accent Blue | `#6F8FD8` |
| Background | `#f8fafc` |
| Border | `#e8edf5` |
| Font | Geist Sans |

---

## 👥 Team

Built with ❤️ for Magdeburg by [Ayush Tiwari](https://github.com/ayushtiwari18).

---

## 📄 License

This project was created for hackathon purposes. All city branding assets belong to Landeshauptstadt Magdeburg.
