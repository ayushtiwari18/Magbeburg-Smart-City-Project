# Smart City Magdeburg 2026

A Next.js dashboard presenting real open data for the city of Magdeburg — built for the **Smart City Hackathon 2026**.

🌐 **Live site:** [magbeburg-smart-city-project.vercel.app](https://magbeburg-smart-city-project.vercel.app)

---

## Pages & Data Sources

Every page that shows real data fetches it directly at runtime — no data is bundled into the app. The table below maps each page to its exact data source.

| Page | Route | Real Data Used | Source |
|---|---|---|---|
| **Climate** | `/climate` | Monthly mean temperature (`MO_TT`), monthly precipitation (`MO_RR`), monthly wind (`MO_FK`) · Station 03126 · 1950–2025 | [`data/sensor-data/json/klima-monat.json`](https://github.com/SmartCityMagdeburg2026/Datasources/tree/main/data/sensor-data) · DWD Climate Data Center |
| **Housing** | `/housing` | Net cold rent per m² by district, floor-area class, and year · 37 districts · 2012–2026; Census 2022 rent density grid (ZensusMiete) | [`data/mietspiegel-2024/nach-wohnflaeche.json`](https://github.com/SmartCityMagdeburg2026/Datasources/tree/main/data/mietspiegel-2024) · [`data/Zensus/ZensusMiete.geojson`](https://github.com/SmartCityMagdeburg2026/Datasources/tree/main/data/Zensus) |
| **Insights** | `/insights` | Annual tax revenue breakdown · 2010–2025; Census 2022 population grid (ZensusBev) | [`data/steuereinnahmen/json/steuereinnahmen-2010-2025.json`](https://github.com/SmartCityMagdeburg2026/Datasources/tree/main/data/steuereinnahmen) · [`data/Zensus/ZensusBev.geojson`](https://github.com/SmartCityMagdeburg2026/Datasources/tree/main/data/Zensus) |
| **Map** | `/map` | Live weather, live air quality, tram stop locations, district boundaries overlay | [Bright Sky / DWD API](https://brightsky.dev) · [Sensor.Community API](https://sensor.community) · [`data/Stadtteile/Stadtteile.geojson`](https://github.com/SmartCityMagdeburg2026/Datasources/tree/main/data/Stadtteile) |
| **Transportation** | `/transportation` | **GTFS schedules** for MVB (tram + city bus), KVG, NJL, PVGS, Bördebus — routes, stops, timetables; stop locations (Haltestellen, PlusBus, Taktbus); MVB annual ridership; vehicle fleet by fuel type (EV trend); cars per district | [`data/OEV-Daten_NASA_GmbH/GTFS/`](https://github.com/SmartCityMagdeburg2026/Datasources/tree/main/data/OEV-Daten_NASA_GmbH/GTFS) · [`data/OEV-Daten_NASA_GmbH/Haltestellen/`](https://github.com/SmartCityMagdeburg2026/Datasources/tree/main/data/OEV-Daten_NASA_GmbH/Haltestellen) · [`data/kiss-md/json/verkehr/`](https://github.com/SmartCityMagdeburg2026/Datasources/tree/main/data/kiss-md/json/verkehr) |
| **Safety** | `/safety` | **Georeferenced accident points** (GeoJSON, 2017–2024) with severity, cause, participant type; accident counts by district, hour, weekday, cause | [`data/Unfaelle/Magdeburg_Unfallatlas.geojson`](https://github.com/SmartCityMagdeburg2026/Datasources/tree/main/data/Unfaelle) · [`data/kiss-md/json/verkehr/`](https://github.com/SmartCityMagdeburg2026/Datasources/tree/main/data/kiss-md/json/verkehr) |
| **AI Streetlights** | `/ai-streetlights` | Accident hotspot map (same GeoJSON); road infrastructure stats; city tree positions (Baumkataster — shadows, obstructions) | [`data/Unfaelle/Magdeburg_Unfallatlas.geojson`](https://github.com/SmartCityMagdeburg2026/Datasources/tree/main/data/Unfaelle) · [`data/Baumkataster/Baumkataster.geojson`](https://github.com/SmartCityMagdeburg2026/Datasources/tree/main/data/Baumkataster) · [`data/kiss-md/json/verkehr/strassen-und-verkehrsanlagen.json`](https://github.com/SmartCityMagdeburg2026/Datasources/tree/main/data/kiss-md/json/verkehr) |
| **Projects** | `/projects` | Static content — no automated dataset available | Manually curated from [Digitale Modellregion Magdeburg](https://www.magdeburg.de) |
| **Events** | `/events` | Static content | [GovData CKAN API](https://ckan.govdata.de/api/3/action/package_search?q=Magdeburg) (planned) |

---

## Data Repository

All static datasets are sourced from the official hackathon data repository:

**[github.com/SmartCityMagdeburg2026/Datasources](https://github.com/SmartCityMagdeburg2026/Datasources)**

Raw files are fetched at runtime via:
```
https://raw.githubusercontent.com/SmartCityMagdeburg2026/Datasources/main/data/<path>
```

No API key or authentication is required for any of these datasets.

---

## All Available Datasets — Full Inventory

### 🚌 `data/OEV-Daten_NASA_GmbH/` — Public Transit (NEW)

Provided by **NASA GmbH** (Nahverkehrsservice Sachsen-Anhalt), the regional transit authority.

#### GTFS feeds (`GTFS/`)

| File | Operator | Coverage |
|---|---|---|
| `gtfs_mvb_std_kn.zip` | **MVB** (Magdeburger Verkehrsbetriebe) | Tram + city bus — all lines in Magdeburg |
| `gtfs_kvg_std_kn.zip` | **KVG** (Kraftverkehrsgesellschaft) | Regional bus routes around Magdeburg |
| `gtfs_njl_std_kn.zip` | **NJL** | Night and rural lines |
| `gtfs_pvgs_std_kn.zip` | **PVGS** | Regional bus, Salzlandkreis area |
| `gtfs_boerdebus_std_kn.zip` | **Bördebus** | Landkreis Börde bus network |

Each ZIP contains standard GTFS files: `routes.txt`, `trips.txt`, `stop_times.txt`, `stops.txt`, `calendar.txt`, `shapes.txt`.

**Use for:** tram route map, multimodal routing, live departure boards, stop-by-stop journey planner.

```js
// Parse GTFS in the browser with gtfs-utils or server-side with gtfs npm package
import { parseGtfs } from 'gtfs-utils';
const mvbGtfs = await fetch(BASE + 'data/OEV-Daten_NASA_GmbH/GTFS/gtfs_mvb_std_kn.zip');
```

#### Stop locations (`Haltestellen/`)

| Subfolder | Contents |
|---|---|
| `ST/` | All stops in Saxony-Anhalt state (Sachsen-Anhalt) |
| `PlusBus/` | PlusBus stops — high-frequency regional bus network |
| `Taktbus/` | Taktbus stops — clockface-interval rural bus services |

---

### 🗺️ `data/Unfaelle/` — Accident Atlas GeoJSON (NEW)

| File | What it contains |
|---|---|
| `Magdeburg_Unfallatlas.geojson` | Every road accident **with personal injury** in Magdeburg, georeferenced as points — 2017–2024 |

**Source:** Unfallatlas der Statistischen Ämter des Bundes und der Länder · License: Datenlizenz Deutschland v2.0 · © Statistische Ämter

**Key GeoJSON properties per feature:**

| Property | Meaning |
|---|---|
| `XGCSWGS84` / `YGCSWGS84` | WGS84 longitude / latitude |
| `UJAHR` | Year of accident |
| `UMONAT` | Month |
| `USTUNDE` | Hour of day |
| `UWOCHENTAG` | Day of week (1 = Sunday) |
| `UKATEGORIE` | Severity: 1 = fatality, 2 = serious injury, 3 = minor injury |
| `UART` | Accident type (collision, run-off-road, etc.) |
| `UTYP1` | Accident category (pedestrian, cyclist, vehicle) |
| `IstFuss` | 1 if pedestrian involved |
| `IstRad` | 1 if cyclist involved |
| `IstPKW` | 1 if car involved |
| `IstKrad` | 1 if motorcycle involved |

**Use for:** `/safety` hotspot map (Leaflet GeoJSON layer), `/ai-streetlights` dark-spot analysis, heatmap by hour/weekday.

```js
const accidents = await fetch(BASE + 'data/Unfaelle/Magdeburg_Unfallatlas.geojson').then(r => r.json());
// accidents.features — each is a Point with above properties
```

---

### 🌳 `data/Baumkataster/` — City Tree Registry (NEW)

| File | What it contains |
|---|---|
| `Baumkataster.geojson` | Every registered city-managed tree in Magdeburg with position, species, and size |

**Use for:** `/ai-streetlights` (tree canopy blocking streetlight coverage), green infrastructure map, urban heat analysis.

---

### 🏘️ `data/Stadtteile/` — District Boundaries (NEW)

| File | What it contains |
|---|---|
| `Stadtteile.geojson` | Official polygon boundaries of all Magdeburg city districts (Stadtteile) |

**Use for:** Any choropleth map (accidents per district, rent by district, population density). Load once and join with statistical data by district name/ID.

```js
const districts = await fetch(BASE + 'data/Stadtteile/Stadtteile.geojson').then(r => r.json());
// Use as base layer in Leaflet: L.geoJSON(districts)
```

---

### 👥 `data/Zensus/` — Census 2022 Grid Data (NEW)

| File | What it contains |
|---|---|
| `ZensusBev.geojson` | Population density grid (100m cells) across Magdeburg — Census 2022 |
| `ZensusMiete.geojson` | Rent level grid (100m cells) — average rent per m² per grid cell — Census 2022 |

**Use for:** `/insights` population heatmap, `/housing` rent distribution map, neighbourhood-level analysis.

---

### ☕ `data/CafesOSM/` — Cafés from OpenStreetMap (NEW)

OSM-sourced café locations across Magdeburg. **Use for:** `/map` points of interest layer, walkability/amenity analysis for Smart City context.

---

### 📊 Existing datasets (unchanged)

| Directory | Contents |
|---|---|
| `data/kiss-md/json/` | 322 city statistics datasets across 13 categories (population, transport, economy, housing…) |
| `data/sensor-data/json/klima-monat.json` | DWD monthly climate data 1950–2025 |
| `data/steuereinnahmen/json/` | City tax revenue 2010–2025 + multipliers 1991–2026 |
| `data/mietspiegel-2024/json/` | Rent index 2024 by district and floor area |

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
├── housing/          # Mietspiegel rent index + Zensus rent grid
├── insights/         # Tax revenue chart + Zensus population grid
├── map/              # Leaflet map + live weather + air quality + district boundaries
├── safety/           # Unfallatlas GeoJSON hotspot map + KISS-MD accident stats
├── transportation/   # GTFS tram/bus routes + MVB ridership + EV fleet trend
├── ai-streetlights/  # Accident dark-spots + Baumkataster tree coverage
├── projects/         # City project listings (static)
├── events/           # City events (static)
└── layout.tsx        # Root layout with nav

components/
├── layout/           # Container, Navbar, Footer
└── ui/               # Shared UI components

lib/
└── pedestrian-zones.ts  # Legacy placeholder — superseded by Unfallatlas GeoJSON
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

### `Magdeburg_Unfallatlas.geojson` (Safety — Accident Atlas)
| Property | Meaning |
|---|---|
| `UJAHR` | Year of accident |
| `USTUNDE` | Hour of day (0–23) |
| `UWOCHENTAG` | Weekday (1=Sun … 7=Sat) |
| `UKATEGORIE` | Severity: 1=fatal, 2=serious, 3=minor |
| `UART` | Accident type code |
| `IstFuss` / `IstRad` / `IstPKW` | Pedestrian / cyclist / car involved (0 or 1) |

### GTFS feeds — `OEV-Daten_NASA_GmbH/GTFS/*.zip`
| File inside ZIP | Contents |
|---|---|
| `stops.txt` | Stop ID, name, lat, lon |
| `routes.txt` | Route ID, short name, type (0=tram, 3=bus) |
| `trips.txt` | Trip ID → route + service |
| `stop_times.txt` | Arrival/departure per stop per trip |
| `shapes.txt` | Route geometry as polyline points |
| `calendar.txt` | Service days (Mon–Sun) |

### KISS-MD Verkehr files (Transportation & Safety)

All files under `data/kiss-md/json/verkehr/` follow the standard KISS-MD envelope:

```json
{
  "columns": [ { "id": "var1", "label": "...", "unit": "...", "role": "..." } ],
  "rows":    [ { "var1": 2020, "var2": 12345 } ]
}
```

| File | Page | Key columns |
|---|---|---|
| `befoerderte-personen-der-magdeburger-verkehrsbetriebe-gmbh-und-co-kg.json` | `/transportation` | Year, total passengers, tram, bus |
| `fahrzeugbestand-nach-kraftstoff-und-schadstoffgruppen-plakette.json` | `/transportation` | Year, fuel type (Benzin/Diesel/Elektro/Hybrid), count |
| `kraftfahrzeugbestand-aufgeschluesselt-nach-stadtteilen.json` | `/transportation` | Year, Stadtteil, total vehicles |
| `innerstaedtischer-nahverkehr.json` | `/transportation` | Year, line count, km operated, capacity |
| `vertriebskennziffern-des-magdeburger-hauptbahnhofs.json` | `/transportation` | Year, tickets sold, revenue |
| `strassenverkehrsunfaelle-in-magdeburg-gesamt.json` | `/safety` | Year, total accidents, injured, killed |
| `unfallgeschehen-in-der-stadt-magdeburg-nach-stadtteilen.json` | `/safety` | Year, Stadtteil, accident count |
| `verkehrsunfaelle-aufgeteilt-nach-uhrzeiten.json` | `/safety` | Hour (0–23), accident count |
| `verkehrsunfaelle-mit-sachschaden-nach-wochentagen.json` | `/safety` | Weekday, accident count |
| `unfaelle-nach-ausgewaehlten-ursachen.json` | `/safety` | Year, cause (speeding/alcohol/distraction…), count |
| `strassen-und-verkehrsanlagen.json` | `/ai-streetlights` | Total road km, intersection count, street categories |

> **Note:** `null` values in the rent index indicate a sample size too small for a statistically meaningful average — filter before display. KISS-MD `null` values in numeric columns indicate missing/suppressed data for the same reason.

---

## License

Data © respective data providers (DWD, Landeshauptstadt Magdeburg, NASA GmbH, Statistische Ämter des Bundes und der Länder, Sensor.Community, OpenStreetMap contributors). Application code MIT.
