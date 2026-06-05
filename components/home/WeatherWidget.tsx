import { getLiveWeather, conditionLabel, conditionEmoji } from "@/lib/weather";
import { Wind, Droplets, Cloud } from "lucide-react";

export default async function WeatherWidget() {
  let weather;
  try {
    weather = await getLiveWeather();
  } catch {
    return null;
  }

  const temp    = weather.temperature   != null ? `${weather.temperature.toFixed(1)}°C` : "—";
  const wind    = weather.wind_speed    != null ? `${weather.wind_speed} km/h`          : "—";
  const precip  = weather.precipitation != null ? `${weather.precipitation} mm`         : "—";
  const clouds  = weather.cloud_cover   != null ? `${weather.cloud_cover}%`             : "—";
  const emoji   = conditionEmoji(weather.condition);
  const label   = conditionLabel(weather.condition);

  return (
    <section className="bg-white border-b border-slate-100">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-20 py-6">
        {/* Label */}
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
          Live Weather · Magdeburg
        </p>

        {/* Weather bar */}
        <div className="flex flex-wrap items-center gap-6 rounded-[20px] border border-slate-200 bg-[#f8fafc] px-6 py-4 shadow-sm">
          {/* Condition + Temp */}
          <div className="flex items-center gap-3 min-w-[120px]">
            <span className="text-3xl" role="img" aria-label={label}>{emoji}</span>
            <div>
              <p className="text-2xl font-bold text-[#061B46] tabular-nums leading-none">{temp}</p>
              <p className="text-xs text-slate-500 mt-0.5">{label}</p>
            </div>
          </div>

          <div className="h-8 w-px bg-slate-200 hidden sm:block" />

          {/* Wind */}
          <div className="flex items-center gap-2">
            <Wind className="h-4 w-4 text-blue-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-[#061B46] tabular-nums">{wind}</p>
              <p className="text-[10px] uppercase tracking-wide text-slate-400">Wind</p>
            </div>
          </div>

          {/* Precipitation */}
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-blue-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-[#061B46] tabular-nums">{precip}</p>
              <p className="text-[10px] uppercase tracking-wide text-slate-400">Precip.</p>
            </div>
          </div>

          {/* Cloud cover */}
          <div className="flex items-center gap-2">
            <Cloud className="h-4 w-4 text-blue-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-[#061B46] tabular-nums">{clouds}</p>
              <p className="text-[10px] uppercase tracking-wide text-slate-400">Clouds</p>
            </div>
          </div>

          <div className="ml-auto text-[10px] text-slate-400 hidden lg:block">
            Source: Bright Sky / DWD · Updates every 10 min
          </div>
        </div>
      </div>
    </section>
  );
}
