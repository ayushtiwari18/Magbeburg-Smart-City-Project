"use client";
import { useEffect, useState, useRef } from "react";
import { Home, ChevronUp, ChevronDown, Search, TrendingUp, TrendingDown, MapPin } from "lucide-react";

const RAW = "https://raw.githubusercontent.com/SmartCityMagdeburg2026/Datasources/main/data";

type RentRow = {
  stadtteil: string;
  wohnflaechenklasse: string;
  year: number;
  nettokaltmiete_pro_qm: number | null;
  stichprobengroesse: number | null;
};
type Summary = { stadtteil: string; avg: number; min: number; max: number };

function rentColor(avg: number) {
  if (avg < 6)  return { hex: "#22c55e", label: "Affordable",    glow: "#22c55e" };
  if (avg < 8)  return { hex: "#eab308", label: "Moderate",      glow: "#eab308" };
  if (avg < 10) return { hex: "#f97316", label: "Expensive",     glow: "#f97316" };
  return             { hex: "#ef4444", label: "Very Expensive",  glow: "#ef4444" };
}

// ── Animated SVG city skyline ──────────────────────────────────────────────
function CitySkyline() {
  return (
    <svg viewBox="0 0 800 160" style={{ width:"100%",height:160,display:"block" }} preserveAspectRatio="xMidYMax meet">
      <defs>
        <linearGradient id="bldGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e3a5f"/><stop offset="100%" stopColor="#0f2952"/>
        </linearGradient>
        <linearGradient id="bldGrad2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a3050"/><stop offset="100%" stopColor="#0a1e3a"/>
        </linearGradient>
      </defs>

      {/* moon */}
      <circle cx="720" cy="28" r="18" fill="rgba(253,224,71,0.10)"/>
      <circle cx="720" cy="28" r="13" fill="rgba(253,224,71,0.22)" style={{ filter:"drop-shadow(0 0 8px rgba(253,224,71,0.5))" }}/>

      {/* stars */}
      {[[60,20],[140,12],[260,8],[380,18],[500,10],[600,22],[680,15],[90,35],[310,28]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r="1.2" fill="rgba(255,255,255,0.6)" style={{ animation:`twinkle ${1.5+i*0.3}s ease-in-out infinite`,animationDelay:`${i*0.2}s` }}/>
      ))}

      {/* back buildings */}
      {[[0,90,55,70],[60,70,40,90],[105,80,50,80],[160,60,35,100],[200,75,45,85],[250,55,60,105],
        [315,85,40,75],[360,65,55,95],[420,78,45,82],[470,50,65,110],[540,70,40,90],
        [585,60,55,100],[645,80,50,80],[700,68,45,92],[750,88,50,72]
      ].map(([x,y,w,h],i)=>(
        <rect key={i} x={x} y={y} width={w} height={h} rx="2" fill="url(#bldGrad2)" opacity="0.55"/>
      ))}

      {/* front buildings */}
      {[[10,105,50,55],[70,88,45,72],[120,95,55,65],[180,72,40,88],[225,85,50,75],
        [280,62,65,98],[350,92,42,68],[398,75,58,85],[462,88,48,72],[515,58,62,102],
        [582,80,45,80],[632,68,55,92],[692,85,50,75],[748,98,52,62]
      ].map(([x,y,w,h],i)=>(
        <rect key={i} x={x} y={y} width={w} height={h} rx="2" fill="url(#bldGrad)"/>
      ))}

      {/* windows */}
      {[[20,112],[30,112],[20,122],[30,122],[80,96],[90,96],[80,106],[90,106],
        [130,103],[145,103],[190,80],[200,80],[190,90],[200,90],[290,70],[305,70],
        [290,82],[305,82],[408,82],[422,82],[408,94],[422,94],[525,65],[540,65],
        [525,78],[540,78],[525,91],[540,91],[642,76],[655,76],[642,88],[655,88],
      ].map(([wx,wy],i)=>(
        <rect key={i} x={wx} y={wy} width="5" height="4" rx="1"
          fill={i%3===0?"rgba(253,224,71,0.85)":i%3===1?"rgba(147,197,253,0.65)":"rgba(253,224,71,0.45)"}
          style={{ animation:`winBlink ${2+i*0.15}s ease-in-out infinite`,animationDelay:`${i*0.1}s` }}/>
      ))}

      {/* antenna */}
      <line x1="547" y1="58" x2="547" y2="45" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
      <circle cx="547" cy="44" r="2.5" fill="#ef4444" style={{ animation:"ping 2s ease-in-out infinite" }}/>

      {/* ground */}
      <rect x="0" y="158" width="800" height="2" fill="rgba(255,255,255,0.07)"/>
    </svg>
  );
}

// ── Floating house particles canvas ───────────────────────────────────────
function HouseParticles() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d"); if (!ctx) return;
    let W = c.offsetWidth, H = c.offsetHeight;
    c.width = W; c.height = H;
    const resize = () => { W = c.offsetWidth; H = c.offsetHeight; c.width = W; c.height = H; };
    window.addEventListener("resize", resize);
    type P = { x:number;y:number;vx:number;vy:number;size:number;opacity:number;rot:number;vrot:number };
    const pts: P[] = Array.from({length:16},()=>({
      x:Math.random()*1200, y:Math.random()*160,
      vx:(Math.random()-0.5)*0.4, vy:-(0.15+Math.random()*0.25),
      size:8+Math.random()*14, opacity:0.07+Math.random()*0.15,
      rot:Math.random()*Math.PI*2, vrot:(Math.random()-0.5)*0.01,
    }));
    let raf=0;
    const drawHouse=(x:number,y:number,s:number,op:number,r:number)=>{
      ctx.save(); ctx.translate(x,y); ctx.rotate(r); ctx.globalAlpha=op;
      ctx.strokeStyle="rgba(147,197,253,0.9)"; ctx.lineWidth=1.5;
      ctx.strokeRect(-s/2,0,s,s*0.7);
      ctx.beginPath(); ctx.moveTo(-s/2-2,0); ctx.lineTo(0,-s*0.5); ctx.lineTo(s/2+2,0); ctx.closePath(); ctx.stroke();
      ctx.strokeRect(-s*0.12,s*0.35,s*0.24,s*0.35);
      ctx.restore();
    };
    const draw=()=>{
      ctx.clearRect(0,0,W,H);
      pts.forEach(p=>{ drawHouse(p.x,p.y,p.size,p.opacity,p.rot); p.x+=p.vx; p.y+=p.vy; p.rot+=p.vrot; if(p.y<-20){p.y=H+20;p.x=Math.random()*W;} if(p.x<-20)p.x=W+20; if(p.x>W+20)p.x=-20; });
      raf=requestAnimationFrame(draw);
    };
    draw();
    return ()=>{ cancelAnimationFrame(raf); window.removeEventListener("resize",resize); };
  },[]);
  return <canvas ref={ref} style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none"}} />;
}

const Skeleton = ({w=60,h=22}:{w?:number,h?:number}) => (
  <div style={{width:w,height:h,borderRadius:6,background:"rgba(255,255,255,0.1)",animation:"skpulse 1.2s ease-in-out infinite"}} />
);

export default function HousingPage() {
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [loading, setLoading]     = useState(true);
  const [sort, setSort]           = useState<"asc"|"desc">("desc");
  const [search, setSearch]       = useState("");
  const [error, setError]         = useState<string|null>(null);
  const [hovered, setHovered]     = useState<string|null>(null);
  const [liveTime, setLiveTime]   = useState("");

  useEffect(()=>{
    const tick=()=>setLiveTime(new Date().toLocaleTimeString("de-DE",{hour:"2-digit",minute:"2-digit",second:"2-digit"}));
    tick(); const t=setInterval(tick,1000); return ()=>clearInterval(t);
  },[]);

  useEffect(()=>{
    fetch(`${RAW}/mietspiegel-2024/nach-wohnflaeche.json`)
      .then(r=>r.json())
      .then((d)=>{
        const rows: RentRow[] = d.rows??[];
        const valid = rows.filter(r=>r.nettokaltmiete_pro_qm!=null);
        if(!valid.length){setError("No rent data available");return;}
        const maxYear = Math.max(...valid.map(r=>r.year));
        const latest  = valid.filter(r=>r.year===maxYear);
        const map: Record<string,number[]>={};
        latest.forEach(r=>{ if(!map[r.stadtteil])map[r.stadtteil]=[]; map[r.stadtteil].push(r.nettokaltmiete_pro_qm!); });
        const result: Summary[] = Object.entries(map).map(([s,vals])=>({
          stadtteil:s,
          avg:vals.reduce((a,b)=>a+b,0)/vals.length,
          min:Math.min(...vals), max:Math.max(...vals),
        }));
        setSummaries(result);
      })
      .catch(()=>setError("Failed to load rent data"))
      .finally(()=>setLoading(false));
  },[]);

  const filtered = summaries
    .filter(s=>s.stadtteil.toLowerCase().includes(search.toLowerCase()))
    .sort((a,b)=>sort==="asc"?a.avg-b.avg:b.avg-a.avg);

  const avgCity    = summaries.length ? summaries.reduce((a,b)=>a+b.avg,0)/summaries.length : 0;
  const maxAvg     = Math.max(...summaries.map(s=>s.avg),1);
  const cheapest   = summaries.length ? summaries.reduce((a,b)=>a.avg<b.avg?a:b) : null;
  const mostExp    = summaries.length ? summaries.reduce((a,b)=>a.avg>b.avg?a:b) : null;
  const affordable = summaries.filter(s=>s.avg<6).length;

  const kpis = [
    { icon:"🏙️", val: avgCity>0?`€${avgCity.toFixed(2)}`:"—",    label:"City Avg €/m²",   sub:"all districts",        color:"#60a5fa" },
    { icon:"🏡", val: cheapest?cheapest.stadtteil:"—",             label:"Cheapest Area",   sub: cheapest?`€${cheapest.avg.toFixed(2)}/m²`:"", color:"#34d399" },
    { icon:"🏢", val: mostExp?mostExp.stadtteil:"—",               label:"Most Expensive",  sub: mostExp?`€${mostExp.avg.toFixed(2)}/m²`:"",   color:"#f87171" },
    { icon:"✅", val: loading?"—":`${affordable}`,                  label:"Affordable Areas",sub:"below €6/m²",          color:"#4ade80" },
    { icon:"📍", val: loading?"—":`${summaries.length}`,           label:"Districts",       sub:"in dataset",           color:"#c084fc" },
  ];

  return (
    <div className="min-h-screen" style={{background:"linear-gradient(160deg,#0a1628 0%,#0f2952 40%,#061B46 100%)"}}>
      <style>{`
        @keyframes ping     {0%,100%{transform:scale(1);opacity:.5}50%{transform:scale(1.9);opacity:0}}
        @keyframes fadeUp   {from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        @keyframes floatY   {0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
        @keyframes barGrow  {from{width:0}to{}}
        @keyframes skpulse  {0%,100%{opacity:.35}50%{opacity:.8}}
        @keyframes twinkle  {0%,100%{opacity:.2}50%{opacity:.9}}
        @keyframes winBlink {0%,100%{opacity:.4}50%{opacity:1}}
        @keyframes spin     {to{transform:rotate(360deg)}}
        .bar-grow  {animation:barGrow .9s cubic-bezier(.22,1,.36,1) both}
        .fade-up   {animation:fadeUp .5s ease both}
        .card-glass{background:rgba(255,255,255,0.05);backdrop-filter:blur(14px);border:1px solid rgba(255,255,255,0.10);border-radius:24px}
        ::-webkit-scrollbar{display:none}
      `}</style>

      {/* ── STICKY NAV */}
      <div className="sticky top-0 z-40" style={{background:"rgba(6,27,70,0.88)",backdropFilter:"blur(18px)",borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
        <div className="px-4 lg:px-8">
          <div className="flex items-center gap-4 py-2.5" style={{borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{background:"rgba(96,165,250,0.2)"}}>
                <Home className="h-4 w-4" style={{color:"#60a5fa"}}/>
              </div>
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-widest" style={{color:"rgba(147,197,253,0.7)"}}>Smart City Magdeburg</div>
                <div className="text-sm font-bold text-white leading-tight">Housing Dashboard</div>
              </div>
            </div>
            <div className="h-6 w-px" style={{background:"rgba(255,255,255,0.1)"}} />
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" style={{display:"inline-block",animation:"ping 1.5s ease-in-out infinite"}} />
              <span className="text-xs font-mono font-bold text-green-300">{liveTime||"—"}</span>
            </div>
            <span className="hidden sm:block text-[10px] uppercase tracking-widest" style={{color:"rgba(255,255,255,0.25)"}}>Mietspiegel 2024 · Magdeburg</span>
            {!loading&&!error&&<span className="ml-auto text-[10px] font-semibold" style={{color:"#4ade80"}}>{summaries.length} districts ✓</span>}
          </div>

          {/* KPI strip */}
          <div className="grid grid-cols-3 sm:grid-cols-5">
            {kpis.map((k,i)=>(
              <div key={k.label}
                className="flex flex-col items-center justify-center py-3 px-2 text-center cursor-default"
                style={{borderRight:i<4?"1px solid rgba(255,255,255,0.06)":undefined,transition:"background .2s"}}
                onMouseEnter={e=>(e.currentTarget.style.background="rgba(255,255,255,0.06)")}
                onMouseLeave={e=>(e.currentTarget.style.background="")}>
                <span style={{fontSize:12,marginBottom:2}}>{k.icon}</span>
                {loading
                  ? <Skeleton w={64} h={22}/>
                  : <div className="text-base font-bold tabular-nums text-white leading-tight truncate max-w-[100px]" style={{textShadow:`0 0 14px ${k.color}66`}}>{k.val}</div>}
                <div className="text-[10px] font-semibold mt-0.5" style={{color:"rgba(255,255,255,0.5)"}}>{k.label}</div>
                <div className="text-[9px]" style={{color:"rgba(255,255,255,0.25)"}}>{k.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── HERO */}
      <div className="relative overflow-hidden" style={{height:200,background:"linear-gradient(180deg,#050e1e 0%,#0a1628 60%,#061B46 100%)"}}>
        <CitySkyline />
        <HouseParticles />

        {/* floating hero house */}
        <div className="absolute" style={{right:"8%",bottom:28,animation:"floatY 3s ease-in-out infinite"}}>
          <svg viewBox="0 0 80 72" style={{width:80,height:72,filter:"drop-shadow(0 0 16px rgba(96,165,250,0.5))"}}>
            <defs>
              <linearGradient id="heroHouseG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.9"/>
                <stop offset="100%" stopColor="#2563eb" stopOpacity="0.7"/>
              </linearGradient>
            </defs>
            <rect x="10" y="32" width="60" height="40" rx="3" fill="url(#heroHouseG)"/>
            <polygon points="4,34 40,4 76,34" fill="#93c5fd" opacity="0.9"/>
            <rect x="32" y="52" width="16" height="20" rx="2" fill="rgba(6,27,70,0.8)"/>
            <rect x="16" y="40" width="12" height="10" rx="2" fill="rgba(253,224,71,0.85)" style={{filter:"drop-shadow(0 0 4px #fde047)"}}/>
            <rect x="52" y="40" width="12" height="10" rx="2" fill="rgba(253,224,71,0.85)" style={{filter:"drop-shadow(0 0 4px #fde047)"}}/>
          </svg>
        </div>

        {/* text */}
        <div className="absolute" style={{left:"5%",bottom:24}}>
          <div className="text-3xl font-black text-white" style={{textShadow:"0 0 30px rgba(96,165,250,0.6)"}}>
            {loading?<Skeleton w={120} h={36}/>:<>€{avgCity.toFixed(2)}<span className="text-lg font-semibold ml-2" style={{color:"rgba(255,255,255,0.5)"}}>/m² avg</span></>}
          </div>
          <div className="text-sm mt-1" style={{color:"rgba(255,255,255,0.5)"}}>Net cold rent · Magdeburg · Mietspiegel 2024</div>
        </div>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(to right,rgba(10,22,40,0.5) 0%,transparent 50%,rgba(10,22,40,0.3) 100%)"}} />
      </div>

      {/* ── BODY */}
      <div className="px-4 lg:px-8 py-8">

        {loading&&(
          <div className="flex items-center justify-center py-40">
            <div style={{width:40,height:40,borderRadius:"50%",border:"3px solid rgba(255,255,255,0.1)",borderTopColor:"#60a5fa",animation:"spin 0.8s linear infinite"}} />
          </div>
        )}

        {error&&!loading&&(
          <div className="flex flex-col items-center justify-center py-40" style={{color:"rgba(255,255,255,0.4)"}}>
            <p className="text-lg font-semibold">Could not load rent data</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {!loading&&!error&&summaries.length>0&&(
          <div style={{display:"flex",flexDirection:"column",gap:24}}>

            {/* controls */}
            <div className="fade-up flex flex-wrap gap-3 items-center">
              <div className="relative">
                <Search size={14} style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"rgba(255,255,255,0.4)"}}/>
                <input type="text" placeholder="Search district…" value={search} onChange={e=>setSearch(e.target.value)}
                  className="rounded-xl px-4 py-2 pl-9 text-sm text-white"
                  style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.12)",outline:"none",width:200}}/>
              </div>
              <button onClick={()=>setSort(s=>s==="asc"?"desc":"asc")}
                className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white"
                style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.12)",cursor:"pointer"}}>
                Price {sort==="asc"?<ChevronUp size={14}/>:<ChevronDown size={14}/>}
              </button>
              <span className="text-xs" style={{color:"rgba(255,255,255,0.4)"}}>{filtered.length} of {summaries.length} districts</span>
            </div>

            {/* animated bar chart */}
            <div className="card-glass p-6 fade-up" style={{animationDelay:"0.05s"}}>
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h2 className="text-xl font-bold text-white">🏠 Avg Net Cold Rent — All Districts</h2>
                  <p className="text-xs mt-1" style={{color:"rgba(255,255,255,0.35)"}}>Mietspiegel Magdeburg 2024 · hover a bar for min/max</p>
                </div>
                <div className="flex flex-wrap gap-3 text-[10px] font-semibold" style={{color:"rgba(255,255,255,0.5)"}}>
                  {[{c:"#22c55e",l:"<€6"},{c:"#eab308",l:"€6–8"},{c:"#f97316",l:"€8–10"},{c:"#ef4444",l:">€10"}].map(b=>(
                    <span key={b.l} className="flex items-center gap-1">
                      <span style={{width:8,height:8,borderRadius:"50%",background:b.c,display:"inline-block"}}/>{b.l}
                    </span>
                  ))}
                </div>
              </div>
              <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
                {[...summaries].sort((a,b)=>b.avg-a.avg).map((s,i)=>{
                  const rc  = rentColor(s.avg);
                  const pct = (s.avg/maxAvg)*100;
                  const isHov = hovered===s.stadtteil;
                  return (
                    <div key={s.stadtteil} style={{cursor:"pointer",transition:"all .2s"}}
                      onMouseEnter={()=>setHovered(s.stadtteil)}
                      onMouseLeave={()=>setHovered(null)}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-white truncate max-w-[200px]">
                          <MapPin size={10} style={{display:"inline",marginRight:4,color:rc.hex}}/>{s.stadtteil}
                        </span>
                        <div className="flex items-center gap-2">
                          {isHov&&(
                            <div className="text-[9px] rounded-lg px-2 py-0.5" style={{background:"rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.7)"}}>
                              min €{s.min.toFixed(2)} · max €{s.max.toFixed(2)}
                            </div>
                          )}
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{background:`${rc.hex}22`,color:rc.hex,border:`1px solid ${rc.hex}44`}}>{rc.label}</span>
                          <span className="text-sm font-bold tabular-nums" style={{color:rc.hex,minWidth:52,textAlign:"right",textShadow:`0 0 8px ${rc.glow}66`}}>€{s.avg.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="rounded-full overflow-hidden" style={{height:10,background:"rgba(255,255,255,0.06)"}}>
                        <div className="bar-grow h-full rounded-full"
                          style={{
                            width:`${pct}%`,
                            background:`linear-gradient(to right,${rc.hex}99,${rc.hex})`,
                            boxShadow:isHov?`0 0 10px ${rc.glow}`:undefined,
                            animationDelay:`${i*18}ms`,
                            transition:"box-shadow .2s",
                          }}/>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* price band + top 5 */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>

              <div className="card-glass p-5 fade-up" style={{animationDelay:"0.1s"}}>
                <p className="text-sm font-bold text-white mb-1">🏗️ Price Band Distribution</p>
                <p className="text-[10px] mb-4" style={{color:"rgba(255,255,255,0.35)"}}>Districts per affordability category</p>
                {(()=>{
                  const bands = [
                    {label:"Affordable <€6",  color:"#22c55e", count:summaries.filter(s=>s.avg<6).length},
                    {label:"Moderate €6–8",   color:"#eab308", count:summaries.filter(s=>s.avg>=6&&s.avg<8).length},
                    {label:"Expensive €8–10", color:"#f97316", count:summaries.filter(s=>s.avg>=8&&s.avg<10).length},
                    {label:"Very Exp. >€10",  color:"#ef4444", count:summaries.filter(s=>s.avg>=10).length},
                  ].filter(b=>b.count>0);
                  const total = bands.reduce((a,b)=>a+b.count,0);
                  return (
                    <div style={{display:"flex",flexDirection:"column",gap:10}}>
                      {bands.map(b=>(
                        <div key={b.label}>
                          <div className="flex justify-between text-xs mb-1">
                            <span style={{color:b.color,fontWeight:600}}>{b.label}</span>
                            <span style={{color:"rgba(255,255,255,0.6)"}}>{b.count} ({Math.round(b.count/total*100)}%)</span>
                          </div>
                          <div style={{height:8,borderRadius:4,background:"rgba(255,255,255,0.06)"}}>
                            <div className="bar-grow" style={{height:"100%",borderRadius:4,background:`linear-gradient(to right,${b.color}88,${b.color})`,width:`${(b.count/total)*100}%`}}/>
                          </div>
                        </div>
                      ))}
                      <div className="mt-2 text-center">
                        <div className="text-3xl font-black text-white" style={{textShadow:"0 0 20px rgba(96,165,250,0.4)"}}>{total}</div>
                        <div className="text-[10px]" style={{color:"rgba(255,255,255,0.4)"}}>total districts surveyed</div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div className="card-glass p-5 fade-up" style={{animationDelay:"0.15s"}}>
                <p className="text-sm font-bold text-white mb-1">🏆 Cheapest vs Priciest</p>
                <p className="text-[10px] mb-4" style={{color:"rgba(255,255,255,0.35)"}}>Top 3 each end</p>
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  {[
                    ...[...summaries].sort((a,b)=>a.avg-b.avg).slice(0,3).map(s=>({...s,side:"cheap"})),
                    ...[...summaries].sort((a,b)=>b.avg-a.avg).slice(0,3).map(s=>({...s,side:"exp"})),
                  ].map((s,i)=>{
                    const isCheap = s.side==="cheap";
                    return (
                      <div key={i} className="flex items-center justify-between rounded-xl px-3 py-2"
                        style={{background:isCheap?"rgba(34,197,94,0.08)":"rgba(239,68,68,0.08)",border:`1px solid ${isCheap?"rgba(34,197,94,0.2)":"rgba(239,68,68,0.2)"}`}}>
                        <div className="flex items-center gap-2">
                          {isCheap?<TrendingDown size={12} style={{color:"#22c55e"}}/>:<TrendingUp size={12} style={{color:"#f87171"}}/>}
                          <span className="text-xs font-semibold text-white truncate max-w-[120px]">{s.stadtteil}</span>
                        </div>
                        <span className="text-sm font-bold tabular-nums" style={{color:isCheap?"#4ade80":"#f87171"}}>€{s.avg.toFixed(2)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* house card spotlight */}
            <div className="card-glass p-5 fade-up" style={{animationDelay:"0.2s"}}>
              <p className="text-sm font-bold text-white mb-1">🏡 District Spotlight — Top 8 Most Affordable</p>
              <p className="text-[10px] mb-4" style={{color:"rgba(255,255,255,0.35)"}}>Lowest avg rent per m²</p>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))",gap:12}}>
                {[...summaries].sort((a,b)=>a.avg-b.avg).slice(0,8).map((s,i)=>{
                  const rc = rentColor(s.avg);
                  return (
                    <div key={s.stadtteil}
                      className="rounded-2xl p-3 text-center"
                      style={{
                        background:"rgba(255,255,255,0.04)",
                        border:`1px solid ${rc.hex}33`,
                        animation:"fadeUp .5s ease both",
                        animationDelay:`${0.2+i*0.06}s`,
                        transition:"transform .2s,box-shadow .2s",
                      }}
                      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow=`0 8px 24px ${rc.hex}33`;}}
                      onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="";}}>
                      <div style={{marginBottom:6,display:"inline-block",animation:`floatY ${2.5+i*0.2}s ease-in-out infinite`}}>
                        <svg viewBox="0 0 40 36" style={{width:36,height:36}}>
                          <rect x="5" y="16" width="30" height="20" rx="2" fill={`${rc.hex}33`} stroke={rc.hex} strokeWidth="1.2"/>
                          <polygon points="2,17 20,2 38,17" fill={`${rc.hex}55`} stroke={rc.hex} strokeWidth="1.2"/>
                          <rect x="16" y="26" width="8" height="10" rx="1" fill={`${rc.hex}44`} stroke={rc.hex} strokeWidth="0.8"/>
                          <rect x="8" y="20" width="7" height="6" rx="1" fill="rgba(253,224,71,0.8)" style={{filter:"drop-shadow(0 0 2px #fde047)"}}/>
                          <rect x="25" y="20" width="7" height="6" rx="1" fill="rgba(253,224,71,0.8)" style={{filter:"drop-shadow(0 0 2px #fde047)"}}/>
                        </svg>
                      </div>
                      <div className="text-xs font-semibold text-white truncate">{s.stadtteil}</div>
                      <div className="text-lg font-black mt-1" style={{color:rc.hex,textShadow:`0 0 10px ${rc.glow}66`}}>€{s.avg.toFixed(2)}</div>
                      <div className="text-[9px] mt-0.5" style={{color:"rgba(255,255,255,0.4)"}}>per m²</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* full table */}
            <div className="card-glass fade-up overflow-hidden" style={{animationDelay:"0.25s"}}>
              <div className="px-6 py-4" style={{borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
                <h2 className="text-lg font-bold text-white">📍 District Rent Table — {filtered.length} results</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{background:"rgba(255,255,255,0.04)"}}>
                      {["#","District","Min €/m²","Avg €/m²","Max €/m²","Category","Range"].map(h=>(
                        <th key={h} className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-widest" style={{color:"rgba(255,255,255,0.4)"}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((s,i)=>{
                      const rc  = rentColor(s.avg);
                      const span = s.max-s.min;
                      const minAll = Math.min(...summaries.map(x=>x.min));
                      return (
                        <tr key={s.stadtteil}
                          style={{borderTop:"1px solid rgba(255,255,255,0.05)",background:i%2===0?"rgba(255,255,255,0.02)":"transparent",transition:"background .15s"}}
                          onMouseEnter={e=>(e.currentTarget.style.background="rgba(255,255,255,0.06)")}
                          onMouseLeave={e=>(e.currentTarget.style.background=i%2===0?"rgba(255,255,255,0.02)":"transparent")}>
                          <td className="px-5 py-2.5 text-xs" style={{color:"rgba(255,255,255,0.3)"}}>{i+1}</td>
                          <td className="px-5 py-2.5 font-semibold text-white">{s.stadtteil}</td>
                          <td className="px-5 py-2.5 tabular-nums" style={{color:"#93c5fd"}}>€{s.min.toFixed(2)}</td>
                          <td className="px-5 py-2.5 tabular-nums font-bold" style={{color:rc.hex,textShadow:`0 0 8px ${rc.glow}55`}}>€{s.avg.toFixed(2)}</td>
                          <td className="px-5 py-2.5 tabular-nums" style={{color:"#f87171"}}>€{s.max.toFixed(2)}</td>
                          <td className="px-5 py-2.5">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{background:`${rc.hex}22`,color:rc.hex,border:`1px solid ${rc.hex}44`}}>{rc.label}</span>
                          </td>
                          <td className="px-5 py-2.5">
                            <div style={{position:"relative",height:6,width:80,background:"rgba(255,255,255,0.06)",borderRadius:3}}>
                              <div style={{
                                position:"absolute",height:"100%",borderRadius:3,
                                left:`${Math.max(0,((s.min-minAll)/(maxAvg-minAll))*80)}px`,
                                width:`${Math.max(4,(span/maxAvg)*80)}px`,
                                background:`linear-gradient(to right,${rc.hex}88,${rc.hex})`,
                              }}/>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
