"use client";
import { useEffect, useState, useRef } from "react";
import { TrendingUp, TrendingDown, Euro, BarChart3, Building2, ShoppingCart, Landmark } from "lucide-react";

const RAW = "https://raw.githubusercontent.com/SmartCityMagdeburg2026/Datasources/main/data";

type TaxRow = {
  jahr: number;
  gewerbesteuer: number | null;
  "gemeindeanteil-an-der-einkommensteuer": number | null;
  "gemeindeanteil-an-der-umsatzsteuer": number | null;
  "grundsteuer-b-bis-2024": number | null;
  "grundsteuer-b-ab-2025-wohngrundstuecke": number | null;
  "grundsteuer-b-ab-2025-nichtwohngrundstuecke": number | null;
  hundesteuer: number | null;
  vergnuegungssteuer: number | null;
};
type HoverRow = { jahr:number; total:number; gewerbesteuer:number; einkommensteuer:number; umsatzsteuer:number; grundsteuer:number; };

function fmt(v: number) {
  if (v >= 1_000_000) return `€${(v/1_000_000).toFixed(1)}M`;
  if (v >= 1_000)     return `€${(v/1_000).toFixed(0)}K`;
  return `€${v.toFixed(0)}`;
}

// ── Animated counter hook ──────────────────────────────────────────────────────────
function useCounter(target: number, duration = 1200) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!target) return;
    let start: number | null = null;
    const raf = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(target * ease));
      if (p < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [target, duration]);
  return val;
}

// ── Coin rain canvas ───────────────────────────────────────────────────────────────
function CoinRain() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d"); if (!ctx) return;
    let W = c.offsetWidth, H = c.offsetHeight;
    c.width = W; c.height = H;
    const resize = () => { W = c.offsetWidth; H = c.offsetHeight; c.width = W; c.height = H; };
    window.addEventListener("resize", resize);
    type Coin = { x:number;y:number;vy:number;r:number;op:number;spin:number;vspin:number;sym:string };
    const syms = ["€","€","€","+","▲","€"];
    const coins: Coin[] = Array.from({ length: 28 }, () => ({
      x: Math.random()*1400, y: Math.random()*220,
      vy: 0.25+Math.random()*0.45,
      r: 6+Math.random()*10,
      op: 0.06+Math.random()*0.14,
      spin: Math.random()*Math.PI*2,
      vspin: (Math.random()-0.5)*0.035,
      sym: syms[Math.floor(Math.random()*syms.length)],
    }));
    let raf = 0;
    const draw = () => {
      ctx.clearRect(0,0,W,H);
      coins.forEach(co => {
        ctx.save();
        ctx.translate(co.x, co.y); ctx.rotate(co.spin); ctx.globalAlpha = co.op;
        // outer ring
        ctx.beginPath(); ctx.arc(0,0,co.r,0,Math.PI*2);
        ctx.strokeStyle="rgba(253,224,71,0.9)"; ctx.lineWidth=1.2; ctx.stroke();
        // inner ring
        ctx.beginPath(); ctx.arc(0,0,co.r*0.7,0,Math.PI*2);
        ctx.strokeStyle="rgba(253,224,71,0.4)"; ctx.lineWidth=0.6; ctx.stroke();
        ctx.fillStyle="rgba(253,224,71,0.9)";
        ctx.font=`bold ${co.r*0.95}px sans-serif`;
        ctx.textAlign="center"; ctx.textBaseline="middle";
        ctx.fillText(co.sym, 0, 0);
        ctx.restore();
        co.y += co.vy; co.spin += co.vspin;
        if (co.y > H+20) { co.y = -20; co.x = Math.random()*W; }
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} style={{ position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none" }} />;
}

// ── Revenue-themed city skyline with bank, euro pillars, bar chart silhouette ────
function Skyline() {
  return (
    <svg viewBox="0 0 900 170" style={{ width:"100%",height:170,display:"block" }} preserveAspectRatio="xMidYMax meet">
      <defs>
        <linearGradient id="sg1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1e3a5f"/><stop offset="100%" stopColor="#0f2952"/></linearGradient>
        <linearGradient id="sg2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#16304e"/><stop offset="100%" stopColor="#0a1e3a"/></linearGradient>
        <linearGradient id="goldG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#fde047" stopOpacity="0.9"/><stop offset="100%" stopColor="#ca8a04" stopOpacity="0.7"/></linearGradient>
      </defs>
      <circle cx="800" cy="30" r="20" fill="rgba(253,224,71,0.09)"/>
      <circle cx="800" cy="30" r="14" fill="rgba(253,224,71,0.20)" style={{ filter:"drop-shadow(0 0 8px rgba(253,224,71,0.5))" }}/>
      {[[50,18],[130,10],[240,14],[370,8],[500,16],[650,12],[740,22],[85,32],[300,26],[560,20]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r="1.2" fill="rgba(255,255,255,0.6)" style={{ animation:`twinkle ${1.5+i*0.28}s ease-in-out infinite`,animationDelay:`${i*0.18}s` }}/>
      ))}
      {[[0,95,50,75],[55,75,38,95],[98,82,52,88],[155,62,32,108],[192,78,44,92],[240,58,58,112],
        [302,88,38,82],[345,68,52,102],[400,80,46,90],[515,72,38,98],
        [558,62,52,108],[614,82,48,88],[665,70,44,100],[712,88,48,82],[762,75,42,95],[807,90,52,80],[862,78,42,92]
      ].map(([x,y,w,h],i)=>(<rect key={i} x={x} y={y} width={w} height={h} rx="1" fill="url(#sg2)" opacity="0.5"/>))}

      {/* grand bank building */}
      <rect x="410" y="48" width="84" height="122" rx="2" fill="url(#sg1)"/>
      {[420,432,444,456,468,480].map((cx,i)=>(<rect key={i} x={cx} y="82" width="4" height="88" rx="1" fill="rgba(255,255,255,0.06)"/>))}
      <polygon points="406,50 452,26 498,50" fill="#1e3a5f" stroke="rgba(255,255,255,0.09)" strokeWidth="1"/>
      <ellipse cx="452" cy="26" rx="14" ry="8" fill="rgba(253,224,71,0.28)" style={{ filter:"drop-shadow(0 0 8px rgba(253,224,71,0.5))" }}/>
      <text x="452" y="68" textAnchor="middle" style={{ fill:"rgba(253,224,71,0.75)",fontSize:15,fontWeight:900,filter:"drop-shadow(0 0 8px rgba(253,224,71,0.9))",animation:"winBlink 2.5s ease-in-out infinite" }}>€</text>
      <line x1="452" y1="26" x2="452" y2="10" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
      <circle cx="452" cy="9" r="2.5" fill="#fde047" style={{ animation:"ping 1.8s ease-in-out infinite",filter:"drop-shadow(0 0 4px #fde047)" }}/>

      {/* front buildings */}
      {[[8,108,48,62],[60,90,44,80],[110,97,52,73],[166,75,40,95],[210,88,48,82],
        [262,65,62,105],[328,95,40,75],[372,78,36,92],[502,90,46,80],[552,65,58,105],
        [614,82,44,88],[662,70,52,100],[718,88,46,82],[768,78,44,92],[816,95,40,75],[860,88,40,82]
      ].map(([x,y,w,h],i)=>(<rect key={i} x={x} y={y} width={w} height={h} rx="2" fill="url(#sg1)"/>))}

      {/* windows */}
      {[[18,115],[30,115],[18,127],[30,127],[18,139],[30,139],
        [70,98],[82,98],[70,110],[82,110],
        [120,105],[134,105],[120,117],[134,117],
        [176,83],[188,83],[176,95],[188,95],[176,107],[188,107],
        [272,73],[286,73],[272,85],[286,85],[272,97],[286,97],[272,109],[286,109],
        [416,58],[428,58],[440,58],[452,58],[416,70],[428,70],[440,70],[452,70],
        [562,73],[576,73],[562,85],[576,85],[562,97],[576,97],[562,109],[576,109],
        [672,78],[684,78],[672,90],[684,90],[672,102],[684,102],
        [728,96],[740,96],[728,108],[740,108],
      ].map(([wx,wy],i)=>(
        <rect key={i} x={wx} y={wy} width="5" height="4" rx="1"
          fill={i%4===0?"rgba(253,224,71,0.9)":i%4===1?"rgba(147,197,253,0.6)":i%4===2?"rgba(253,224,71,0.5)":"rgba(96,165,250,0.4)"}
          style={{ animation:`winBlink ${2+i*0.12}s ease-in-out infinite`,animationDelay:`${i*0.08}s` }}/>
      ))}

      {/* rising bar chart silhouette — right side */}
      {[0,1,2,3,4,5].map(i=>(
        <rect key={i} x={820+i*11} y={157-(i*12+8)} width="8" height={i*12+8} rx="1"
          fill="rgba(96,165,250,0.3)" style={{ filter:"drop-shadow(0 0 3px rgba(96,165,250,0.4))" }}/>
      ))}

      {/* ground */}
      <rect x="0" y="167" width="900" height="3" fill="rgba(255,255,255,0.07)"/>
    </svg>
  );
}

// ── Floating SVG revenue icons ──────────────────────────────────────────────────────
function FloatingRevIcons() {
  return (
    <>
      {/* big euro coin */}
      <div className="absolute" style={{ right:"6%",bottom:30,animation:"floatY 3s ease-in-out infinite" }}>
        <svg viewBox="0 0 80 80" style={{ width:80,height:80,filter:"drop-shadow(0 0 18px rgba(251,191,36,0.6))" }}>
          <defs><radialGradient id="coinG" cx="40%" cy="35%"><stop offset="0%" stopColor="#fde68a"/><stop offset="100%" stopColor="#b45309"/></radialGradient></defs>
          <circle cx="40" cy="40" r="36" fill="url(#coinG)" stroke="rgba(253,224,71,0.6)" strokeWidth="2"/>
          <circle cx="40" cy="40" r="29" fill="none" stroke="rgba(253,224,71,0.25)" strokeWidth="1"/>
          <text x="40" y="49" textAnchor="middle" style={{ fill:"rgba(120,53,15,0.9)",fontSize:30,fontWeight:900 }}>€</text>
        </svg>
      </div>

      {/* coin stack */}
      <div className="absolute" style={{ right:"17%",bottom:44,animation:"floatY 3.8s ease-in-out infinite",animationDelay:".5s" }}>
        <svg viewBox="0 0 40 50" style={{ width:40,height:50,filter:"drop-shadow(0 0 8px rgba(251,191,36,0.4))" }}>
          {[0,1,2,3].map(i=>(
            <ellipse key={i} cx="20" cy={44-i*10} rx="18" ry="5"
              fill={`rgba(253,224,71,${0.3+i*0.15})`} stroke="rgba(253,224,71,0.5)" strokeWidth="0.8"/>
          ))}
          {[0,1,2,3].map(i=>(
            <rect key={i} x="2" y={39-i*10} width="36" height="10"
              fill={`rgba(202,138,4,${0.25+i*0.1})`}
            />
          ))}
          {[0,1,2,3].map(i=>(
            <ellipse key={i} cx="20" cy={39-i*10} rx="18" ry="5"
              fill={`rgba(253,224,71,${0.25+i*0.12})`} stroke="rgba(253,224,71,0.4)" strokeWidth="0.8"/>
          ))}
        </svg>
      </div>

      {/* banknote */}
      <div className="absolute" style={{ right:"26%",bottom:38,animation:"floatY 4.5s ease-in-out infinite",animationDelay:"1s" }}>
        <svg viewBox="0 0 64 34" style={{ width:64,height:34,filter:"drop-shadow(0 0 8px rgba(74,222,128,0.4))" }}>
          <rect x="1" y="1" width="62" height="32" rx="4" fill="rgba(20,83,45,0.7)" stroke="rgba(74,222,128,0.4)" strokeWidth="1"/>
          <rect x="4" y="4" width="56" height="26" rx="3" fill="none" stroke="rgba(74,222,128,0.2)" strokeWidth="0.5"/>
          <text x="32" y="21" textAnchor="middle" style={{ fill:"rgba(74,222,128,0.85)",fontSize:14,fontWeight:700 }}>€100</text>
          <rect x="6" y="10" width="12" height="14" rx="2" fill="rgba(74,222,128,0.15)" stroke="rgba(74,222,128,0.3)" strokeWidth="0.5"/>
          <rect x="46" y="10" width="12" height="14" rx="2" fill="rgba(74,222,128,0.15)" stroke="rgba(74,222,128,0.3)" strokeWidth="0.5"/>
        </svg>
      </div>

      {/* mini growing bar chart */}
      <div className="absolute" style={{ right:"37%",bottom:50,animation:"floatY 3.2s ease-in-out infinite",animationDelay:"1.4s" }}>
        <svg viewBox="0 0 44 36" style={{ width:44,height:36,filter:"drop-shadow(0 0 8px rgba(96,165,250,0.5))" }}>
          {[0,1,2,3].map(i=>(
            <rect key={i} x={4+i*10} y={36-(10+i*7)} width="7" height={10+i*7} rx="1"
              fill={["#60a5fa","#4ade80","#fbbf24","#c084fc"][i]} opacity="0.9"/>
          ))}
        </svg>
      </div>

      {/* trending up arrow */}
      <div className="absolute" style={{ right:"46%",bottom:42,animation:"floatY 5s ease-in-out infinite",animationDelay:"1.8s" }}>
        <svg viewBox="0 0 32 28" style={{ width:32,height:28,filter:"drop-shadow(0 0 6px rgba(74,222,128,0.5))" }}>
          <polyline points="2,24 10,14 18,18 30,4" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <polyline points="22,4 30,4 30,12" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </>
  );
}

// ── Scrolling ticker tape ─────────────────────────────────────────────────────────────
function TickerTape({ items }: { items: string[] }) {
  if (!items.length) return null;
  const doubled = [...items, ...items];
  return (
    <div style={{ overflow:"hidden",borderBottom:"1px solid rgba(255,255,255,0.06)",borderTop:"1px solid rgba(255,255,255,0.06)",background:"rgba(0,0,0,0.2)" }}>
      <div style={{ display:"flex",gap:0,animation:"tickerScroll 30s linear infinite",whiteSpace:"nowrap" }}>
        {doubled.map((item,i)=>(
          <span key={i} style={{ padding:"6px 28px",fontSize:10,fontWeight:600,color:"rgba(251,191,36,0.8)",letterSpacing:"0.08em",borderRight:"1px solid rgba(255,255,255,0.06)",flexShrink:0 }}>
            ▲ {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Animated SVG ring chart ─────────────────────────────────────────────────────────
function RingChart({ segs }: { segs: { label:string; color:string; value:number }[] }) {
  const [prog, setProg] = useState(0);
  const rafRef = useRef<number>(0);
  useEffect(() => {
    const total = segs.reduce((a,b)=>a+b.value,0);
    if (!total) return;
    let start: number|null = null;
    const dur = 1000;
    const anim = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts-start)/dur, 1);
      setProg(1-Math.pow(1-p,3));
      if (p<1) rafRef.current = requestAnimationFrame(anim);
    };
    rafRef.current = requestAnimationFrame(anim);
    return () => cancelAnimationFrame(rafRef.current);
  }, [segs.map(s=>s.value).join(",")]);

  const total = segs.reduce((a,b)=>a+b.value,0);
  if (!total) return null;

  const cx=70, cy=70, R=56, thickness=14;
  let cumAngle = -Math.PI/2;
  const [hov, setHov] = useState<string|null>(null);

  const slices = segs.map(s=>{
    const angle = (s.value/total)*2*Math.PI*prog;
    const x1 = cx+R*Math.cos(cumAngle), y1=cy+R*Math.sin(cumAngle);
    const x2 = cx+R*Math.cos(cumAngle+angle), y2=cy+R*Math.sin(cumAngle+angle);
    const ri = R-thickness;
    const xi1=cx+ri*Math.cos(cumAngle),yi1=cy+ri*Math.sin(cumAngle);
    const xi2=cx+ri*Math.cos(cumAngle+angle),yi2=cy+ri*Math.sin(cumAngle+angle);
    const large = angle>Math.PI?1:0;
    const d=`M${xi1},${yi1} L${x1},${y1} A${R},${R},0,${large},1,${x2},${y2} L${xi2},${yi2} A${ri},${ri},0,${large},0,${xi1},${yi1} Z`;
    const mid = cumAngle+angle/2;
    cumAngle += angle;
    return { ...s, d, mid, pct:Math.round((s.value/total)*100) };
  });

  return (
    <div style={{ display:"flex",alignItems:"center",gap:20 }}>
      <svg viewBox="0 0 140 140" style={{ width:140,height:140,flexShrink:0 }}>
        {slices.map((s,i)=>(
          <path key={i} d={s.d} fill={s.color}
            style={{ opacity:hov&&hov!==s.label?.5:1,filter:hov===s.label?`drop-shadow(0 0 6px ${s.color})`:undefined,transition:"opacity .2s",cursor:"pointer" }}
            onMouseEnter={()=>setHov(s.label)}
            onMouseLeave={()=>setHov(null)}/>
        ))}
        <circle cx={cx} cy={cy} r={R-thickness-2} fill="rgba(10,22,40,0.92)"/>
        {hov ? (() => {
          const s = slices.find(x=>x.label===hov);
          return s?(
            <>
              <text x={cx} y={cy-6} textAnchor="middle" style={{ fill:s.color,fontSize:7,fontWeight:600 }}>{s.label}</text>
              <text x={cx} y={cy+8} textAnchor="middle" style={{ fill:"white",fontSize:14,fontWeight:700 }}>{s.pct}%</text>
            </>
          ):null;
        })() : (
          <>
            <text x={cx} y={cy-4} textAnchor="middle" style={{ fill:"white",fontSize:11,fontWeight:700 }}>Share</text>
            <text x={cx} y={cy+10} textAnchor="middle" style={{ fill:"rgba(255,255,255,0.35)",fontSize:7 }}>hover slice</text>
          </>
        )}
      </svg>
      <div style={{ display:"flex",flexDirection:"column",gap:8,flex:1 }}>
        {slices.map(s=>(
          <div key={s.label}
            style={{ display:"flex",alignItems:"center",gap:8,cursor:"pointer",opacity:hov&&hov!==s.label?.4:1,transition:"opacity .2s" }}
            onMouseEnter={()=>setHov(s.label)} onMouseLeave={()=>setHov(null)}>
            <span style={{ width:10,height:10,borderRadius:"50%",background:s.color,flexShrink:0,boxShadow:`0 0 6px ${s.color}88` }}/>
            <span style={{ fontSize:11,color:"rgba(255,255,255,0.7)",flex:1 }}>{s.label}</span>
            <span style={{ fontSize:12,fontWeight:700,color:s.color }}>{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Radial gauge ────────────────────────────────────────────────────────────────────
function RadialGauge({ pct, growth }: { pct: number; growth: number }) {
  const [prog, setProg] = useState(0);
  useEffect(() => {
    let s: number|null = null;
    const dur = 1000;
    const anim = (ts: number) => {
      if (!s) s = ts;
      const p = Math.min((ts-s)/dur, 1);
      setProg(1-Math.pow(1-p,3));
      if (p<1) requestAnimationFrame(anim);
    };
    requestAnimationFrame(anim);
  }, [pct]);
  const R=52, cx=64, cy=64;
  const circ=2*Math.PI*R;
  const clampedPct=Math.max(0,Math.min(100,pct));
  const dash=(clampedPct/100)*circ*prog;
  const color=growth>=0?"#4ade80":"#f87171";
  const angle=((clampedPct/100)*270-135)*(Math.PI/180);
  const nx=cx+R*Math.cos(angle), ny=cy+R*Math.sin(angle);
  return (
    <svg viewBox="0 0 128 128" style={{ width:128,height:128 }}>
      <defs><linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor={color} stopOpacity="0.4"/><stop offset="100%" stopColor={color}/></linearGradient></defs>
      <circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="10"
        strokeDasharray={`${circ*0.75} ${circ*0.25}`} strokeDashoffset={circ*0.125} strokeLinecap="round" transform={`rotate(-225 ${cx} ${cy})`}/>
      <circle cx={cx} cy={cy} r={R} fill="none" stroke="url(#gaugeGrad)" strokeWidth="10"
        strokeDasharray={`${dash} ${circ}`} strokeDashoffset={0} strokeLinecap="round" transform={`rotate(-225 ${cx} ${cy})`}
        style={{ filter:`drop-shadow(0 0 6px ${color}88)`,transition:"stroke-dasharray .05s" }}/>
      <circle cx={nx} cy={ny} r={4} fill={color} style={{ filter:`drop-shadow(0 0 4px ${color})` }}/>
      <text x={cx} y={cy-4} textAnchor="middle" style={{ fill:"white",fontSize:18,fontWeight:700 }}>
        {growth>=0?"+":""}{growth.toFixed(1)}%
      </text>
      <text x={cx} y={cy+12} textAnchor="middle" style={{ fill:"rgba(255,255,255,0.4)",fontSize:7 }}>YoY GROWTH</text>
    </svg>
  );
}

const Skeleton=({w=60,h=22}:{w?:number,h?:number})=>(
  <div style={{ width:w,height:h,borderRadius:6,background:"rgba(255,255,255,0.1)",animation:"skpulse 1.2s ease-in-out infinite" }}/>
);

export default function InsightsPage() {
  const [rows, setRows]       = useState<TaxRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [hover, setHover]     = useState<HoverRow|null>(null);
  const [liveTime, setLiveTime] = useState("");
  const [barsReady, setBarsReady] = useState(false);

  useEffect(()=>{
    const tick=()=>setLiveTime(new Date().toLocaleTimeString("de-DE",{hour:"2-digit",minute:"2-digit",second:"2-digit"}));
    tick(); const t=setInterval(tick,1000); return ()=>clearInterval(t);
  },[]);

  useEffect(()=>{
    fetch(`${RAW}/steuereinnahmen/json/steuereinnahmen-2010-2025.json`)
      .then(r=>r.json())
      .then(d=>{ setRows([...d.rows].sort((a:TaxRow,b:TaxRow)=>a.jahr-b.jahr)); })
      .finally(()=>{ setLoading(false); setTimeout(()=>setBarsReady(true),60); });
  },[]);

  const totalByYear: HoverRow[] = rows.map(r=>({
    jahr: r.jahr,
    total: (r.gewerbesteuer??0)+(r["gemeindeanteil-an-der-einkommensteuer"]??0)+(r["gemeindeanteil-an-der-umsatzsteuer"]??0)+(r["grundsteuer-b-bis-2024"]??0)+(r["grundsteuer-b-ab-2025-wohngrundstuecke"]??0)+(r["grundsteuer-b-ab-2025-nichtwohngrundstuecke"]??0),
    gewerbesteuer: r.gewerbesteuer??0,
    einkommensteuer: r["gemeindeanteil-an-der-einkommensteuer"]??0,
    umsatzsteuer: r["gemeindeanteil-an-der-umsatzsteuer"]??0,
    grundsteuer: (r["grundsteuer-b-bis-2024"]??0)+(r["grundsteuer-b-ab-2025-wohngrundstuecke"]??0)+(r["grundsteuer-b-ab-2025-nichtwohngrundstuecke"]??0),
  }));

  const maxTotal  = Math.max(...totalByYear.map(r=>r.total),1);
  const latest    = totalByYear[totalByYear.length-1];
  const prev      = totalByYear[totalByYear.length-2];
  const growth    = latest&&prev?((latest.total-prev.total)/prev.total)*100:0;
  const growthPct = Math.min(Math.abs(growth)*3,100);

  // animated counter targets
  const totalCounter = useCounter(latest?.total??0, 1400);

  const SEGS = [
    { key:"gewerbesteuer",   label:"Business Tax",  color:"#60a5fa", icon:Building2,    glow:"#60a5fa" },
    { key:"einkommensteuer", label:"Income Tax",    color:"#4ade80", icon:Euro,         glow:"#4ade80" },
    { key:"umsatzsteuer",    label:"Sales Tax",     color:"#fbbf24", icon:ShoppingCart,  glow:"#fbbf24" },
    { key:"grundsteuer",     label:"Property Tax",  color:"#c084fc", icon:Landmark,     glow:"#c084fc" },
  ] as const;

  const kpis = [
    { icon:Euro,                              label:"Total Revenue",  sub:"Latest year",  val:latest?fmt(latest.total):"—",                              color:"#60a5fa" },
    { icon:growth>=0?TrendingUp:TrendingDown, label:"YoY Growth",     sub:"vs prior year", val:latest&&prev?`${growth>=0?"+":""}${growth.toFixed(1)}%`:"—", color:growth>=0?"#4ade80":"#f87171" },
    { icon:Building2,                         label:"Business Tax",   sub:"Gewerbesteuer", val:latest?fmt(latest.gewerbesteuer):"—",                       color:"#60a5fa" },
    { icon:Landmark,                          label:"Property Tax",   sub:"Grundsteuer B", val:latest?fmt(latest.grundsteuer):"—",                         color:"#c084fc" },
  ];

  // Ticker items
  const tickerItems = latest ? [
    `Total Revenue ${latest.jahr}: ${fmt(latest.total)}`,
    `Business Tax: ${fmt(latest.gewerbesteuer)}`,
    `Income Tax: ${fmt(latest.einkommensteuer)}`,
    `Sales Tax: ${fmt(latest.umsatzsteuer)}`,
    `Property Tax: ${fmt(latest.grundsteuer)}`,
    `YoY Change: ${growth>=0?"+":""}${growth.toFixed(1)}%`,
    `Data source: Steuereinnahmen Magdeburg 2010–2025`,
  ] : [];

  return (
    <div className="min-h-screen" style={{ background:"linear-gradient(160deg,#0a1628 0%,#0f2952 40%,#061B46 100%)" }}>
      <style>{`
        @keyframes ping         {0%,100%{transform:scale(1);opacity:.5}50%{transform:scale(1.9);opacity:0}}
        @keyframes fadeUp       {from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes floatY       {0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes skpulse      {0%,100%{opacity:.35}50%{opacity:.8}}
        @keyframes twinkle      {0%,100%{opacity:.2}50%{opacity:.9}}
        @keyframes winBlink     {0%,100%{opacity:.4}50%{opacity:1}}
        @keyframes spin         {to{transform:rotate(360deg)}}
        @keyframes tickerScroll {from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @keyframes pulseGlow    {0%,100%{box-shadow:0 0 8px rgba(251,191,36,0.2)}50%{box-shadow:0 0 22px rgba(251,191,36,0.55)}}
        @keyframes countUp      {from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .fade-up   {animation:fadeUp .5s ease both}
        .card-glass{background:rgba(255,255,255,0.05);backdrop-filter:blur(14px);border:1px solid rgba(255,255,255,0.10);border-radius:24px}
        ::-webkit-scrollbar{display:none}
      `}</style>

      {/* ── STICKY NAV */}
      <div className="sticky top-0 z-40" style={{ background:"rgba(6,27,70,0.88)",backdropFilter:"blur(18px)",borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
        <div className="px-4 lg:px-8">
          <div className="flex items-center gap-4 py-2.5" style={{ borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background:"rgba(251,191,36,0.2)" }}>
              <BarChart3 size={16} style={{ color:"#fbbf24" }}/>
            </div>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-widest" style={{ color:"rgba(251,191,36,0.7)" }}>Smart City Magdeburg</div>
              <div className="text-sm font-bold text-white">City Insights — Revenue</div>
            </div>
            <div className="h-5 w-px" style={{ background:"rgba(255,255,255,0.1)" }}/>
            <div className="flex items-center gap-1.5">
              <span style={{ width:6,height:6,borderRadius:"50%",background:"#4ade80",display:"inline-block",animation:"ping 1.5s ease-in-out infinite" }}/>
              <span className="text-xs font-mono font-bold text-green-300">{liveTime||"—"}</span>
            </div>
            <span className="hidden sm:block text-[10px] uppercase tracking-widest" style={{ color:"rgba(255,255,255,0.22)" }}>Steuereinnahmen 2010–2025</span>
            {!loading&&<span className="ml-auto text-[10px] font-semibold" style={{ color:"#fbbf24" }}>{rows.length} years ✓</span>}
          </div>

          {/* KPI strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4">
            {kpis.map((k,i)=>{
              const Icon=k.icon;
              return (
                <div key={k.label}
                  style={{ borderRight:i<3?"1px solid rgba(255,255,255,0.06)":undefined,transition:"background .2s" }}
                  className="flex flex-col items-center justify-center py-3 px-2 text-center cursor-default"
                  onMouseEnter={e=>(e.currentTarget.style.background="rgba(255,255,255,0.06)")}
                  onMouseLeave={e=>(e.currentTarget.style.background="")}>
                  <Icon size={12} style={{ color:k.color,marginBottom:2 }}/>
                  {loading
                    ?<Skeleton w={64} h={22}/>
                    :<div className="text-base font-bold tabular-nums text-white leading-tight" style={{ textShadow:`0 0 14px ${k.color}66`,animation:"countUp .5s ease both" }}>{k.val}</div>}
                  <div className="text-[10px] font-semibold mt-0.5" style={{ color:"rgba(255,255,255,0.5)" }}>{k.label}</div>
                  <div className="text-[9px]" style={{ color:"rgba(255,255,255,0.25)" }}>{k.sub}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── HERO */}
      <div className="relative overflow-hidden" style={{ height:220,background:"linear-gradient(180deg,#040c1a 0%,#091524 60%,#061B46 100%)" }}>
        <Skyline/>
        <CoinRain/>
        <FloatingRevIcons/>
        <div className="absolute" style={{ left:"5%",bottom:28 }}>
          <div className="text-3xl font-black text-white" style={{ textShadow:"0 0 30px rgba(251,191,36,0.5)" }}>
            {loading?<Skeleton w={130} h={36}/>:
              <>{fmt(totalCounter)}<span className="text-base font-semibold ml-2" style={{ color:"rgba(255,255,255,0.45)" }}>total revenue</span></>}
          </div>
          <div className="text-sm mt-1" style={{ color:"rgba(255,255,255,0.45)" }}>City tax income · Magdeburg · 2010–2025</div>
        </div>
        <div style={{ position:"absolute",inset:0,background:"linear-gradient(to right,rgba(4,12,26,0.55) 0%,transparent 45%,rgba(4,12,26,0.25) 100%)" }}/>
      </div>

      {/* ── TICKER TAPE */}
      {!loading&&tickerItems.length>0&&<TickerTape items={tickerItems}/>}

      {/* ── BODY */}
      <div className="px-4 lg:px-8 py-8">
        {loading&&(
          <div className="flex items-center justify-center py-40">
            <div style={{ width:40,height:40,borderRadius:"50%",border:"3px solid rgba(255,255,255,0.1)",borderTopColor:"#fbbf24",animation:"spin 0.8s linear infinite" }}/>
          </div>
        )}

        {!loading&&rows.length>0&&(
          <div style={{ display:"flex",flexDirection:"column",gap:24 }}>

            {/* ── MAIN CHART + ring + gauge */}
            <div className="card-glass p-6 fade-up" style={{ animationDelay:"0.05s" }}>
              <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                <div>
                  <h2 className="text-xl font-bold text-white">🏦 Tax Revenue 2010–2025</h2>
                  <p className="text-xs mt-1" style={{ color:"rgba(255,255,255,0.35)" }}>Annual city tax income · hover bars for detail</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {SEGS.map(s=>(
                    <span key={s.key} className="flex items-center gap-1.5 text-[10px] font-semibold" style={{ color:"rgba(255,255,255,0.55)" }}>
                      <span style={{ width:8,height:8,borderRadius:2,background:s.color,display:"inline-block",boxShadow:`0 0 4px ${s.glow}88` }}/>
                      {s.label}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display:"grid",gridTemplateColumns:"1fr auto",gap:24,alignItems:"start" }}>
                {/* stacked bar chart */}
                <div className="relative">
                  {hover&&(
                    <div className="absolute z-10 rounded-2xl p-4 text-xs" style={{ top:0,right:0,minWidth:180,background:"rgba(6,27,70,0.95)",border:"1px solid rgba(255,255,255,0.12)",backdropFilter:"blur(12px)" }}>
                      <p className="font-bold text-white text-sm mb-2">{hover.jahr}</p>
                      {SEGS.map(s=>(
                        <div key={s.key} className="flex justify-between gap-4 mb-1">
                          <span style={{ color:s.color }}>{s.label}</span>
                          <span className="font-bold text-white tabular-nums">{fmt(hover[s.key as keyof HoverRow] as number)}</span>
                        </div>
                      ))}
                      <div className="border-t mt-2 pt-2" style={{ borderColor:"rgba(255,255,255,0.1)" }}>
                        <div className="flex justify-between">
                          <span style={{ color:"rgba(255,255,255,0.5)" }}>Total</span>
                          <span className="font-bold text-white tabular-nums">{fmt(hover.total)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-end gap-1" style={{ height:280 }}>
                    {totalByYear.map((r,ri)=>{
                      const isHov=hover?.jahr===r.jahr;
                      return (
                        <div key={r.jahr} className="flex-1 flex flex-col justify-end gap-0 cursor-pointer"
                          style={{ height:"100%",position:"relative" }}
                          onMouseEnter={()=>setHover(r)}
                          onMouseLeave={()=>setHover(null)}>
                          {SEGS.map((s,si)=>{
                            const val=r[s.key as keyof HoverRow] as number;
                            const hPct=maxTotal>0?(val/maxTotal)*100:0;
                            return (
                              <div key={s.key} style={{
                                width:"100%",
                                height:barsReady?`${hPct}%`:"0%",
                                background:`linear-gradient(to top,${s.color}bb,${s.color})`,
                                boxShadow:isHov?`0 0 8px ${s.glow}`:undefined,
                                transition:`height .8s cubic-bezier(.22,1,.36,1) ${ri*30}ms, box-shadow .2s`,
                                minHeight:val>0?2:0,
                                borderRadius:si===0?"3px 3px 0 0":0,
                              }}/>
                            );
                          }).reverse()}
                          <p className="text-center absolute" style={{ bottom:-18,left:0,right:0,fontSize:8,color:isHov?"#fbbf24":"rgba(255,255,255,0.3)",fontWeight:isHov?700:400,transition:"color .2s" }}>
                            {String(r.jahr).slice(2)}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ height:20 }}/>
                </div>

                {/* right panel: gauge + ring chart */}
                <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:16,minWidth:160 }}>
                  {latest&&prev&&<RadialGauge pct={growthPct} growth={growth}/>}
                  {latest&&(
                    <RingChart segs={SEGS.map(s=>({
                      label:s.label,
                      color:s.color,
                      value:latest[s.key as keyof HoverRow] as number,
                    }))}/>
                  )}
                </div>
              </div>
            </div>

            {/* ── SEGMENT CARDS */}
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:16 }}>
              {SEGS.map((s,i)=>{
                const Icon=s.icon;
                const val  =latest?latest[s.key as keyof HoverRow] as number:0;
                const prevVal=prev?prev[s.key as keyof HoverRow] as number:0;
                const chg  =prevVal>0?((val-prevVal)/prevVal)*100:0;
                return (
                  <div key={s.key}
                    className="card-glass p-5 fade-up"
                    style={{ animationDelay:`${0.1+i*0.06}s`,transition:"transform .2s,box-shadow .2s" }}
                    onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow=`0 12px 32px ${s.glow}22`; }}
                    onMouseLeave={e=>{ e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow=""; }}>
                    {/* icon badge with pulse */}
                    <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:12 }}>
                      <div style={{ width:40,height:40,borderRadius:12,background:`${s.glow}22`,display:"flex",alignItems:"center",justifyContent:"center",border:`1px solid ${s.glow}44`,boxShadow:`0 0 12px ${s.glow}22`,animation:"pulseGlow 2.5s ease-in-out infinite" }}>
                        <Icon size={18} style={{ color:s.color }}/>
                      </div>
                      <div>
                        <div className="text-xs font-semibold" style={{ color:"rgba(255,255,255,0.5)" }}>{s.label}</div>
                        <div style={{ fontSize:9,color:"rgba(255,255,255,0.25)" }}>Latest year</div>
                      </div>
                    </div>
                    <div className="text-2xl font-black text-white" style={{ textShadow:`0 0 14px ${s.glow}55` }}>
                      {loading?<Skeleton w={80} h={28}/>:fmt(val)}
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      {chg>=0?<TrendingUp size={10} style={{ color:"#4ade80" }}/>:<TrendingDown size={10} style={{ color:"#f87171" }}/>}
                      <span className="text-[10px] font-semibold" style={{ color:chg>=0?"#4ade80":"#f87171" }}>{chg>=0?"+":""}{chg.toFixed(1)}% YoY</span>
                    </div>
                    {/* sparkline */}
                    <div style={{ display:"flex",alignItems:"flex-end",gap:2,height:24,marginTop:10 }}>
                      {totalByYear.slice(-8).map((r,ri)=>{
                        const v=r[s.key as keyof HoverRow] as number;
                        const maxV=Math.max(...totalByYear.slice(-8).map(x=>x[s.key as keyof HoverRow] as number),1);
                        return (
                          <div key={ri} style={{ flex:1,height:`${(v/maxV)*100}%`,borderRadius:2,
                            background:`linear-gradient(to top,${s.color}88,${s.color})`,
                            transition:`height .8s cubic-bezier(.22,1,.36,1) ${ri*40}ms`,minHeight:2 }}/>
                        );
                      })}
                    </div>
                    <div style={{ fontSize:8,color:"rgba(255,255,255,0.2)",marginTop:2 }}>8-yr sparkline</div>
                  </div>
                );
              })}
            </div>

            {/* ── TABLE */}
            <div className="card-glass fade-up overflow-hidden" style={{ animationDelay:"0.3s" }}>
              <div className="px-6 py-4" style={{ borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
                <h2 className="text-lg font-bold text-white">📊 Year-by-Year Breakdown</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background:"rgba(255,255,255,0.04)" }}>
                      {["Year","Business Tax","Income Tax","Sales Tax","Property Tax","Total"].map(h=>(
                        <th key={h} className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-widest" style={{ color:"rgba(255,255,255,0.4)" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[...totalByYear].reverse().map((r,i)=>{
                      const chgRow=totalByYear.find(x=>x.jahr===r.jahr-1);
                      const yoyColor=chgRow&&r.total>chgRow.total?"#4ade80":chgRow&&r.total<chgRow.total?"#f87171":"rgba(255,255,255,0.4)";
                      return (
                        <tr key={r.jahr}
                          style={{ borderTop:"1px solid rgba(255,255,255,0.05)",background:i%2===0?"rgba(255,255,255,0.02)":"transparent",transition:"background .15s" }}
                          onMouseEnter={e=>(e.currentTarget.style.background="rgba(255,255,255,0.06)")}
                          onMouseLeave={e=>(e.currentTarget.style.background=i%2===0?"rgba(255,255,255,0.02)":"transparent")}>
                          <td className="px-5 py-2.5 font-bold" style={{ color:"#fbbf24" }}>{r.jahr}</td>
                          <td className="px-5 py-2.5 tabular-nums" style={{ color:"#60a5fa" }}>{fmt(r.gewerbesteuer)}</td>
                          <td className="px-5 py-2.5 tabular-nums" style={{ color:"#4ade80" }}>{fmt(r.einkommensteuer)}</td>
                          <td className="px-5 py-2.5 tabular-nums" style={{ color:"#fbbf24" }}>{fmt(r.umsatzsteuer)}</td>
                          <td className="px-5 py-2.5 tabular-nums" style={{ color:"#c084fc" }}>{fmt(r.grundsteuer)}</td>
                          <td className="px-5 py-2.5 tabular-nums font-bold" style={{ color:yoyColor,textShadow:`0 0 8px ${yoyColor}44` }}>{fmt(r.total)}</td>
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
