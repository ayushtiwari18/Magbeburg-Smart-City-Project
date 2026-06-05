export type WeatherData = {
  temperature: number | null;
  wind_speed: number | null;
  wind_direction: number | null;
  precipitation: number | null;
  cloud_cover: number | null;
  condition: string | null;
  icon: string | null;
  timestamp: string | null;
};

export async function getLiveWeather(): Promise<WeatherData> {
  const res = await fetch(
    "https://api.brightsky.dev/current_weather?lat=52.1205&lon=11.6276",
    { next: { revalidate: 600 } }  // cache 10 min
  );
  if (!res.ok) throw new Error("Weather fetch failed");
  const { weather } = await res.json();
  return weather as WeatherData;
}

/** Map BrightSky condition strings to a human-readable label */
export function conditionLabel(condition: string | null): string {
  const map: Record<string, string> = {
    dry: "Clear",
    fog: "Fog",
    rain: "Rain",
    sleet: "Sleet",
    snow: "Snow",
    hail: "Hail",
    thunderstorm: "Thunderstorm",
    "null": "—",
  };
  return condition ? (map[condition] ?? condition) : "—";
}

/** Returns a simple emoji for the condition */
export function conditionEmoji(condition: string | null): string {
  const map: Record<string, string> = {
    dry: "☀️",
    fog: "🌫️",
    rain: "🌧️",
    sleet: "🌨️",
    snow: "❄️",
    hail: "🌩️",
    thunderstorm: "⛈️",
  };
  return condition ? (map[condition] ?? "🌡️") : "🌡️";
}
