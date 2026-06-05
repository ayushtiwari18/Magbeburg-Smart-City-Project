// Magdeburg zone definitions for pedestrian detection + adaptive streetlights
// Swap simulatePedestrianData() output with real sensor/API feed

export interface Zone {
  id: string;
  name: string;
  // Canvas-relative position (0-100%)
  cx: number;
  cy: number;
  radius: number;
  // Approx real lat/lng centre
  lat: number;
  lng: number;
}

export interface ZoneState extends Zone {
  pedestrianCount: number;
  brightness: number;  // 0-100 %
  trend: 'up' | 'down' | 'stable';
  lastDetection: Date;
  status: 'empty' | 'low' | 'active' | 'busy';
}

export const ZONES: Zone[] = [
  { id: 'altstadt',      name: 'Altstadt',         cx: 48, cy: 45, radius: 7, lat: 52.1316, lng: 11.6401 },
  { id: 'neustadt',      name: 'Neustadt',          cx: 36, cy: 30, radius: 6, lat: 52.1462, lng: 11.6272 },
  { id: 'sudenburg',     name: 'Sudenburg',         cx: 38, cy: 62, radius: 6, lat: 52.1108, lng: 11.6244 },
  { id: 'buckau',        name: 'Buckau',            cx: 55, cy: 70, radius: 5, lat: 52.1041, lng: 11.6438 },
  { id: 'stadtfeld-ost', name: 'Stadtfeld Ost',     cx: 30, cy: 48, radius: 5, lat: 52.1290, lng: 11.6132 },
  { id: 'stadtfeld-west',name: 'Stadtfeld West',    cx: 20, cy: 42, radius: 5, lat: 52.1310, lng: 11.5980 },
  { id: 'cracau',        name: 'Cracau',            cx: 70, cy: 44, radius: 5, lat: 52.1300, lng: 11.6680 },
  { id: 'rothensee',     name: 'Rothensee',         cx: 62, cy: 18, radius: 4, lat: 52.1700, lng: 11.6550 },
  { id: 'salbke',        name: 'Salbke',            cx: 60, cy: 82, radius: 4, lat: 52.0870, lng: 11.6520 },
  { id: 'lemsdorf',      name: 'Lemsdorf',          cx: 45, cy: 85, radius: 4, lat: 52.0820, lng: 11.6390 },
  { id: 'diesdorf',      name: 'Diesdorf',          cx: 15, cy: 62, radius: 4, lat: 52.1100, lng: 11.5820 },
  { id: 'olvenstedt',    name: 'Olvenstedt',        cx: 22, cy: 22, radius: 4, lat: 52.1550, lng: 11.5930 },
];

// Simulate realistic night pedestrian patterns (23:00 – 03:00 scenario)
// Higher activity near Altstadt, Neustadt, Sudenburg (entertainment/transit hubs)
const BASE_ACTIVITY: Record<string, number> = {
  altstadt: 72, neustadt: 58, sudenburg: 44, buckau: 18,
  'stadtfeld-ost': 22, 'stadtfeld-west': 14, cracau: 11,
  rothensee: 6, salbke: 8, lemsdorf: 7, diesdorf: 9, olvenstedt: 13,
};

let prevCounts: Record<string, number> = {};

export function simulatePedestrianData(): ZoneState[] {
  return ZONES.map((zone) => {
    const base = BASE_ACTIVITY[zone.id] ?? 10;
    // Random walk ±30% from base with occasional spikes
    const spike = Math.random() < 0.08 ? base * 0.6 : 0;
    const noise = (Math.random() - 0.5) * base * 0.6;
    const count = Math.max(0, Math.round(base + noise + spike));

    const prev = prevCounts[zone.id] ?? count;
    const trend: ZoneState['trend'] =
      count > prev + 2 ? 'up' : count < prev - 2 ? 'down' : 'stable';
    prevCounts[zone.id] = count;

    // Brightness tiers
    const brightness =
      count === 0 ? 20
      : count < 10 ? 45
      : count < 30 ? 70
      : count < 60 ? 88
      : 100;

    const status: ZoneState['status'] =
      count === 0 ? 'empty'
      : count < 10 ? 'low'
      : count < 40 ? 'active'
      : 'busy';

    return {
      ...zone,
      pedestrianCount: count,
      brightness,
      trend,
      lastDetection: new Date(),
      status,
    };
  });
}
