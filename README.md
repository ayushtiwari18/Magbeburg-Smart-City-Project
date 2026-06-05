# Smart City Magdeburg 2026

A Next.js dashboard presenting real open data for the city of Magdeburg — built for the **Smart City Hackathon 2026**.

🌐 **Live site:** [magbeburg-smart-city-project.vercel.app](https://magbeburg-smart-city-project.vercel.app)  
📦 **Data repo:** [github.com/SmartCityMagdeburg2026/Datasources](https://github.com/SmartCityMagdeburg2026/Datasources)

---

## Pages & Real Data Used

Every page that shows real data fetches it directly at runtime — no data is bundled into the app.

| Page | Route | Real Data Used | Source |
|---|---|---|---|
| **Climate** | `/climate` | Monthly mean temp (`MO_TT`), precipitation (`MO_RR`), wind (`MO_FK`) · Station 03126 · 1950–2025 | [`data/sensor-data/json/klima-monat.json`](https://github.com/SmartCityMagdeburg2026/Datasources/tree/main/data/sensor-data) · DWD |
| **Housing** | `/housing` | Net cold rent per m² by district, floor-area class, year · 37 districts · 2012–2026; Census 2022 rent density grid | [`data/mietspiegel-2024/nach-wohnflaeche.json`](https://github.com/SmartCityMagdeburg2026/Datasources/tree/main/data/mietspiegel-2024) · [`data/Zensus/ZensusMiete.geojson`](https://github.com/SmartCityMagdeburg2026/Datasources/tree/main/data/Zensus) |
| **Insights** | `/insights` | Annual tax revenue breakdown 2010–2025; Census 2022 population density grid | [`data/steuereinnahmen/json/steuereinnahmen-2010-2025.json`](https://github.com/SmartCityMagdeburg2026/Datasources/tree/main/data/steuereinnahmen) · [`data/Zensus/ZensusBev.geojson`](https://github.com/SmartCityMagdeburg2026/Datasources/tree/main/data/Zensus) |
| **Map** | `/map` | Live weather, live air quality, district boundary overlay | [Bright Sky / DWD API](https://brightsky.dev) · [Sensor.Community API](https://sensor.community) · [`data/Stadtteile/Stadtteile.geojson`](https://github.com/SmartCityMagdeburg2026/Datasources/tree/main/data/Stadtteile) |
| **Transportation** | `/transportation` | GTFS schedules (MVB tram + bus, KVG, NJL, PVGS, Bördebus); stop locations; MVB ridership; vehicle fleet by fuel type; cars per district | [`data/OEV-Daten_NASA_GmbH/GTFS/`](https://github.com/SmartCityMagdeburg2026/Datasources/tree/main/data/OEV-Daten_NASA_GmbH/GTFS) · [`data/OEV-Daten_NASA_GmbH/Haltestellen/`](https://github.com/SmartCityMagdeburg2026/Datasources/tree/main/data/OEV-Daten_NASA_GmbH/Haltestellen) · [`data/kiss-md/json/verkehr/`](https://github.com/SmartCityMagdeburg2026/Datasources/tree/main/data/kiss-md) |
| **Safety** | `/safety` | Georeferenced accident points 2017–2024 (severity, cause, participant type); accident counts by district, hour, weekday, cause | [`data/Unfaelle/Magdeburg_Unfallatlas.geojson`](https://github.com/SmartCityMagdeburg2026/Datasources/tree/main/data/Unfaelle) · [`data/kiss-md/json/verkehr/`](https://github.com/SmartCityMagdeburg2026/Datasources/tree/main/data/kiss-md) |
| **AI Streetlights** | `/ai-streetlights` | Accident hotspot map; road infrastructure stats; city tree positions for shadow/obstruction analysis | [`data/Unfaelle/Magdeburg_Unfallatlas.geojson`](https://github.com/SmartCityMagdeburg2026/Datasources/tree/main/data/Unfaelle) · [`data/Baumkataster/Baumkataster.geojson`](https://github.com/SmartCityMagdeburg2026/Datasources/tree/main/data/Baumkataster) · [`data/kiss-md/json/verkehr/strassen-und-verkehrsanlagen.json`](https://github.com/SmartCityMagdeburg2026/Datasources/tree/main/data/kiss-md) |
| **Projects** | `/projects` | Static content | Manually curated from [Digitale Modellregion Magdeburg](https://www.magdeburg.de) |
| **Events** | `/events` | Static content | [GovData CKAN API](https://ckan.govdata.de/api/3/action/package_search?q=Magdeburg) (planned) |

---

## What Is Real vs. Placeholder

| Page | Status |
|---|---|
| `/climate` | ✅ Real DWD data |
| `/housing` | ✅ Real rent index data |
| `/insights` | ✅ Real tax revenue data |
| `/map` | ✅ Live weather + air quality APIs |
| `/transportation` | ✅ Real GTFS + KISS-MD transport stats |
| `/safety` | ✅ Real accident GeoJSON (Unfallatlas) |
| `/ai-streetlights` | ✅ Real accident + Baumkataster data |
| `/projects` | ⚠️ Static / manually curated |
| `/events` | ⚠️ Static — real API integration planned |

---

## Full Dataset Inventory

All static datasets live in [SmartCityMagdeburg2026/Datasources](https://github.com/SmartCityMagdeburg2026/Datasources) and are fetched via:

```
https://raw.githubusercontent.com/SmartCityMagdeburg2026/Datasources/main/data/<path>
```

No API key or authentication is required.

---

### 🌡️ `data/sensor-data/` — DWD Climate Data

| File | Contents |
|---|---|
| `json/klima-monat.json` | Monthly climate data · DWD Station 03126 Magdeburg · from 1834 |
| `json/klima-tag.json` | Daily climate data · from 1881 |

**Used on:** `/climate`

---

### 🏘️ `data/mietspiegel-2024/` — Rent Index 2024

| File | Contents |
|---|---|
| `nach-wohnflaeche.json` | Net cold rents per m² by district, floor-area class, and construction period |

**Used on:** `/housing`

---

### 💰 `data/steuereinnahmen/` — Tax Revenue

| File | Contents |
|---|---|
| `json/steuereinnahmen-2010-2025.json` | Annual city tax revenue by type · 2010–2025 |
| `json/hebesaetze-1991-2026.json` | Tax multipliers (Hebesätze) · 1991–2026 |

**Used on:** `/insights`

---

### 📊 `data/kiss-md/` — City Statistics (322 datasets)

322 datasets across 13 categories (Bevölkerung, Wirtschaft, Verkehr, Wohnen, Soziales…).  
Each JSON file follows the structure:

```json
{
  "columns": [{ "id": "var1", "label": "...", "unit": "...", "role": "..." }],
  "rows":    [{ "var1": 2020, "var2": 12345 }]
}
```

**Key files used in this project:**

| File (under `json/verkehr/`) | Used on |
|---|---|
| `befoerderte-personen-der-magdeburger-verkehrsbetriebe-gmbh-und-co-kg.json` | `/transportation` — MVB annual ridership |
| `fahrzeugbestand-nach-kraftstoff-und-schadstoffgruppen-plakette.json` | `/transportation` — vehicle fleet by fuel type (EV trend) |
| `kraftfahrzeugbestand-aufgeschluesselt-nach-stadtteilen.json` | `/transportation` — cars per district |
| `innerstaedtischer-nahverkehr.json` | `/transportation` — line count, km operated |
| `strassenverkehrsunfaelle-in-magdeburg-gesamt.json` | `/safety` — yearly accident totals |
| `unfallgeschehen-in-der-stadt-magdeburg-nach-stadtteilen.json` | `/safety` — accidents per district |
| `verkehrsunfaelle-aufgeteilt-nach-uhrzeiten.json` | `/safety` — accidents by hour of day |
| `verkehrsunfaelle-mit-sachschaden-nach-wochentagen.json` | `/safety` — accidents by weekday |
| `unfaelle-nach-ausgewaehlten-ursachen.json` | `/safety` — accidents by cause |
| `strassen-und-verkehrsanlagen.json` | `/ai-streetlights` — total road km, intersection count |

---

### 🚌 `data/OEV-Daten_NASA_GmbH/` — Public Transit

Provided by **NASA GmbH** (Nahverkehrsservice Sachsen-Anhalt).

#### GTFS feeds (`GTFS/`)

| File | Operator | Coverage |
|---|---|---|
| `gtfs_mvb_std_kn.zip` | **MVB** | Tram + city bus — all lines in Magdeburg |
| `gtfs_kvg_std_kn.zip` | **KVG** | Regional bus routes around Magdeburg |
| `gtfs_njl_std_kn.zip` | **NJL** | Night and rural lines |
| `gtfs_pvgs_std_kn.zip` | **PVGS** | Regional bus, Salzlandkreis area |
| `gtfs_boerdebus_std_kn.zip` | **Bördebus** | Landkreis Börde bus network |

Each ZIP contains: `routes.txt`, `trips.txt`, `stop_times.txt`, `stops.txt`, `calendar.txt`, `shapes.txt`.

#### Stop locations (`Haltestellen/`)

| Subfolder | Contents |
|---|---|
| `ST/` | All stops in Saxony-Anhalt |
| `PlusBus/` | High-frequency regional bus stops |
| `Taktbus/` | Clockface-interval rural bus stops |

**Used on:** `/transportation`

---

### 🚨 `data/Unfaelle/` — Traffic Accident Atlas

| File | Contents |
|---|---|
| `Magdeburg_Unfallatlas.geojson` | Every road accident with personal injury in Magdeburg, georeferenced · 2017–2024 |

**Source:** Unfallatlas der Statistischen Ämter — Datenlizenz Deutschland v2.0

**Key GeoJSON properties:**

| Property | Meaning |
|---|---|
| `UJAHR` | Year |
| `USTUNDE` | Hour (0–23) |
| `UWOCHENTAG` | Weekday (1=Sun … 7=Sat) |
| `UKATEGORIE` | Severity: 1=fatal, 2=serious, 3=minor injury |
| `UART` | Accident type code |
| `IstFuss` / `IstRad` / `IstPKW` / `IstKrad` | Pedestrian / cyclist / car / motorbike involved (0 or 1) |

**Used on:** `/safety`, `/ai-streetlights`

---

### 🌳 `data/Baumkataster/` — City Tree Registry

| File | Contents |
|---|---|
| `Baumkataster.geojson` | Every city-managed tree in Magdeburg — position, species, trunk diameter, crown width (~30 MB) |

**Used on:** `/ai-streetlights` (tree canopy blocking streetlight coverage)

---

### 🏙️ `data/Stadtteile/` — District Boundaries

| File | Contents |
|---|---|
| `Stadtteile.geojson` | Official polygon boundaries of all Magdeburg Stadtteile |

**Used on:** `/map` overlay, any choropleth map

---

### 👥 `data/Zensus/` — Census 2022

| File | Contents |
|---|---|
| `ZensusBev.geojson` | Population density grid (100m cells) across Magdeburg |
| `ZensusMiete.geojson` | Average rent per m² grid (100m cells) |

**Used on:** `/insights` (population), `/housing` (rent grid)

---

### ☕ `data/CafesOSM/` — Cafés (OpenStreetMap)

OSM-sourced café locations across Magdeburg.  
**Available for:** `/map` POI layer, walkability/amenity analysis (not yet wired up).

---

### 🧠 `data/rag/` — RAG Knowledge Base

Pre-built knowledge base for Magdeburg (54 sources → ~3,000 chunks), ready via `docker compose` with Qdrant + `bge-m3` via Ollama.  
**Use for:** Chatbot assistant, semantic search over city data.  
See [HACKATHON_README.md](https://github.com/SmartCityMagdeburg2026/Datasources/blob/main/data/rag/HACKATHON_README.md).

---

## External Live APIs

All called directly from the browser — no proxy, no API key.

| API | Provides | Endpoint |
|---|---|---|
| **Bright Sky / DWD** | Current weather: temperature, wind, condition, precipitation | `https://api.brightsky.dev/current_weather?lat=52.1205&lon=11.6276` |
| **Sensor.Community** | Air quality: PM10 + PM2.5 from citizen sensors in 10 km radius | `https://data.sensor.community/airrohr/v1/filter/area=52.1205,11.6276,10` |
| **PEGELONLINE / WSV** | Live Elbe river level + 7-day history | `https://www.pegelonline.wsv.de/webservices/rest-api/v2/stations/MAGDEBURG-STROMBR%C3%9CCKE/W/currentmeasurement.json` |
| **Overpass (OSM)** | Tram stops, streetlamps, bike parking (preprocessed to JSON) | `https://overpass-api.de/api/interpreter` |
| **GovData CKAN** | Open dataset catalogue search | `https://ckan.govdata.de/api/3/action/package_search?q=Magdeburg` |

### Quick fetch examples

```ts
// Live weather
const { weather } = await fetch(
  "https://api.brightsky.dev/current_weather?lat=52.1205&lon=11.6276"
).then(r => r.json());
// weather.temperature (°C) · weather.wind_speed (km/h) · weather.condition

// Elbe water level
const level = await fetch(
  "https://www.pegelonline.wsv.de/webservices/rest-api/v2/stations/MAGDEBURG-STROMBR%C3%9CCKE/W/currentmeasurement.json"
).then(r => r.json());
// level.value (cm) · level.timestamp

// Air quality
const sensors = await fetch(
  "https://data.sensor.community/airrohr/v1/filter/area=52.1205,11.6276,10"
).then(r => r.json());
// filter: value_type 'P1' = PM10 · 'P2' = PM2.5 (µg/m³)
// WHO 24h guideline: PM10 ≤ 45 µg/m³ · PM2.5 ≤ 15 µg/m³
```

---

## Dataset Schemas (Quick Reference)

### `klima-monat.json`
| Column | Meaning | Unit |
|---|---|---|
| `date` | Month start | `YYYY-MM-DD` |
| `MO_TT` | Monthly mean temperature | °C |
| `MO_RR` | Monthly precipitation total | mm |
| `MO_FK` | Monthly mean wind speed | m/s |
| `MO_SD_S` | Monthly sunshine duration | h |

### `nach-wohnflaeche.json`
| Column | Meaning | Unit |
|---|---|---|
| `year` | Reference year | integer |
| `stadtteil` | City district | string |
| `wohnflaechenklasse` | Floor-area class | string |
| `nettokaltmiete_pro_qm` | Net cold rent per m² | EUR/m² |
| `stichprobengroesse` | Sample size | integer |

> `null` = sample too small for a statistically reliable average — filter before display.

### `steuereinnahmen-2010-2025.json`
| Column | Meaning |
|---|---|
| `jahr` | Year |
| `gewerbesteuer` | Business tax (€ thousands) |
| `gemeindeanteil-an-der-einkommensteuer` | Municipal income tax share |
| `gemeindeanteil-an-der-umsatzsteuer` | Municipal sales tax share |
| `grundsteuer-b-bis-2024` | Property tax B (up to 2024) |

### `Magdeburg_Unfallatlas.geojson`
| Property | Meaning |
|---|---|
| `UJAHR` | Year |
| `USTUNDE` | Hour of day (0–23) |
| `UWOCHENTAG` | Weekday (1=Sun … 7=Sat) |
| `UKATEGORIE` | Severity: 1=fatal, 2=serious, 3=minor |
| `UART` | Accident type code |
| `IstFuss` / `IstRad` / `IstPKW` | Pedestrian / cyclist / car involved (0 or 1) |

### GTFS files (inside each `*.zip`)
| File | Contents |
|---|---|
| `stops.txt` | Stop ID, name, lat, lon |
| `routes.txt` | Route ID, short name, type (0=tram, 3=bus) |
| `trips.txt` | Trip → route + service mapping |
| `stop_times.txt` | Arrival/departure per stop per trip |
| `shapes.txt` | Route geometry as polyline points |
| `calendar.txt` | Service days (Mon–Sun) + validity period |

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
git clone https://github.com/ayushtiwari18/Magbeburg-Smart-City-Project.git
cd Magbeburg-Smart-City-Project
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
app/
├── climate/          # DWD temperature & rain charts
├── housing/          # Mietspiegel rent index + Zensus rent grid
├── insights/         # Tax revenue + Zensus population grid
├── map/              # Leaflet map + live weather + air quality + districts
├── safety/           # Unfallatlas GeoJSON hotspot map + KISS-MD accident stats
├── transportation/   # GTFS routes + MVB ridership + EV fleet trend
├── ai-streetlights/  # Accident dark-spots + Baumkataster tree coverage
├── projects/         # City projects (static)
├── events/           # City events (static)
└── layout.tsx

components/
├── layout/           # Container, Navbar, Footer
└── ui/               # Shared UI components

lib/
└── pedestrian-zones.ts
```

---

## License

Data © respective providers (DWD, Landeshauptstadt Magdeburg, NASA GmbH, Statistische Ämter, Sensor.Community, OpenStreetMap contributors).  
Application code MIT.
