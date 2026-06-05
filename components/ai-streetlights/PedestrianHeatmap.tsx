'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { simulatePedestrianData, ZoneState } from '@/lib/pedestrian-zones';
import { Activity, Zap, Users, Lightbulb, TrendingUp, TrendingDown, Minus, Radio } from 'lucide-react';

// ─── Colour helpers ───────────────────────────────────────────────────────────
function heatColour(count: number): string {
  if (count === 0) return 'rgba(30,41,59,0.0)';
  if (count < 10)  return `rgba(251,191,36,${0.15 + count * 0.015})`;
  if (count < 30)  return `rgba(249,115,22,${0.25 + count * 0.008})`;
  if (count < 60)  return `rgba(239,68,68,${0.35 + count * 0.004})`;
  return `rgba(220,38,38,0.85)`;
}

function lightColour(brightness: number): string {
  if (brightness <= 20) return '#1e293b';
  if (brightness <= 45) return '#a3e635';
  if (brightness <= 70) return '#facc15';
  if (brightness <= 88) return '#fb923c';
  return '#f9a8d4';
}

const STATUS_BADGE: Record<ZoneState['status'], string> = {
  empty:  'bg-slate-800 text-slate-400',
  low:    'bg-yellow-900/60 text-yellow-300',
  active: 'bg-orange-900/60 text-orange-300',
  busy:   'bg-red-900/60   text-red-300',
};

// ─── Heatmap Canvas ───────────────────────────────────────────────────────────
function HeatCanvas({ zones }: { zones: ZoneState[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);

    // Dark night background
    ctx.fillStyle = '#0a0f1e';
    ctx.fillRect(0, 0, W, H);

    // Draw Elbe river suggestion
    ctx.beginPath();
    ctx.moveTo(W * 0.56, 0);
    ctx.bezierCurveTo(W * 0.60, H * 0.3, W * 0.58, H * 0.6, W * 0.62, H);
    ctx.strokeStyle = 'rgba(59,130,246,0.18)';
    ctx.lineWidth = 18;
    ctx.stroke();

    // Heat blobs per zone
    zones.forEach((z) => {
      if (z.pedestrianCount === 0) return;
      const x = (z.cx / 100) * W;
      const y = (z.cy / 100) * H;
      const r = ((z.radius / 100) * W) * (1 + z.pedestrianCount / 80);

      const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
      grad.addColorStop(0, heatColour(z.pedestrianCount));
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    });

    // Zone dots + light glow
    zones.forEach((z) => {
      const x = (z.cx / 100) * W;
      const y = (z.cy / 100) * H;
      const col = lightColour(z.brightness);

      // Glow
      if (z.brightness > 20) {
        const glow = ctx.createRadialGradient(x, y, 0, x, y, 22);
        glow.addColorStop(0, col.replace(')', ',0.35)').replace('rgb', 'rgba'));
        glow.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.beginPath();
        ctx.arc(x, y, 22, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();
      }

      // Dot
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = col;
      ctx.fill();

      // Label
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.font = '9px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(z.name, x, y + 16);
    });
  }, [zones]);

  return (
    <canvas
      ref={canvasRef}
      width={680}
      height={440}
      className="w-full h-full rounded-xl"
      style={{ imageRendering: 'crisp-edges' }}
    />
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function PedestrianHeatmap() {
  const [zones, setZones] = useState<ZoneState[]>(() => simulatePedestrianData());
  const [tick,  setTick]  = useState(0);
  const [live,  setLive]  = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const refresh = useCallback(() => {
    setZones(simulatePedestrianData());
    setTick(t => t + 1);
  }, []);

  useEffect(() => {
    if (!live) { if (intervalRef.current) clearInterval(intervalRef.current); return; }
    intervalRef.current = setInterval(refresh, 3000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [live, refresh]);

  // Derived KPIs
  const totalPedestrians = zones.reduce((s, z) => s + z.pedestrianCount, 0);
  const activeZones      = zones.filter(z => z.status !== 'empty').length;
  const avgBrightness    = Math.round(zones.reduce((s, z) => s + z.brightness, 0) / zones.length);
  const energySaved      = Math.round((1 - avgBrightness / 100) * 60);

  const TrendIcon = ({ trend }: { trend: ZoneState['trend'] }) =>
    trend === 'up'   ? <TrendingUp   className="w-3.5 h-3.5 text-red-400" /> :
    trend === 'down' ? <TrendingDown className="w-3.5 h-3.5 text-green-400" /> :
                       <Minus        className="w-3.5 h-3.5 text-slate-400" />;

  return (
    <section className="rounded-3xl overflow-hidden border border-slate-700/60 bg-[#0d1117] shadow-2xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            {live && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />}
            <span className={`relative inline-flex rounded-full h-3 w-3 ${live ? 'bg-green-400' : 'bg-slate-500'}`} />
          </span>
          <h2 className="text-white font-semibold text-lg">Night Pedestrian Detection</h2>
          <span className="text-xs text-slate-400 font-mono">tick #{tick}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLive(l => !l)}
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              live
                ? 'bg-green-500/20 text-green-300 hover:bg-green-500/30'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            {live ? 'Live' : 'Paused'}
          </button>
          <button
            onClick={refresh}
            className="rounded-full px-4 py-1.5 text-sm font-medium bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-slate-700/50 border-b border-slate-700/50">
        {[
          { icon: Users,     label: 'Pedestrians Detected', value: totalPedestrians,     unit: '' },
          { icon: Activity,  label: 'Active Zones',         value: `${activeZones}/12`,  unit: '' },
          { icon: Lightbulb, label: 'Avg Brightness',       value: avgBrightness,         unit: '%' },
          { icon: Zap,       label: 'Energy Saved Tonight', value: energySaved,            unit: '%' },
        ].map(({ icon: Icon, label, value, unit }) => (
          <div key={label} className="flex flex-col items-center justify-center py-5 px-4 gap-1">
            <Icon className="w-5 h-5 text-violet-400 mb-1" />
            <span className="text-2xl font-bold text-white tabular-nums">{value}{unit}</span>
            <span className="text-xs text-slate-400 text-center">{label}</span>
          </div>
        ))}
      </div>

      {/* Map + Zone cards */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px]">
        {/* Heatmap */}
        <div className="relative p-4 min-h-[320px]">
          <HeatCanvas zones={zones} />
          <div className="absolute bottom-6 left-6 flex items-center gap-3 rounded-xl bg-black/60 px-3 py-2 backdrop-blur-sm">
            <span className="text-xs text-slate-300 font-medium">Density</span>
            {['#facc15','#fb923c','#ef4444','#991b1b'].map((c, i) => (
              <span key={i} className="flex items-center gap-1">
                <span className="inline-block w-3 h-3 rounded-full" style={{ background: c }} />
                <span className="text-xs text-slate-400">{['Low','Med','High','Peak'][i]}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Zone cards */}
        <div className="border-l border-slate-700/50 overflow-y-auto max-h-[440px] divide-y divide-slate-700/30">
          {zones
            .slice()
            .sort((a, b) => b.pedestrianCount - a.pedestrianCount)
            .map((z) => (
              <div key={z.id} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800/40 transition-colors">
                {/* Light indicator */}
                <div
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: lightColour(z.brightness) + '22', border: `2px solid ${lightColour(z.brightness)}` }}
                >
                  <Lightbulb className="w-4 h-4" style={{ color: lightColour(z.brightness) }} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-sm font-medium text-white truncate">{z.name}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${STATUS_BADGE[z.status]}`}>
                      {z.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Users className="w-3 h-3 text-slate-500" />
                    <span className="text-xs text-slate-300 tabular-nums">{z.pedestrianCount}</span>
                    <TrendIcon trend={z.trend} />
                    <span className="ml-auto text-xs text-slate-400 tabular-nums">{z.brightness}% bright</span>
                  </div>

                  {/* Brightness bar */}
                  <div className="mt-1.5 h-1 w-full rounded-full bg-slate-700">
                    <div
                      className="h-1 rounded-full transition-all duration-700"
                      style={{
                        width: `${z.brightness}%`,
                        background: lightColour(z.brightness),
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="px-6 py-3 border-t border-slate-700/50 text-xs text-slate-500">
        Updates every 3 s · Simulated sensor data · Replace <code className="text-slate-400">simulatePedestrianData()</code> in <code className="text-slate-400">lib/pedestrian-zones.ts</code> with real sensor feed
      </div>
    </section>
  );
}
