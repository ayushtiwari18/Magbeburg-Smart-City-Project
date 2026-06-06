const facts = [
  {
    emoji: "🚌",
    value: "5 Networks",
    plain: "Bus & tram lines cover the whole city — no car needed",
  },
  {
    emoji: "🌡️",
    value: "+1.8°C warmer",
    plain: "Magdeburg has warmed since the 1950s — climate change is real here",
  },
  {
    emoji: "🏢",
    value: "12,745 businesses",
    plain: "A thriving local economy with jobs across every sector",
  },
  {
    emoji: "💡",
    value: "Smart Streetlights",
    plain: "Lights that dim when nobody is around — saving energy every night",
  },
];

export default function CitySnapshot() {
  return (
    <section className="bg-white border-y border-slate-100 py-4">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-20">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
          Magdeburg at a Glance
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {facts.map((f) => (
            <div
              key={f.value}
              className="flex items-start gap-3 rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3"
            >
              <span className="text-2xl flex-shrink-0" role="img">{f.emoji}</span>
              <div>
                <p className="text-sm font-bold text-[#061B46] leading-tight">{f.value}</p>
                <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">{f.plain}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
