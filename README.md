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
| **Transportation** | `/transportation` | MVB annual ridership, vehicle fleet by fuel type (EV trend), cars per district, local transit network stats, Hauptbahnhof ticket sales | [`data/kiss-md/json/verkehr/`](https://github.com/SmartCityMagdeburg2026/Datasources/tree/main/data/kiss-md/json/verkehr) · KISS-MD / Landeshauptstadt Magdeburg |
| **Safety** | `/safety` | Road accident totals, accidents by district (hotspot map), by hour of day (heatmap), by weekday, by cause | [`data/kiss-md/json/verkehr/`](https://github.com/SmartCityMagdeburg2026/Datasources/tree/main/data/kiss-md/json/verkehr) · KISS-MD / Landeshauptstadt Magdeburg |
| **AI Streetlights** | `/ai-streetlights` | Road infrastructure stats (km, intersections); accident hotspots by district as proxy for smart-lighting prioritisation; streetlamp GPS positions | [`data/kiss-md/json/verkehr/strassen-und-verkehrsanlagen.json`](https://github.com/SmartCityMagdeburg2026/Datasources/tree/main/data/kiss-md/json/verkehr) · [OpenStreetMap Overpass API](https://overpass-api.de) (`highway=street_lamp`) |
| **Projects** | `/projects` | Static content — no automated dataset available | Manually curated from [Digitale Modellregion Magdeburg](https://www.magdeburg.de) |
| **Events** | `/events` | Static content | [GovData CKAN API](https://ckan.govdata.de/api/3/action/package_search?q=Magdeburg) (planned) |

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
| **OpenStreetMap Overpass** | Tram stop locations; streetlamp GPS coordinates across Magdeburg | `https://overpass-api.de/api/interpreter` with `railway=tram_stop` or `highway=street_lamp` query |
| **PEGELONLINE / WSV** | Live Elbe river water level + 7-day history at Magdeburg Strombrücke | `https://www.pegelonline.wsv.de/webservices/rest-api/v2/stations/MAGDEBURG-STROMBR%C3%9CCKE/W/currentmeasurement.json` |

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
├── safety/           # Road accidents by district / hour / weekday / cause
├── transportation/   # MVB ridership, EV fleet trend, car ownership by district
├── ai-streetlights/  # Smart streetlight context — road infra + accident hotspots
├── projects/         # City project listings (static)
├── events/           # City events (static)
└── layout.tsx        # Root layout with nav

components/
├── layout/           # Container, Navbar, Footer
└── ui/               # Shared UI components

lib/
└── pedestrian-zones.ts  # Legacy placeholder — replace with real accident data
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

### KISS-MD Verkehr files (Transportation & Safety)

All files under `data/kiss-md/json/verkehr/` follow the standard KISS-MD envelope:

```json
{
  "columns": [ { "id": "var1", "label": "...", "unit": "...", "role": "..." } ],
  "rows":    [ { "var1": 2020, "var2": 12345, ... } ]
}
```

| File | Page | Key columns |
|---|---|---|
| `befoerderte-personen-der-magdeburger-verkehrsbetriebe-gmbh-und-co-kg.json` | `/transportation` | Year, total passengers, tram, bus |
| `fahrzeugbestand-nach-kraftstoff-und-schadstoffgruppen-plakette.json` | `/transportation` | Year, fuel type (Benzin / Diesel / Elektro / Hybrid), count |
| `kraftfahrzeugbestand-aufgeschluesselt-nach-stadtteilen.json` | `/transportation` | Year, Stadtteil, total vehicles |
| `innerstaedtischer-nahverkehr.json` | `/transportation` | Year, line count, km operated, capacity |
| `vertriebskennziffern-des-magdeburger-hauptbahnhofs.json` | `/transportation` | Year, tickets sold, revenue |
| `strassenverkehrsunfaelle-in-magdeburg-gesamt.json` | `/safety` | Year, total accidents, injured, killed |
| `unfallgeschehen-in-der-stadt-magdeburg-nach-stadtteilen.json` | `/safety` | Year, Stadtteil, accident count |
| `verkehrsunfaelle-aufgeteilt-nach-uhrzeiten.json` | `/safety` | Hour (0–23), accident count |
| `verkehrsunfaelle-mit-sachschaden-nach-wochentagen.json` | `/safety` | Weekday, accident count |
| `unfaelle-nach-ausgewaehlten-ursachen.json` | `/safety` | Year, cause (speeding / alcohol / distraction…), count |
| `strassen-und-verkehrsanlagen.json` | `/ai-streetlights` | Total road km, intersection count, street categories |

> **Note:** `null` values in the rent index indicate a sample size too small for a statistically meaningful average — filter before display. KISS-MD `null` values in numeric columns indicate missing/suppressed data for the same reason.

---

## License

Data © respective data providers (DWD, Landeshauptstadt Magdeburg, Sensor.Community, OpenStreetMap contributors). Application code MIT.
