import { getLiveWeather, conditionLabel, conditionEmoji } from "@/lib/weather";
import { Wind, Droplets, Cloud, Thermometer } from "lucide-react";

export default async function WeatherWidget() {
  let weather;
  try {
    weather = await getLiveWeather();
  } catch {
    return null; // silently skip if API is down
  }

  const temp = weather.temperature != null ? `${weather.temperature.toFixed(1)}°C` : "—";
  const wind = weather.wind_speed != null ? `${weather.wind_speed} km/h` : "—";
  const precip = weather.precipitation != null ? `${weather.precipitation} mm` : "—";
  const clouds = weather.cloud_cover != null ? `${weather.cloud_cover}%` : "—";
  const emoji = conditionEmoji(weather.condition);
  const label = conditionLabel(weather.condition);

  return (
    <div className="rounded-[20px] border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Live Weather</p>
          <h3 className="text-lg font-bold text-[#061B46] mt-0.5">Magdeburg</h3>
        </div>
        <span className="text-4xl" role="img" aria-label={label}>{emoji}</span>
      </div>

      {/* Big temp */}
      <div className="px-5 pb-3">
        <div className="flex items-end gap-2">
          <span className="text-5xl font-bold text-[#061B46] tabular-nums">{temp}</span>
          <span className="mb-1.5 text-sm font-medium text-slate-500">{label}</span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 divide-x divide-slate-100 border-t border-slate-100">
        <div className="flex flex-col items-center gap-1 py-3 px-2">
          <Wind className="h-4 w-4 text-blue-400" />
          <span className="text-xs font-bold text-[#061B46] tabular-nums">{wind}</span>
          <span className="text-[10px] text-slate-400 uppercase tracking-wide">Wind</span>
        </div>
        <div className="flex flex-col items-center gap-1 py-3 px-2">
          <Droplets className="h-4 w-4 text-blue-400" />
          <span className="text-xs font-bold text-[#061B46] tabular-nums">{precip}</span>
          <span className="text-[10px] text-slate-400 uppercase tracking-wide">Precip.</span>
        </div>
        <div className="flex flex-col items-center gap-1 py-3 px-2">
          <Cloud className="h-4 w-4 text-blue-400" />
          <span className="text-xs font-bold text-[#061B46] tabular-nums">{clouds}</span>
          <span className="text-[10px] text-slate-400 uppercase tracking-wide">Clouds</span>
        </div>
      </div>

      {/* Source */}
      <p className="px-5 py-2 text-[10px] text-slate-400 border-t border-slate-100">
        Source: Bright Sky / DWD · Updates every 10 min
      </p>
    </div>
  );
}
