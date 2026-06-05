# Smart City Magdeburg 2026

A Next.js dashboard presenting real open data for the city of Magdeburg — built for the **Smart City Hackathon 2026**.

🌐 **Live site:** [magbeburg-smart-city-project.vercel.app](https://magbeburg-smart-city-project.vercel.app)

---

## Pages & Data Sources

Every page that shows real data fetches it directly at runtime — no data is bundled into the app. The table below maps each page to its exact data source.

| Page | Route | Real Data Used | Source |
|---|---|---|---|
| **Climate** | `/climate` | Monthly mean temperature (`MO_TT`), monthly precipitation (`MO_RR`), monthly wind (`MO_FK`) · Station 03126 · 1950–2025 | [`data/sensor-data/json/klima-monat.json`](https://github.com/SmartCityMagdeburg2026/Datasources/tree/main/data/sensor-data) · DWD Climate Data Center |
| **Housing** | `/housing` | Net cold rent per m² by district, floor-area class, and year · 37 districts · 2012–2026 | [`data/mietspiegel-2024/nach-wohnflaeche.json`](https://github.com/SmartCityMagdeburg2026/Datasources/tree/main/data/mietspiegel-2024) · Mietspiegel Magdeburg 2024 |
| **Insights** | `/insights` | Annual tax revenue breakdown (Gewerbesteuer, Einkommensteuer, Umsatzsteuer, Grundsteuer B) · 2010–2025 | [`data/steuereinnahmen/json/steuereinnahmen-2010-2025.json`](https://github.com/SmartCityMagdeburg2026/Datasources/tree/main/data/steuereinnahmen) · Landeshauptstadt Magdeburg |
| **Map** | `/map` | Live weather (temperature, wind, condition), live air quality (PM10, PM2.5 µg/m³) from citizen sensors, tram stop locations | [Bright Sky / DWD API](https://brightsky.dev) · [Sensor.Community API](https://sensor.community) · [OpenStreetMap Overpass API](https://overpass-api.de) |
| **Safety** | `/safety` | Simulated pedestrian zone occupancy (placeholder — real sensor endpoint not yet public) | `lib/pedestrian-zones.ts` |
| **Transportation** | `/transportation` | Static content — no live GTFS/MVB API publicly available | N/A |
| **AI Streetlights** | `/ai-streetlights` | Static content | N/A |
| **Projects** | `/projects` | Static content | N/A |
| **Events** | `/events` | Static content | N/A |

---

## Data Repository

All static datasets are sourced from the official hackathon data repository:

**[github.com/SmartCityMagdeburg2026/Datasources](https://github.com/SmartCityMagdeburg2026/Datasources)**

Raw JSON files are fetched at runtime via:
```
https://raw.githubusercontent.com/SmartCityMagdeburg2026/Datasources/main/data/<path>
```

No API key or authentication is required for any of these datasets.

---

## External APIs (Live, No Key Required)

| API | What it provides | Endpoint |
|---|---|---|
| **Bright Sky** (DWD) | Current weather: temperature, wind speed, condition, precipitation | `https://api.brightsky.dev/current_weather?lat=52.1205&lon=11.6276` |
| **Sensor.Community** | Air quality: PM10 and PM2.5 from citizen-operated sensors in a 10 km radius | `https://data.sensor.community/airrohr/v1/filter/area=52.1205,11.6276,10` |
| **OpenStreetMap Overpass** | Tram stop locations across Magdeburg | `https://overpass-api.de/api/interpreter` with `railway=tram_stop` query |

---

## Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org) (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Icons:** [Lucide React](https://lucide.dev)
- **Maps:** [Leaflet](https://leafletjs.com) + OpenStreetMap tiles
- **Package manager:** pnpm
- **Deployment:** [Vercel](https://vercel.com)

---

## Getting Started

```bash
# Clone the repository
git clone https://github.com/ayushtiwari18/Magbeburg-Smart-City-Project.git
cd Magbeburg-Smart-City-Project

# Install dependencies
pnpm install

# Start the dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
app/
├── climate/          # DWD temperature & rain charts (1950–2025)
├── housing/          # Mietspiegel rent index by district
├── insights/         # Tax revenue bar chart (2010–2025)
├── map/              # Leaflet map + live weather + air quality + tram stops
├── safety/           # Pedestrian zone occupancy (simulated)
├── transportation/   # Smart transport overview (static)
├── ai-streetlights/  # AI streetlight project info (static)
├── projects/         # City project listings (static)
├── events/           # City events (static)
└── layout.tsx        # Root layout with nav

components/
├── layout/           # Container, Navbar, Footer
└── ui/               # Shared UI components

lib/
└── pedestrian-zones.ts  # Pedestrian data (simulated — replace with real endpoint)
```

---

## Dataset Schemas (Quick Reference)

### `klima-monat.json` (Climate)
| Column | Meaning | Unit |
|---|---|---|
| `date` | Month start date | `YYYY-MM-DD` |
| `MO_TT` | Monthly mean temperature | °C |
| `MO_RR` | Monthly precipitation total | mm |
| `MO_FK` | Monthly mean wind speed | m/s |

### `nach-wohnflaeche.json` (Housing)
| Column | Meaning | Unit |
|---|---|---|
| `year` | Reference year | integer |
| `stadtteil` | City district | string |
| `wohnflaechenklasse` | Floor-area class | string |
| `nettokaltmiete_pro_qm` | Net cold rent per m² | EUR/m² |
| `stichprobengroesse` | Sample size | integer |

### `steuereinnahmen-2010-2025.json` (Tax Revenue)
| Column | Meaning |
|---|---|
| `jahr` | Year |
| `gewerbesteuer` | Business tax (€ thousands) |
| `gemeindeanteil-an-der-einkommensteuer` | Municipal share of income tax |
| `gemeindeanteil-an-der-umsatzsteuer` | Municipal share of sales tax |
| `grundsteuer-b-bis-2024` | Property tax B (up to 2024) |

> **Note:** `null` values in the rent index indicate the sample size was too small for a statistically meaningful average and should be filtered out before display.

---

## License

Data © respective data providers (DWD, Landeshauptstadt Magdeburg, Sensor.Community, OpenStreetMap contributors). Application code MIT.
