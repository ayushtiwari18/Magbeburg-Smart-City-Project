# 🏙️ Smart City Dashboard — Magdeburg 2026

> A real-time, open-data civic dashboard built for the people of Magdeburg — integrating live sensor feeds, official city statistics, and public transport data into one unified, accessible interface.

**Live Demo:** [https://magbeburg-smart-city-project.vercel.app](https://magbeburg-smart-city-project.vercel.app)  
**Data Repository:** [SmartCityMagdeburg2026/Datasources](https://github.com/SmartCityMagdeburg2026/Datasources)  
**Tech Stack:** Next.js 15 · TypeScript · Tailwind CSS · Leaflet · Recharts · Vercel

---

## 1. Added Value for Magdeburg

### Why this dashboard exists

Magdeburg residents, commuters, city planners, and students currently have no single place to see the city's key metrics — air quality, Elbe river levels, housing costs, public transport coverage, and fiscal health — side by side, in real time, for free.

This dashboard directly addresses that gap.

### Concrete use cases by demographic

| Audience | What they get | Real data powering it |
|---|---|---|
| **Daily commuters** | Live tram / bus / night bus positions, stop locations per operator | OpenStreetMap Overpass API (live) |
| **Families & residents** | Current air quality (PM10, PM2.5), Elbe flood level, weather | Sensor.Community · Pegelonline WSV · Bright Sky/DWD |
| **Renters & housing seekers** | Rent index per district, trend 2012–2026, by building age & floor area | `data/mietspiegel-2024/` · `data/Zensus/ZensusMiete.geojson` |
| **Citizens & journalists** | City tax revenue 2010–2025, budget transparency, economic trends | `data/steuereinnahmen/` |
| **Students & researchers** | 322 KISS-MD city statistics across 13 categories, DWD climate data since 1881 | `data/kiss-md/` · `data/sensor-data/` |
| **People with disabilities** | Accessibility map layer: barrier-free stops, accessible routes | `/barrierefreiheit` page |
| **Road safety advocates** | Accident hotspots 2017–2024, dark-spot analysis for streetlight placement | `data/Unfaelle/Magdeburg_Unfallatlas.geojson` |

### Issues being addressed

- **Air quality transparency** — Magdeburg regularly exceeds EU PM10 thresholds near the Elbe industrial corridor. The dashboard shows live readings from citizen sensor networks with contextual thresholds visible to all.
- **Housing affordability** — Rising rents across Stadtfeld, Sudenburg, and the Altstadt are documented through the official 2024 Mietspiegel, giving residents hard data for rental negotiations and political advocacy.
- **Flood preparedness** — The Elbe has flooded central Magdeburg multiple times (2002, 2013). The live Pegelonline gauge gives residents early awareness, not just emergency alerts.
- **Road safety** — The `/safety` page maps every injury accident from 2017–2024 by location, time of day, weekday, and cause — identifying patterns invisible in annual reports.
- **Fiscal transparency** — Visualising tax revenue trends allows citizens to understand where public money comes from and correlate it with infrastructure decisions.

---

## 2. Visual Presentation of Data

### Design principles

The dashboard follows a **dark civic aesthetic** — authoritative without being inaccessible — using a deep navy (`#061B46`) primary with teal accents. Every page is mobile-responsive (375px → 1440px+) and passes WCAG AA contrast.

### How data is presented on each page

| Page | Charts & Visuals | Live / Real Data |
|---|---|---|
| `/` (Home) | Live KPI cards: temperature, AQI, Elbe level, active tram routes | ✅ Live |
| `/map` | Unified Leaflet map — 5 operator layers (MVB tram, KVG bus, NJL night, PVGS regional, Börde rural) with custom SVG icons and toggle pills | ✅ Live (OSM Overpass) |
| `/climate` | Line chart: monthly avg temp 1950–2025 · Bar chart: precipitation · Anomaly heatmap | ✅ Static JSON (DWD) |
| `/housing` | District choropleth · Bar chart: rent by building age · Line chart: rent trend 2012–2026 | ✅ Static JSON (Mietspiegel) |
| `/insights` | Stacked bar: tax revenue 2010–2025 · Donut: revenue categories · Trend sparklines | ✅ Static JSON (Steuereinnahmen) |
| `/transportation` | Ridership bar · Routes donut · Peak-hour grouped bars · Multi-operator toggle | ✅ GTFS + KISS-MD |
| `/safety` | GeoJSON accident heatmap 2017–2024 · By-hour bar · By-weekday bar · By-cause donut | ✅ Unfallatlas GeoJSON |
| `/ai-streetlights` | Accident dark-spot map · Tree canopy overlay · Suggested placement markers | ✅ Unfallatlas + Baumkataster |
| `/barrierefreiheit` | Accessibility score per district · Barrier-free stop map layer | ✅ OSM data |

### Data sources documented

Every page includes a **"Datenquellen" footer badge** linking directly to the originating dataset with its update cadence. Full inventory is in Section 5 below.

---

## 3. Reusability

### All data sources are public and regularly updated

| Dataset | Provider | Update frequency | License |
|---|---|---|---|
| KISS-MD (322 city indicators) | Stadt Magdeburg / SmartCityMagdeburg2026 | Annually | Open Data |
| DWD Climate Station 03126 (since 1834) | Deutscher Wetterdienst | Monthly | Open Data |
| Mietspiegel 2024 | Stadt Magdeburg | Every 2 years | Open Data |
| Steuereinnahmen 2010–2025 | Stadt Magdeburg | Annually | Open Data |
| Unfallatlas 2017–2024 | Statistische Ämter des Bundes und der Länder | Annually | Datenlizenz Deutschland v2.0 |
| Baumkataster | Landeshauptstadt Magdeburg | Ongoing | Open Data |
| GTFS feeds (MVB, KVG, NJL, PVGS, Börde) | NASA GmbH Nahverkehrsservice SA | Regularly | Open |
| Live weather | Bright Sky / DWD | Every 10 min | Open API (no key) |
| Elbe water level | Pegelonline WSV (Federal) | Every 15 min | Open API (no key) |
| Air quality PM10/PM2.5 | Sensor.Community (citizen sensors) | Every 5 min | Open API (no key) |
| Transport stops / POIs | OpenStreetMap Overpass | Real-time | ODbL |

### All tools and frameworks are open and free

| Layer | Tool | Version | Public? |
|---|---|---|---|
| Frontend framework | Next.js | 15 | ✅ MIT |
| Language | TypeScript | 5 | ✅ Apache 2.0 |
| Styling | Tailwind CSS | 4 | ✅ MIT |
| Mapping | Leaflet + React-Leaflet | 1.9 / 4.x | ✅ BSD-2 |
| Charts | Recharts | 2.x | ✅ MIT |
| Deployment | Vercel (free tier) | — | ✅ Free |
| Data repository | SmartCityMagdeburg2026/Datasources | — | ✅ Public GitHub |

### Effort to production-ready deployment

**Current state → Full production: Low effort**

- ✅ Already live on Vercel with CI/CD on every push to `main`
- ✅ All live APIs require zero API keys — no credential management
- ✅ Static JSON datasets are versioned in the public GitHub repo and fetched with `revalidate`
- ✅ All datasets listed above are already integrated and rendered
- 🔧 Remaining gap: `/events` page (GovData CKAN API integration planned)

**Adapting to another German city: ~2 days of effort** — swap the GTFS feeds, city bounding box coordinates, Pegelonline station ID, and Mietspiegel dataset. All architecture is city-agnostic by design.

---

## 4. Creativity & Unique Selling Points

### What makes this different from other submissions

- **Unified transport map** — all 5 regional operators (MVB, KVG, NJL, PVGS, Börde) on one map with distinct SVG icons, per-operator toggle pills, and click-to-detail popups. No other submission combines all operators.
- **Cross-domain correlation** — rent trends displayed alongside tax revenue trends on `/insights` enables citizens to ask: *"Why are rents rising while city income is growing?"* — a question no single-topic dashboard can support.
- **Elbe flood awareness layer** — live Pegelonline gauge + historical flood event context directly on the map, unique to this dashboard.
- **AI Streetlight placement** — the `/ai-streetlights` page cross-references accident dark-spots from the Unfallatlas with the Baumkataster tree canopy to suggest optimal new streetlight positions — a genuine planning tool, not just a visualisation.
- **Accessibility-first page** — `/barrierefreiheit` maps barrier-free infrastructure across all districts, serving a demographic systematically underserved by data dashboards.

### vs. smart city dashboards from other German cities

| Feature | This dashboard | Berlin Datenportal | Hamburg Transparenzportal | Munich Digitales München |
|---|---|---|---|---|
| Real-time air quality (citizen sensors) | ✅ | Official stations only | ❌ | Official only |
| Live river flood level | ✅ + history | ❌ | ✅ Elbe only | ❌ |
| Rent index visualised interactively | ✅ District + trend | Static PDF | Static PDF | ❌ |
| All transport operators on one map | ✅ 5 operators | Per-operator only | Per-operator only | Per-operator only |
| Road accident heatmap (Unfallatlas) | ✅ 2017–2024 | ❌ | Partial | ❌ |
| Streetlight AI placement tool | ✅ | ❌ | ❌ | ❌ |
| Accessibility layer | ✅ | Partial | Partial | ❌ |
| Open source, forkable | ✅ Full repo | ❌ | ❌ | ❌ |
| Zero API keys required | ✅ | ❌ Keys required | ❌ Keys required | ❌ Keys required |

### The USP in one sentence

> **The only open-source, zero-credential, multi-domain civic dashboard for Magdeburg that crosses environmental, fiscal, housing, mobility, and safety data in one interface — with a built-in AI streetlight placement tool — and can be forked for any German city in under two days.**

---

## 5. Full Dataset Inventory

All static datasets live in [SmartCityMagdeburg2026/Datasources](https://github.com/SmartCityMagdeburg2026/Datasources).  
Fetch any file directly via:

```
https://raw.githubusercontent.com/SmartCityMagdeburg2026/Datasources/main/data/<path>
```

No API key or authentication required.

---

### 🌡️ `data/sensor-data/` — DWD Climate Data

| File | Contents | Used on |
|---|---|---|
| `json/klima-monat.json` | Monthly climate · DWD Station 03126 · from 1834 | `/climate` |
| `json/klima-tag.json` | Daily climate · from 1881 | `/climate` |

**Schema (`klima-monat.json`):**

| Column | Meaning | Unit |
|---|---|---|
| `date` | Month start | `YYYY-MM-DD` |
| `MO_TT` | Monthly mean temperature | °C |
| `MO_RR` | Monthly precipitation total | mm |
| `MO_FK` | Monthly mean wind speed | m/s |
| `MO_SD_S` | Monthly sunshine duration | h |

---

### 🏘️ `data/mietspiegel-2024/` — Rent Index 2024

| File | Contents | Used on |
|---|---|---|
| `nach-wohnflaeche.json` | Net cold rents per m² by district, floor-area class, construction period | `/housing` |

**Schema:**

| Column | Meaning | Unit |
|---|---|---|
| `year` | Reference year | integer |
| `stadtteil` | City district | string |
| `wohnflaechenklasse` | Floor-area class | string |
| `nettokaltmiete_pro_qm` | Net cold rent per m² | EUR/m² |
| `stichprobengroesse` | Sample size | integer |

> `null` = sample too small — filter before display.

---

### 💰 `data/steuereinnahmen/` — Tax Revenue

| File | Contents | Used on |
|---|---|---|
| `json/steuereinnahmen-2010-2025.json` | Annual city tax revenue by type · 2010–2025 | `/insights` |
| `json/hebesaetze-1991-2026.json` | Tax multipliers (Hebesätze) · 1991–2026 | `/insights` |

**Schema:**

| Column | Meaning |
|---|---|
| `jahr` | Year |
| `gewerbesteuer` | Business tax (€ thousands) |
| `gemeindeanteil-an-der-einkommensteuer` | Municipal income tax share |
| `gemeindeanteil-an-der-umsatzsteuer` | Municipal sales tax share |
| `grundsteuer-b-bis-2024` | Property tax B |

---

### 📊 `data/kiss-md/` — City Statistics (322 datasets)

322 datasets across 13 categories. Each JSON follows:

```json
{
  "columns": [{ "id": "var1", "label": "...", "unit": "...", "role": "..." }],
  "rows":    [{ "var1": 2020, "var2": 12345 }]
}
```

**Key files used:**

| File | Used on |
|---|---|
| `verkehr/befoerderte-personen-…-mvb.json` | `/transportation` — MVB annual ridership |
| `verkehr/fahrzeugbestand-nach-kraftstoff-….json` | `/transportation` — EV fleet trend |
| `verkehr/kraftfahrzeugbestand-…-stadtteilen.json` | `/transportation` — cars per district |
| `verkehr/innerstaedtischer-nahverkehr.json` | `/transportation` — lines, km operated |
| `verkehr/strassenverkehrsunfaelle-…-gesamt.json` | `/safety` — yearly accident totals |
| `verkehr/unfallgeschehen-…-stadtteilen.json` | `/safety` — accidents per district |
| `verkehr/verkehrsunfaelle-…-uhrzeiten.json` | `/safety` — accidents by hour |
| `verkehr/verkehrsunfaelle-…-wochentagen.json` | `/safety` — accidents by weekday |
| `verkehr/unfaelle-nach-…-ursachen.json` | `/safety` — accidents by cause |
| `verkehr/strassen-und-verkehrsanlagen.json` | `/ai-streetlights` — road km, intersections |

---

### 🚌 `data/OEV-Daten_NASA_GmbH/` — Public Transit (GTFS)

Provided by **NASA GmbH** (Nahverkehrsservice Sachsen-Anhalt).

| GTFS File | Operator | Coverage |
|---|---|---|
| `gtfs_mvb_std_kn.zip` | **MVB** | Tram + city bus — all Magdeburg lines |
| `gtfs_kvg_std_kn.zip` | **KVG** | Regional bus around Magdeburg |
| `gtfs_njl_std_kn.zip` | **NJL** | Night and rural lines |
| `gtfs_pvgs_std_kn.zip` | **PVGS** | Regional bus, Salzlandkreis |
| `gtfs_boerdebus_std_kn.zip` | **Bördebus** | Landkreis Börde bus network |

Each ZIP: `routes.txt`, `trips.txt`, `stop_times.txt`, `stops.txt`, `calendar.txt`, `shapes.txt`

**Used on:** `/transportation`, `/map`

---

### 🚨 `data/Unfaelle/` — Traffic Accident Atlas

| File | Contents | Used on |
|---|---|---|
| `Magdeburg_Unfallatlas.geojson` | Every injury accident · georeferenced · 2017–2024 | `/safety`, `/ai-streetlights` |

**Key properties:**

| Property | Meaning |
|---|---|
| `UJAHR` | Year |
| `USTUNDE` | Hour (0–23) |
| `UWOCHENTAG` | Weekday (1=Sun … 7=Sat) |
| `UKATEGORIE` | Severity: 1=fatal, 2=serious, 3=minor |
| `IstFuss` / `IstRad` / `IstPKW` | Pedestrian / cyclist / car involved |

**Source:** Statistische Ämter — Datenlizenz Deutschland v2.0

---

### 🌳 `data/Baumkataster/` — City Tree Registry

| File | Contents | Used on |
|---|---|---|
| `Baumkataster.geojson` | Every city-managed tree — position, species, trunk diameter, crown width | `/ai-streetlights` |

---

### 🏙️ `data/Stadtteile/` — District Boundaries

| File | Contents | Used on |
|---|---|---|
| `Stadtteile.geojson` | Official polygon boundaries of all Magdeburg Stadtteile | `/map`, all choropleth overlays |

---

### 👥 `data/Zensus/` — Census 2022

| File | Contents | Used on |
|---|---|---|
| `ZensusBev.geojson` | Population density grid (100m cells) | `/insights` |
| `ZensusMiete.geojson` | Average rent per m² grid (100m cells) | `/housing` |

---

## 6. External Live APIs

All called directly from the browser — no proxy, no API key required.

| API | Provides | Endpoint |
|---|---|---|
| **Bright Sky / DWD** | Temperature, wind, condition, precipitation | `https://api.brightsky.dev/current_weather?lat=52.1205&lon=11.6276` |
| **Sensor.Community** | PM10 + PM2.5 from citizen sensors (10 km radius) | `https://data.sensor.community/airrohr/v1/filter/area=52.1205,11.6276,10` |
| **PEGELONLINE / WSV** | Live Elbe level + 7-day history | `https://www.pegelonline.wsv.de/webservices/rest-api/v2/stations/MAGDEBURG-STROMBR%C3%9CCKE/W/currentmeasurement.json` |
| **Overpass (OSM)** | Tram stops, streetlamps, bike parking | `https://overpass-api.de/api/interpreter` |
| **GovData CKAN** | Open dataset catalogue | `https://ckan.govdata.de/api/3/action/package_search?q=Magdeburg` |

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

// Air quality (WHO guideline: PM10 ≤ 45 µg/m³ · PM2.5 ≤ 15 µg/m³)
const sensors = await fetch(
  "https://data.sensor.community/airrohr/v1/filter/area=52.1205,11.6276,10"
).then(r => r.json());
// filter: value_type 'P1' = PM10 · 'P2' = PM2.5
```

---

## 7. Project Structure

```
app/
├── page.tsx               # Home — live KPI overview
├── map/                   # Unified transport + environment map
├── climate/               # DWD climate data (1950–2025)
├── housing/               # Mietspiegel 2024 rent index + Census grid
├── insights/              # Tax revenue & city finance
├── transportation/        # Multi-operator transit analytics (GTFS + KISS-MD)
├── safety/                # Accident heatmap 2017–2024 (Unfallatlas)
├── ai-streetlights/       # AI streetlight placement (Unfallatlas + Baumkataster)
├── barrierefreiheit/      # Accessibility map & district scores
├── events/                # City events (GovData integration planned)
└── projects/              # Smart city project tracker

components/                # Shared UI components
lib/                       # API clients (weather, pegelonline, sensor.community)
context/                   # Global state (language, theme)
```

---

## 8. Getting Started

```bash
git clone https://github.com/ayushtiwari18/Magbeburg-Smart-City-Project.git
cd Magbeburg-Smart-City-Project
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). **No environment variables or API keys required.**

---

## 9. Data Attribution

| Source | URL |
|---|---|
| SmartCityMagdeburg2026 Datasources | https://github.com/SmartCityMagdeburg2026/Datasources |
| Bright Sky (DWD) | https://brightsky.dev |
| Pegelonline WSV | https://www.pegelonline.wsv.de |
| Sensor.Community | https://sensor.community |
| Unfallatlas | https://unfallatlas.statistikportal.de |
| OpenStreetMap | https://www.openstreetmap.org © ODbL contributors |
| KISS-MD | Landeshauptstadt Magdeburg Statistikstelle |
| NASA GmbH (GTFS) | Nahverkehrsservice Sachsen-Anhalt GmbH |

---

*Built for the Smart City Magdeburg 2026 Hackathon. Application code MIT Licensed.*
