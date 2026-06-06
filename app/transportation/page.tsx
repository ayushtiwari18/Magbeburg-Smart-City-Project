"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import {
  Bus, Train, Moon, TreePine, Globe, Eye, EyeOff, Users, TrendingUp,
  MapPin, Clock, Zap, ChevronLeft, ChevronRight, Car, Anchor, BarChart2,
  Activity, Leaf, Navigation
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

// ── Recharts dynamic import guard (SSR-safe)
const IS_BROWSER = typeof window !== "undefined";

const RAW = "https://raw.githubusercontent.com/SmartCityMagdeburg2026/Datasources/main/data";
const GTFS_BASE = `${RAW}/OEV-Daten_NASA_GmbH/GTFS`;

// ── Colour tokens
const C = {
  blue:   "#58a6ff",
  orange: "#ff7b54",
  green:  "#2fc77f",
  purple: "#d2a8ff",
  yellow: "#ffd166",
  red:    "#ef4444",
  teal:   "#06d6a0",
  amber:  "#fb8500",
  bg:     "#0d1117",
  panel:  "#161b22",
  border: "rgba(255,255,255,0.08)",
  muted:  "#8b949e",
  text:   "#e6edf3",
};

// ── Static dashboard data (from attached datasets)
const FLEET_DATA = [
  {year:2011,cars:100619,trucks:13383,motorcycles:4817,bicycles:716,total:123590},
  {year:2012,cars:101847,trucks:13738,motorcycles:4959,bicycles:642,total:125346},
  {year:2013,cars:102897,trucks:13842,motorcycles:5131,bicycles:646,total:126837},
  {year:2014,cars:104080,trucks:8725, motorcycles:5311,bicycles:576,total:128802},
  {year:2015,cars:105635,trucks:9071, motorcycles:5403,bicycles:583,total:131046},
  {year:2016,cars:107047,trucks:9320, motorcycles:5587,bicycles:557,total:133199},
  {year:2017,cars:107923,trucks:9707, motorcycles:5663,bicycles:571,total:134831},
  {year:2018,cars:109291,trucks:10101,motorcycles:5730,bicycles:556,total:137005},
  {year:2019,cars:109797,trucks:10385,motorcycles:5781,bicycles:543,total:138142},
  {year:2020,cars:110659,trucks:10716,motorcycles:6064,bicycles:542,total:139908},
  {year:2021,cars:110818,trucks:10987,motorcycles:6310,bicycles:577,total:141001},
  {year:2022,cars:110418,trucks:11259,motorcycles:6494,bicycles:590,total:141345},
  {year:2023,cars:110529,trucks:9626, motorcycles:6651,bicycles:446,total:142179},
  {year:2024,cars:111373,trucks:9995, motorcycles:6838,bicycles:910,total:143791},
  {year:2025,cars:111588,trucks:10076,motorcycles:6959,bicycles:909,total:144339},
];

const FUEL_DATA = [
  {name:"Gasoline",  value:74446, color:C.blue},
  {name:"Diesel",    value:26837, color:C.orange},
  {name:"Full Hybrid",value:8001, color:C.green},
  {name:"Mild Hybrid",value:2425, color:C.teal},
  {name:"Electric",  value:2679,  color:C.yellow},
  {name:"Gas/LPG",   value:633,   color:C.purple},
];

const GREEN_DATA = [
  {year:"2023", electric:534, mildHybrid:445, fullHybrid:1164},
  {year:"2024", electric:2679,mildHybrid:2425,fullHybrid:8001},
  {year:"2025", electric:101, mildHybrid:392, fullHybrid:1284},
];

const LICENCE_DATA = [
  {year:2012,total:5590, car:2035,moto:956,truck:382},
  {year:2013,total:5350, car:2048,moto:972,truck:394},
  {year:2014,total:6199, car:2229,moto:1018,truck:391},
  {year:2015,total:5483, car:2310,moto:1073,truck:341},
  {year:2016,total:5758, car:2365,moto:1051,truck:379},
  {year:2017,total:5998, car:2552,moto:1130,truck:394},
  {year:2018,total:6189, car:2722,moto:1124,truck:407},
  {year:2019,total:6544, car:2642,moto:1122,truck:381},
  {year:2020,total:5843, car:2566,moto:846, truck:321},
  {year:2021,total:7907, car:2259,moto:903, truck:320},
  {year:2022,total:12527,car:3018,moto:1078,truck:312},
  {year:2023,total:12138,car:3055,moto:1149,truck:302},
  {year:2024,total:11197,car:2769,moto:1066,truck:507},
  {year:2025,total:12770,car:2820,moto:1163,truck:421},
];

const BOAT_DATA = [
  {year:2017,passengers:46815,totalKm:37573,lineKm:21614},
  {year:2018,passengers:27486,totalKm:34686,lineKm:23213},
  {year:2019,passengers:26257,totalKm:30390,lineKm:20600},
  {year:2020,passengers:23573,totalKm:34807,lineKm:19306},
  {year:2021,passengers:29933,totalKm:39000,lineKm:22885},
  {year:2022,passengers:33308,totalKm:40060,lineKm:25280},
  {year:2023,passengers:33366,totalKm:33557,lineKm:21003},
  {year:2024,passengers:41525,totalKm:36501,lineKm:24816},
];

const HBF_DATA = [
  {year:1998,total:1017704,longDist:26392,local:976666},
  {year:2000,total:1006398,longDist:67821,local:913429},
  {year:2002,total:914605, longDist:94551,local:782476},
  {year:2004,total:941661, longDist:253042,local:619090},
  {year:2006,total:945384, longDist:393160,local:460421},
  {year:2008,total:918444, longDist:420934,local:378126},
  {year:2010,total:871682, longDist:488000,local:267884},
  {year:2012,total:886778, longDist:532648,local:225902},
  {year:2014,total:819335, longDist:496498,local:183489},
  {year:2016,total:814380, longDist:473666,local:184498},
  {year:2018,total:772939, longDist:454028,local:169156},
  {year:2019,total:716186, longDist:415461,local:165275},
].map(d => ({...d, total:Math.round(d.total/1000), longDist:Math.round(d.longDist/1000), local:Math.round(d.local/1000)}));

const MOTORISATION_DATA = FLEET_DATA.map(d => ({
  year: d.year,
  totalPer1k: +(d.total/237565*1000).toFixed(1),
  carsPer1k:  +(d.cars/237565*1000).toFixed(1),
}));

// ── GTFS / live map config (unchanged from original)
interface KissRow { [key: string]: number | string | null; }
interface KissData { columns: { id: string; label: string; unit?: string }[]; rows: KissRow[]; }
interface GtfsStop { stop_id: string; stop_name: string; stop_lat: string; stop_lon: string; }
interface GtfsRoute { route_id: string; route_short_name: string; route_long_name: string; route_type: string; }

const OPERATORS = [
  { key:"mvb",  label:"MVB",   full:"Magdeburger Verkehrsbetriebe",          type:"Tram + City Bus",        Icon:Train,    color:"#1d4ed8", vehicleEmoji:"🚊",
    markerHtml:(c:string)=>`<div style="position:relative;width:34px;height:34px"><div style="position:absolute;inset:0;border-radius:50%;background:${c};opacity:0.2;animation:ping 1.6s ease-in-out infinite"></div><div style="position:absolute;inset:4px;border-radius:50%;background:${c};border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;font-size:12px">🚊</div></div>`,
    peakHours:[5,20,45,90,140,200,280,310,250,210,190,200,240,210,190,200,280,320,260,190,130,90,50,20] },
  { key:"kvg",  label:"KVG",   full:"Kraftverkehrsgesellschaft mbH",          type:"Regional Bus",           Icon:Bus,      color:"#0891b2", vehicleEmoji:"🚌",
    markerHtml:(c:string)=>`<div style="position:relative;width:34px;height:34px"><div style="position:absolute;inset:0;border-radius:50%;background:${c};opacity:0.18;animation:ping 1.9s ease-in-out infinite"></div><div style="position:absolute;inset:4px;border-radius:50%;background:${c};border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;font-size:12px">🚌</div></div>`,
    peakHours:[0,5,10,20,35,60,90,110,90,80,70,75,85,75,70,80,100,110,85,55,35,20,10,5] },
  { key:"njl",  label:"NJL",   full:"Night & Rural Lines",                    type:"Night / Rural",          Icon:Moon,     color:"#7c3aed", vehicleEmoji:"🌙",
    markerHtml:(c:string)=>`<div style="position:relative;width:34px;height:34px"><div style="position:absolute;inset:4px;border-radius:50%;background:${c};border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;font-size:12px">🌙</div></div>`,
    peakHours:[15,20,25,10,5,5,8,10,8,6,5,5,6,5,5,6,8,10,12,20,30,35,40,35] },
  { key:"pvgs", label:"PVGS",  full:"Personenverkehrsgesellschaft Salzlandkreis",type:"Salzlandkreis Bus",     Icon:TreePine, color:"#059669", vehicleEmoji:"🚍",
    markerHtml:(c:string)=>`<div style="position:relative;width:34px;height:34px"><div style="position:absolute;inset:0;border-radius:50%;background:${c};opacity:0.18;animation:ping 2.1s ease-in-out infinite"></div><div style="position:absolute;inset:4px;border-radius:50%;background:${c};border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;font-size:12px">🚍</div></div>`,
    peakHours:[0,2,5,10,20,40,60,70,55,45,40,42,50,45,40,45,60,65,50,35,20,10,5,2] },
  { key:"boerdebus",label:"Börde",full:"Bördebus — Landkreis Börde",          type:"Landkreis Börde",        Icon:Globe,    color:"#d97706", vehicleEmoji:"🚐",
    markerHtml:(c:string)=>`<div style="position:relative;width:34px;height:34px"><div style="position:absolute;inset:4px;border-radius:50%;background:${c};border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;font-size:12px">🚐</div></div>`,
    peakHours:[0,2,4,8,15,30,45,55,42,35,30,32,38,35,30,35,45,50,38,25,15,8,4,2] },
];

const VEHICLE_SEEDS: Record<string,[number,number][]> = {
  mvb:       [[52.130,11.628],[52.122,11.641],[52.115,11.617],[52.108,11.652],[52.136,11.598],[52.119,11.663]],
  kvg:       [[52.098,11.590],[52.145,11.675],[52.088,11.620],[52.155,11.600]],
  njl:       [[52.075,11.570],[52.165,11.690]],
  pvgs:      [[52.060,11.550],[52.170,11.710],[52.050,11.610]],
  boerdebus: [[52.040,11.530],[52.180,11.720]],
};

async function loadJSZip(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as unknown as {JSZip?:unknown}).JSZip) { resolve(); return; }
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
    s.onload = () => resolve(); s.onerror = reject;
    document.head.appendChild(s);
  });
}

async function parseGtfsFile<T>(zipUrl:string, filename:string): Promise<T[]> {
  const JSZip = (window as unknown as {JSZip?:new()=>{
    loadAsync(data:ArrayBuffer):Promise<{files:Record<string,{async(type:"string"):Promise<string>}>}>;
  }}).JSZip;
  if (!JSZip) throw new Error("JSZip not loaded");
  const res = await fetch(zipUrl); const buf = await res.arrayBuffer();
  const zip = await new JSZip().loadAsync(buf);
  const file = zip.files[filename] ?? zip.files[Object.keys(zip.files).find(k=>k.endsWith(filename))??"" ];
  if (!file) throw new Error(`${filename} not found`);
  const text = await file.async("string");
  const lines = text.split("\n").map(l=>l.trim()).filter(Boolean);
  const headers = lines[0].split(",").map(h=>h.replace(/\r/g,""));
  return lines.slice(1).map(line=>{
    const vals = line.split(",");
    return Object.fromEntries(headers.map((h,i)=>[h,vals[i]?.replace(/\r/g,"")??"" ])) as T;
  });
}

// ── Custom tooltip ──────────────────────────────────────────────────────────
const DarkTooltip = ({ active, payload, label }: {
  active?:boolean; payload?:{name:string;value:number;color:string}[]; label?:string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{background:"#1c2333",border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 14px",fontSize:12,color:C.text,boxShadow:"0 8px 32px rgba(0,0,0,0.5)"}}>
      <p style={{margin:"0 0 6px",fontWeight:700,color:C.muted}}>{label}</p>
      {payload.map(p=>(
        <p key={p.name} style={{margin:"2px 0",display:"flex",alignItems:"center",gap:6}}>
          <span style={{width:8,height:8,borderRadius:"50%",background:p.color,display:"inline-block"}}/>
          <span style={{color:C.muted}}>{p.name}:</span>
          <strong style={{color:p.color}}>{typeof p.value==="number"&&p.value>999?p.value.toLocaleString():p.value}</strong>
        </p>
      ))}
    </div>
  );
};

// ── Stat card ───────────────────────────────────────────────────────────────
function StatCard({icon:Icon,value,label,sub,color="#58a6ff",animate=false}:{
  icon:React.ElementType;value:string;label:string;sub?:string;color?:string;animate?:boolean;
}) {
  const [v,setV] = useState("—");
  useEffect(()=>{ if (animate) { let i=0; const t=setInterval(()=>{ i+=0.05; setV(value); if(i>=1)clearInterval(t); },20); return ()=>clearInterval(t); } else setV(value); },[value,animate]);
  return (
    <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:12,padding:"16px 18px",display:"flex",flexDirection:"column",gap:6,position:"relative",overflow:"hidden",transition:"box-shadow 0.2s"}}
      onMouseEnter={e=>(e.currentTarget.style.boxShadow=`0 0 0 1px ${color}44,0 4px 20px rgba(0,0,0,0.4)`)}
      onMouseLeave={e=>(e.currentTarget.style.boxShadow="none")}>
      <div style={{position:"absolute",right:12,top:12,opacity:0.12,transform:"scale(2.2)"}}><Icon size={20} color={color}/></div>
      <div style={{display:"flex",alignItems:"center",gap:6}}><Icon size={14} color={color}/><span style={{fontSize:11,color:C.muted,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em"}}>{label}</span></div>
      <div style={{fontSize:26,fontWeight:800,color:C.text,fontVariantNumeric:"tabular-nums"}}>{v}</div>
      {sub&&<div style={{fontSize:11,color:C.muted}}>{sub}</div>}
    </div>
  );
}

// ── Section heading ─────────────────────────────────────────────────────────
function SectionTitle({icon:Icon,title,subtitle,color="#58a6ff"}:{
  icon:React.ElementType;title:string;subtitle:string;color?:string;
}) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
      <div style={{width:40,height:40,borderRadius:10,background:`${color}22`,border:`1px solid ${color}44`,display:"flex",alignItems:"center",justifyContent:"center"}}>
        <Icon size={18} color={color}/>
      </div>
      <div>
        <h2 style={{margin:0,fontSize:18,fontWeight:700,color:C.text}}>{title}</h2>
        <p style={{margin:0,fontSize:12,color:C.muted}}>{subtitle}</p>
      </div>
    </div>
  );
}

// ── Chart card wrapper ───────────────────────────────────────────────────────
function ChartCard({title,children,height=280}:{title:string;children:React.ReactNode;height?:number}) {
  return (
    <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:12,padding:"18px 20px"}}>
      <p style={{margin:"0 0 14px",fontSize:13,fontWeight:600,color:C.text}}>{title}</p>
      <div style={{height}}>{children}</div>
    </div>
  );
}

// ── Donut (SVG, no dep) ─────────────────────────────────────────────────────
function DonutChart({segments,size=72}:{segments:{label:string;value:number;color:string}[];size?:number}) {
  const total=segments.reduce((s,d)=>s+d.value,0);
  if(total===0) return <div style={{height:size,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{width:20,height:20,borderRadius:"50%",border:"3px solid rgba(255,255,255,0.1)",borderTopColor:"#60a5fa",animation:"spin 0.8s linear infinite"}}/></div>;
  let angle=-Math.PI/2;
  const R=size*0.42;const cx=size/2;const cy=size/2;
  const slices=segments.map(s=>{
    const sweep=(s.value/total)*2*Math.PI;
    const x1=cx+R*Math.cos(angle);const y1=cy+R*Math.sin(angle);
    angle+=sweep;
    const x2=cx+R*Math.cos(angle);const y2=cy+R*Math.sin(angle);
    return{...s,d:`M${cx},${cy} L${x1},${y1} A${R},${R} 0 ${sweep>Math.PI?1:0} 1 ${x2},${y2} Z`};
  });
  return(
    <div style={{display:"flex",alignItems:"center",gap:10}}>
      <svg viewBox={`0 0 ${size} ${size}`} style={{width:size,height:size,flexShrink:0}}>
        {slices.map(s=><path key={s.label} d={s.d} fill={s.color} stroke="#0f172a" strokeWidth="1"/>)}
        <circle cx={cx} cy={cy} r={R*0.52} fill="#1e293b"/>
        <text x={cx} y={cy-3} textAnchor="middle" fill="white" fontSize={size*0.11} fontWeight="700">{total}</text>
        <text x={cx} y={cy+9} textAnchor="middle" fill="#64748b" fontSize={size*0.09}>routes</text>
      </svg>
      <div style={{display:"flex",flexDirection:"column",gap:3}}>
        {segments.map(s=>(<div key={s.label} style={{display:"flex",alignItems:"center",gap:5}}><span style={{width:7,height:7,borderRadius:"50%",background:s.color,flexShrink:0}}/><span style={{fontSize:10,color:"#94a3b8"}}>{s.label}</span><span style={{fontSize:10,color:"#60a5fa",marginLeft:"auto",fontVariantNumeric:"tabular-nums"}}>{s.value}</span></div>))}
      </div>
    </div>
  );
}

// ── Peak bar chart ───────────────────────────────────────────────────────────
function PeakChart({visible}:{visible:Set<string>}) {
  const combined=Array.from({length:24},(_,h)=>OPERATORS.filter(op=>visible.has(op.key)).reduce((s,op)=>s+(op.peakHours[h]??0),0));
  const max=Math.max(...combined,1);const peakH=combined.indexOf(Math.max(...combined));
  const W=254;const H=56;const pad=14;const bw=(W-pad*2)/24-1;
  return(
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",height:56}}>
      <defs><linearGradient id="bg2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#60a5fa"/><stop offset="100%" stopColor="#818cf8"/></linearGradient></defs>
      {Array.from({length:24},(_,h)=>{
        const x=pad+h*((W-pad*2)/24);const bH=(combined[h]/max)*(H-pad);const y=H-bH-4;const isPeak=h===peakH;
        return(<g key={h}><rect x={x} y={y} width={Math.max(bw,2)} height={bH} fill={isPeak?"#f59e0b":"url(#bg2)"} rx="1" opacity={isPeak?1:0.75}/>{h%6===0&&<text x={x+bw/2} y={H} textAnchor="middle" fill="#475569" fontSize="7">{String(h).padStart(2,"0")}</text>}{isPeak&&<text x={x+bw/2} y={y-2} textAnchor="middle" fill="#f59e0b" fontSize="7" fontWeight="700">▲</text>}</g>);
      })}
    </svg>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// TABS CONFIG
// ════════════════════════════════════════════════════════════════════════════
const TABS = [
  {id:"live",    label:"🗺️ Live Map",   icon:Navigation},
  {id:"fleet",   label:"🚗 Fleet",      icon:Car},
  {id:"green",   label:"🔋 Green",      icon:Leaf},
  {id:"licences",label:"🪪 Licences",   icon:BarChart2},
  {id:"boats",   label:"⛵ Weiße Flotte",icon:Anchor},
  {id:"rail",    label:"🚆 Rail",       icon:Activity},
];

// ════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════════════════
export default function Transportation() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);
  const stopLayersRef = useRef<Record<string,unknown>>({});
  const vehicleLayersRef = useRef<Record<string,unknown[]>>({});
  const vehicleTimersRef = useRef<ReturnType<typeof setInterval>[]>([]);

  const [activeTab, setActiveTab] = useState("live");
  const [visible, setVisible] = useState<Set<string>>(new Set(OPERATORS.map(o=>o.key)));
  const [opStops, setOpStops] = useState<Record<string,GtfsStop[]>>({});
  const [opRoutes, setOpRoutes] = useState<Record<string,GtfsRoute[]>>({});
  const [opLoading, setOpLoading] = useState<Record<string,boolean>>(Object.fromEntries(OPERATORS.map(o=>[o.key,true])));
  const [ridershipData, setRidershipData] = useState<{year:number;passengers:number}[]>([]);
  const [kissLoading, setKissLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(()=>{ setMounted(true); },[]);

  useEffect(()=>{
    if(document.getElementById("tp-style")) return;
    const s=document.createElement("style"); s.id="tp-style";
    s.textContent=`@keyframes ping{0%,100%{transform:scale(1);opacity:0.5}50%{transform:scale(1.85);opacity:0}} @keyframes spin{to{transform:rotate(360deg)}} @keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}} @keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`;
    document.head.appendChild(s);
  },[]);

  const initMap = useCallback(()=>{
    const L=(window as unknown as {L:typeof import("leaflet")}).L;
    if(!L||!mapRef.current||mapInstanceRef.current) return;
    const map=L.map(mapRef.current,{center:[52.1205,11.6276],zoom:12,zoomControl:false});
    mapInstanceRef.current=map;
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",{
      attribution:"&copy; OpenStreetMap &copy; CARTO",subdomains:"abcd",maxZoom:19,
    }).addTo(map);
    L.control.zoom({position:"bottomright"}).addTo(map);
    OPERATORS.forEach(op=>{
      stopLayersRef.current[op.key]=L.layerGroup().addTo(map);
      vehicleLayersRef.current[op.key]=[];
    });
  },[]);

  useEffect(()=>{
    if(activeTab!=="live") return;
    const ensure=()=>{
      if((window as unknown as {L?:unknown}).L){initMap();return;}
      if(!document.getElementById("leaflet-css")){const l=document.createElement("link");l.id="leaflet-css";l.rel="stylesheet";l.href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";document.head.appendChild(l);}
      const s=document.createElement("script");s.id="leaflet-js";s.src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";s.onload=initMap;document.head.appendChild(s);
    };
    ensure();
  },[initMap,activeTab]);

  useEffect(()=>{
    fetch(`${RAW}/kiss-md/json/verkehr/befoerderte-personen-der-magdeburger-verkehrsbetriebe-gmbh-und-co-kg.json`)
      .then(r=>r.json()).then((d:KissData)=>{
        const yc=d.columns[0].id;const pc=d.columns[1].id;
        setRidershipData(d.rows.map(r=>({year:Number(r[yc]),passengers:Number(r[pc]??0)})).filter(r=>r.year>=2014&&r.passengers>0));
      }).catch(()=>{}).finally(()=>setKissLoading(false));
  },[]);

  const spawnVehicles = useCallback((op:typeof OPERATORS[0])=>{
    const L=(window as unknown as {L:typeof import("leaflet")}).L;
    const map=mapInstanceRef.current as ReturnType<typeof L.map>;
    if(!L||!map) return;
    const seeds=VEHICLE_SEEDS[op.key]??[];
    const icon=L.divIcon({html:op.markerHtml(op.color),className:"",iconSize:[34,34],iconAnchor:[17,17]});
    seeds.forEach((seed,idx)=>{
      const marker=L.marker(seed,{icon})
        .bindPopup(`<div style="font-family:system-ui;min-width:140px"><div style="font-weight:700;color:${op.color};font-size:13px">${op.vehicleEmoji} ${op.label} #${idx+1}</div><div style="font-size:11px;color:#475569;margin-top:2px">${op.full}</div><div style="font-size:11px;margin-top:4px">Type: <strong>${op.type}</strong></div><div style="font-size:11px;color:#64748b;margin-top:2px">Status: <span style="color:#22c55e">● In service</span></div></div>`)
        .addTo(map);
      vehicleLayersRef.current[op.key].push(marker);
      const t=setInterval(()=>{
        const p=marker.getLatLng();
        marker.setLatLng([p.lat+(Math.random()-0.5)*0.0015,p.lng+(Math.random()-0.5)*0.0015]);
      },2800+idx*400);
      vehicleTimersRef.current.push(t);
    });
  },[]);

  const loadOperator = useCallback(async(op:typeof OPERATORS[0])=>{
    try{
      await loadJSZip();
      const zipUrl=`${GTFS_BASE}/gtfs_${op.key}_std_kn.zip`;
      const [routes,stops]=await Promise.all([parseGtfsFile<GtfsRoute>(zipUrl,"routes.txt"),parseGtfsFile<GtfsStop>(zipUrl,"stops.txt")]);
      setOpRoutes(prev=>({...prev,[op.key]:routes}));
      setOpStops(prev=>({...prev,[op.key]:stops}));
      const L=(window as unknown as {L:typeof import("leaflet")}).L;
      const lg=stopLayersRef.current[op.key] as ReturnType<typeof L.layerGroup>;
      if(L&&lg){
        const stopIcon=L.divIcon({html:`<div style="width:8px;height:8px;border-radius:50%;background:${op.color};border:1.5px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.3)"></div>`,className:"",iconSize:[8,8],iconAnchor:[4,4]});
        stops.slice(0,300).forEach(stop=>{
          const lat=parseFloat(stop.stop_lat);const lon=parseFloat(stop.stop_lon);
          if(isNaN(lat)||isNaN(lon)) return;
          L.marker([lat,lon],{icon:stopIcon}).bindPopup(`<div style="font-family:system-ui"><div style="font-weight:600;color:${op.color};font-size:12px">${stop.stop_name}</div><div style="font-size:11px;color:#64748b">${op.label} · ${op.type}</div></div>`).addTo(lg);
        });
      }
      spawnVehicles(op);
    }catch{ /* skip */ }
    finally{setOpLoading(prev=>({...prev,[op.key]:false}));}
  },[spawnVehicles]);

  useEffect(()=>{
    if(activeTab!=="live") return;
    OPERATORS.forEach((op,i)=>setTimeout(()=>loadOperator(op),i*700));
    return()=>{vehicleTimersRef.current.forEach(clearInterval);};
  },[loadOperator,activeTab]);

  const toggleOperator=useCallback((key:string)=>{
    const L=(window as unknown as {L:typeof import("leaflet")}).L;
    const map=mapInstanceRef.current as ReturnType<typeof L.map>;
    if(!L||!map) return;
    setVisible(prev=>{
      const next=new Set(prev);
      if(next.has(key)){next.delete(key);const lg=stopLayersRef.current[key];if(lg)map.removeLayer(lg as Parameters<typeof map.removeLayer>[0]);vehicleLayersRef.current[key]?.forEach(m=>map.removeLayer(m as Parameters<typeof map.removeLayer>[0]));}
      else{next.add(key);const lg=stopLayersRef.current[key];if(lg)map.addLayer(lg as Parameters<typeof map.addLayer>[0]);vehicleLayersRef.current[key]?.forEach(m=>map.addLayer(m as Parameters<typeof map.addLayer>[0]));}
      return next;
    });
  },[]);

  const totalStops=Object.values(opStops).reduce((s,a)=>s+a.length,0);
  const totalRoutes=Object.values(opRoutes).reduce((s,a)=>s+a.length,0);
  const allLoaded=OPERATORS.every(op=>!opLoading[op.key]);
  const latestRidership=ridershipData.at(-1);
  const maxPass=Math.max(...ridershipData.map(d=>d.passengers),1);
  const donutData=OPERATORS.map(op=>({label:op.label,value:opRoutes[op.key]?.length??0,color:op.color})).filter(d=>d.value>0);
  const now=new Date();
  const timeStr=now.toLocaleTimeString("de-DE",{hour:"2-digit",minute:"2-digit"});

  const CARD:React.CSSProperties={background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:10,padding:"10px 12px",marginBottom:8};
  const LABEL:React.CSSProperties={fontSize:9,fontWeight:700,color:"#475569",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:6,display:"flex",alignItems:"center",gap:3};

  // ── Latest fleet snapshot
  const latest = FLEET_DATA.at(-1)!;

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100vh",overflow:"hidden",fontFamily:"Inter,system-ui,sans-serif",background:C.bg,color:C.text}}>

      {/* ══ TOP STRIP ══ */}
      <div style={{background:"#0c1526",borderBottom:`1px solid ${C.border}`,padding:"8px 16px",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:6}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:30,height:30,borderRadius:7,background:"#1d4ed8",display:"flex",alignItems:"center",justifyContent:"center"}}><Bus size={15} color="white"/></div>
          <div>
            <div style={{fontSize:13,fontWeight:700,color:"white",lineHeight:1}}>Transport Network</div>
            <div style={{fontSize:9,color:"#60a5fa",marginTop:1}}>Magdeburg · {timeStr} · {allLoaded?"● Live":"◌ Loading…"}</div>
          </div>
        </div>
        <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
          {[
            {Icon:MapPin,  val:totalStops>0?totalStops.toLocaleString():"—",  label:"Stops",    c:"#3b82f6"},
            {Icon:TrendingUp,val:totalRoutes>0?String(totalRoutes):"—",       label:"Routes",   c:"#06b6d4"},
            {Icon:Users,  val:latestRidership?`${(latestRidership.passengers/1e6).toFixed(1)}M`:"—",label:`Rides ${latestRidership?.year??""}`,c:"#8b5cf6"},
            {Icon:Train,  val:String(OPERATORS.filter(o=>visible.has(o.key)).length),label:"Active",c:"#10b981"},
            {Icon:Car,    val:latest.total.toLocaleString(),label:"Vehicles 2025",c:C.yellow},
          ].map(k=>(
            <div key={k.label} style={{display:"flex",alignItems:"center",gap:4,background:"rgba(255,255,255,0.05)",border:`1px solid ${C.border}`,borderRadius:16,padding:"3px 8px"}}>
              <k.Icon size={10} color={k.c}/>
              <span style={{fontSize:12,fontWeight:700,color:"white",fontVariantNumeric:"tabular-nums"}}>{k.val}</span>
              <span style={{fontSize:9,color:"#64748b"}}>{k.label}</span>
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
          {OPERATORS.map(op=>{
            const on=visible.has(op.key);const loading=opLoading[op.key];const Icon=op.Icon;
            return(
              <button key={op.key} onClick={()=>toggleOperator(op.key)}
                style={{display:"flex",alignItems:"center",gap:3,padding:"3px 8px",borderRadius:16,fontSize:10,fontWeight:600,border:`1.5px solid ${on?op.color:"rgba(255,255,255,0.12)"}`,background:on?op.color:"transparent",color:on?"white":"#64748b",cursor:"pointer",transition:"all 0.15s",opacity:on?1:0.5}}>
                {loading?<span style={{width:7,height:7,borderRadius:"50%",border:"1.5px solid rgba(255,255,255,0.3)",borderTopColor:"white",display:"inline-block",animation:"spin 0.7s linear infinite"}}/>:on?<Eye size={8}/>:<EyeOff size={8}/>}
                <Icon size={8}/><span>{op.label}</span>
                <span style={{fontSize:8}}>{op.vehicleEmoji}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ══ TAB BAR ══ */}
      <div style={{background:"#0c1526",borderBottom:`1px solid ${C.border}`,padding:"0 16px",display:"flex",gap:2,flexShrink:0}}>
        {TABS.map(tab=>{
          const active=activeTab===tab.id;
          return(
            <button key={tab.id} onClick={()=>setActiveTab(tab.id)}
              style={{padding:"10px 14px",fontSize:12,fontWeight:active?700:500,background:"transparent",border:"none",borderBottom:active?`2px solid ${C.blue}`:"2px solid transparent",color:active?C.blue:C.muted,cursor:"pointer",transition:"all 0.15s",whiteSpace:"nowrap"}}>
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ══ BODY ══ */}
      <div style={{flex:1,minHeight:0,overflow:"hidden",display:"flex"}}>

        {/* ══════════════════ LIVE MAP TAB ══════════════════ */}
        {activeTab==="live" && (
          <div style={{display:"flex",flex:1,minHeight:0,overflow:"hidden"}}>
            {/* sidebar */}
            <div style={{width:sidebarOpen?290:0,minWidth:sidebarOpen?290:0,overflow:"hidden",transition:"width 0.25s,min-width 0.25s",background:"#0f172a",borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column"}}>
              <div style={{flex:1,overflowY:"auto",padding:"12px 12px 8px",scrollbarWidth:"none"}}>
                <div style={CARD}>
                  <div style={LABEL}><Users size={8}/>MVB Ridership · KISS-MD</div>
                  {kissLoading?Array.from({length:5}).map((_,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:5,marginBottom:5}}><div style={{width:24,height:8,borderRadius:3,background:"rgba(255,255,255,0.06)"}}/><div style={{flex:1,height:5,borderRadius:3,background:"rgba(255,255,255,0.06)"}}/><div style={{width:26,height:8,borderRadius:3,background:"rgba(255,255,255,0.06)"}}/></div>)):ridershipData.length===0?(<p style={{fontSize:10,color:"#475569",textAlign:"center"}}>No data</p>):(
                    ridershipData.slice(-8).map(d=>(
                      <div key={d.year} style={{display:"flex",alignItems:"center",gap:5,marginBottom:4}}>
                        <span style={{fontSize:9,color:"#60a5fa",width:26,fontVariantNumeric:"tabular-nums"}}>{d.year}</span>
                        <div style={{flex:1,height:5,background:"rgba(255,255,255,0.06)",borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:`${Math.round((d.passengers/maxPass)*100)}%`,background:"linear-gradient(90deg,#3b82f6,#06b6d4)",borderRadius:3,transition:"width 0.8s"}}/></div>
                        <span style={{fontSize:9,color:"#94a3b8",width:28,textAlign:"right",fontVariantNumeric:"tabular-nums"}}>{(d.passengers/1e6).toFixed(1)}M</span>
                      </div>
                    ))
                  )}
                </div>
                <div style={CARD}><div style={LABEL}><Zap size={8}/>Routes by Operator</div><DonutChart segments={donutData} size={72}/></div>
                <div style={CARD}><div style={LABEL}><Clock size={8}/>Departures by Hour</div><div style={{fontSize:8,color:"#475569",marginBottom:4}}>▲ amber bar = network peak hour</div><PeakChart visible={visible}/></div>
                <div style={{marginBottom:4}}>
                  <div style={LABEL}><TrendingUp size={8}/>Operator Breakdown</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5}}>
                    {OPERATORS.map(op=>{
                      const peakH=op.peakHours.indexOf(Math.max(...op.peakHours));
                      const avgTrips=Math.round(op.peakHours.reduce((a,b)=>a+b,0)/Math.max(op.peakHours.filter(Boolean).length,1));
                      const Icon=op.Icon;const mx=Math.max(...op.peakHours,1);
                      const pts=op.peakHours.map((v,h)=>`${(h/23)*90+5},${22-(v/mx)*16}`);
                      return(
                        <div key={op.key} style={{background:"rgba(255,255,255,0.03)",border:`1px solid ${visible.has(op.key)?op.color+"44":"rgba(255,255,255,0.06)"}`,borderRadius:8,padding:"7px 8px",opacity:visible.has(op.key)?1:0.4,transition:"opacity 0.2s"}}>
                          <div style={{display:"flex",alignItems:"center",gap:4,marginBottom:4}}><div style={{width:16,height:16,borderRadius:4,background:op.color,display:"flex",alignItems:"center",justifyContent:"center"}}><Icon size={9} color="white"/></div><div><div style={{fontSize:9,fontWeight:700,color:"white"}}>{op.vehicleEmoji} {op.label}</div><div style={{fontSize:8,color:"#475569"}}>{op.type}</div></div></div>
                          <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                            <div style={{textAlign:"center"}}><div style={{fontSize:11,fontWeight:700,color:op.color,fontVariantNumeric:"tabular-nums"}}>{opLoading[op.key]?"…":(opStops[op.key]?.length??0).toLocaleString()}</div><div style={{fontSize:7,color:"#475569"}}>stops</div></div>
                            <div style={{textAlign:"center"}}><div style={{fontSize:11,fontWeight:700,color:op.color}}>{String(peakH).padStart(2,"0")}h</div><div style={{fontSize:7,color:"#475569"}}>peak</div></div>
                            <div style={{textAlign:"center"}}><div style={{fontSize:11,fontWeight:700,color:op.color}}>{avgTrips}</div><div style={{fontSize:7,color:"#475569"}}>avg/h</div></div>
                          </div>
                          <svg viewBox="0 0 100 24" style={{width:"100%",height:18}}><defs><linearGradient id={`sp-${op.key}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={op.color} stopOpacity="0.25"/><stop offset="100%" stopColor={op.color} stopOpacity="0"/></linearGradient></defs><path d={`M${pts[0]} ${pts.slice(1).map(p=>`L${p}`).join(" ")} L95,22 L5,22 Z`} fill={`url(#sp-${op.key})`}/><polyline points={pts.join(" ")} fill="none" stroke={op.color} strokeWidth="1.2" strokeLinejoin="round"/></svg>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div style={{fontSize:8,color:"#334155",marginTop:4,lineHeight:1.5}}>GTFS: NASA GmbH · Ridership: KISS-MD<br/>Datenlizenz Deutschland – v2.0</div>
              </div>
            </div>
            <button onClick={()=>setSidebarOpen(v=>!v)} style={{width:18,background:"#1e293b",border:"none",borderRight:`1px solid ${C.border}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#64748b",flexShrink:0,zIndex:10}} title={sidebarOpen?"Hide stats":"Show stats"}>
              {sidebarOpen?<ChevronLeft size={12}/>:<ChevronRight size={12}/>}
            </button>
            <div style={{position:"relative",flex:1,minWidth:0}}>
              <div ref={mapRef} style={{width:"100%",height:"100%"}}/>
              <div style={{position:"absolute",top:10,left:10,zIndex:999,background:"rgba(15,23,42,0.88)",backdropFilter:"blur(8px)",borderRadius:10,padding:"5px 10px",border:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:5}}>
                <span style={{width:6,height:6,borderRadius:"50%",background:"#22c55e",display:"inline-block",animation:"ping 1.5s ease-in-out infinite"}}/>
                <span style={{fontSize:10,fontWeight:700,color:"white"}}>LIVE</span>
                <span style={{fontSize:9,color:"#64748b"}}>vehicles · stops</span>
              </div>
              <div style={{position:"absolute",bottom:20,left:10,zIndex:999,background:"rgba(15,23,42,0.9)",backdropFilter:"blur(10px)",borderRadius:12,padding:"8px 12px",border:`1px solid ${C.border}`,minWidth:160}}>
                <div style={{fontSize:8,fontWeight:700,color:"#475569",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:4}}>Legend</div>
                {OPERATORS.map(op=>{
                  const Icon=op.Icon;
                  return(<div key={op.key} style={{display:"flex",alignItems:"center",gap:5,marginBottom:3,opacity:visible.has(op.key)?1:0.25}}><div style={{width:16,height:16,borderRadius:4,background:op.color,display:"flex",alignItems:"center",justifyContent:"center"}}><Icon size={9} color="white"/></div><span style={{fontSize:9,color:"#94a3b8",fontWeight:600}}>{op.vehicleEmoji} {op.label}</span><span style={{fontSize:8,color:"#334155",marginLeft:"auto"}}>{op.type}</span></div>);
                })}
              </div>
              {!allLoaded&&(<div style={{position:"absolute",top:10,right:10,zIndex:999,background:"rgba(15,23,42,0.88)",backdropFilter:"blur(8px)",borderRadius:16,padding:"4px 10px",border:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:5,fontSize:10,color:"#64748b"}}><span style={{width:7,height:7,borderRadius:"50%",border:"1.5px solid rgba(255,255,255,0.15)",borderTopColor:"#60a5fa",display:"inline-block",animation:"spin 0.8s linear infinite"}}/>Loading GTFS…</div>)}
            </div>
          </div>
        )}

        {/* ══════════════════ FLEET TAB ══════════════════ */}
        {activeTab==="fleet" && mounted && (
          <div style={{flex:1,overflowY:"auto",padding:"24px",animation:"fadeIn 0.35s ease"}}>
            <SectionTitle icon={Car} title="Vehicle Fleet — Magdeburg 2011–2025" subtitle="Source: Kraftfahrzeugbestand | Steady growth to 144,339 registered vehicles" color={C.blue}/>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:12,marginBottom:24}}>
              <StatCard icon={Car}        value={latest.total.toLocaleString()} label="Total Vehicles" sub="2025" color={C.blue} animate/>
              <StatCard icon={Car}        value={latest.cars.toLocaleString()}  label="Passenger Cars" sub="2025" color={C.green} animate/>
              <StatCard icon={TrendingUp} value={latest.motorcycles.toLocaleString()} label="Motorcycles" sub="2025" color={C.orange} animate/>
              <StatCard icon={Activity}   value={latest.trucks.toLocaleString()} label="Trucks/LGV" sub="2025" color={C.purple} animate/>
              <StatCard icon={Navigation} value="587" label="Per 1,000 Residents" sub="motorisation rate 2025" color={C.yellow} animate/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
              <ChartCard title="🚗 Total Vehicle Fleet Growth (thousands)" height={260}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={FLEET_DATA} margin={{top:5,right:10,left:0,bottom:5}}>
                    <defs>
                      <linearGradient id="gTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={C.blue} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={C.blue} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#21262d"/>
                    <XAxis dataKey="year" tick={{fill:C.muted,fontSize:11}} tickLine={false}/>
                    <YAxis tickFormatter={v=>Math.round(v/1000)+"k"} tick={{fill:C.muted,fontSize:11}} tickLine={false} axisLine={false}/>
                    <Tooltip content={<DarkTooltip/>}/>
                    <Area type="monotone" dataKey="total" name="Total Fleet" stroke={C.blue} strokeWidth={2.5} fill="url(#gTotal)" isAnimationActive animationDuration={1200}/>
                  </AreaChart>
                </ResponsiveContainer>
              </ChartCard>
              <ChartCard title="🔢 Fleet by Type (thousands)" height={260}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={FLEET_DATA} margin={{top:5,right:10,left:0,bottom:5}}>
                    <defs>
                      {[["gCars",C.blue],["gTrucks",C.green],["gMoto",C.orange]].map(([id,c])=>(
                        <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={c} stopOpacity={0.25}/>
                          <stop offset="95%" stopColor={c} stopOpacity={0}/>
                        </linearGradient>
                      ))}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#21262d"/>
                    <XAxis dataKey="year" tick={{fill:C.muted,fontSize:11}} tickLine={false}/>
                    <YAxis tickFormatter={v=>Math.round(v/1000)+"k"} tick={{fill:C.muted,fontSize:11}} tickLine={false} axisLine={false}/>
                    <Tooltip content={<DarkTooltip/>}/>
                    <Legend wrapperStyle={{fontSize:11,color:C.muted}}/>
                    <Area type="monotone" dataKey="cars" name="Cars" stroke={C.blue} strokeWidth={2} fill="url(#gCars)" isAnimationActive animationDuration={1000}/>
                    <Area type="monotone" dataKey="trucks" name="Trucks" stroke={C.green} strokeWidth={2} fill="url(#gTrucks)" isAnimationActive animationDuration={1100}/>
                    <Area type="monotone" dataKey="motorcycles" name="Motorcycles" stroke={C.orange} strokeWidth={2} fill="url(#gMoto)" isAnimationActive animationDuration={1200}/>
                  </AreaChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>
            <ChartCard title="🏙️ Motorisation Rate — Vehicles per 1,000 Residents" height={220}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MOTORISATION_DATA} margin={{top:5,right:10,left:0,bottom:5}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#21262d"/>
                  <XAxis dataKey="year" tick={{fill:C.muted,fontSize:11}} tickLine={false}/>
                  <YAxis domain={[480,610]} tick={{fill:C.muted,fontSize:11}} tickLine={false} axisLine={false}/>
                  <Tooltip content={<DarkTooltip/>}/>
                  <Legend wrapperStyle={{fontSize:11,color:C.muted}}/>
                  <Line type="monotone" dataKey="totalPer1k" name="Total/1k" stroke={C.purple} strokeWidth={2.5} dot={{r:3,fill:C.purple}} isAnimationActive animationDuration={1200}/>
                  <Line type="monotone" dataKey="carsPer1k" name="Cars/1k" stroke={C.blue} strokeWidth={2.5} dot={{r:3,fill:C.blue}} isAnimationActive animationDuration={1000}/>
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        )}

        {/* ══════════════════ GREEN TAB ══════════════════ */}
        {activeTab==="green" && mounted && (
          <div style={{flex:1,overflowY:"auto",padding:"24px",animation:"fadeIn 0.35s ease"}}>
            <SectionTitle icon={Leaf} title="Green & Alternative Fuel Vehicles" subtitle="Source: Fahrzeugbestand Kraftstoff | EV and hybrid registrations surging since 2023" color={C.green}/>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:12,marginBottom:24}}>
              <StatCard icon={Zap}    value="2,679" label="Pure Electric" sub="2024 city total" color={C.yellow} animate/>
              <StatCard icon={Leaf}   value="8,001" label="Full Hybrid" sub="2024 city total" color={C.green} animate/>
              <StatCard icon={Leaf}   value="2,425" label="Mild Hybrid" sub="2024 city total" color={C.teal} animate/>
              <StatCard icon={TrendingUp} value="63.0%" label="Gasoline share" sub="118k total 2024" color={C.blue} animate/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              <ChartCard title="⛽ Fuel Mix — Magdeburg 2024 (city total)" height={300}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={FUEL_DATA} cx="50%" cy="50%" innerRadius="52%" outerRadius="75%" paddingAngle={3} dataKey="value" nameKey="name" isAnimationActive animationDuration={1000} animationBegin={200}>
                      {FUEL_DATA.map((entry,i)=>(<Cell key={i} fill={entry.color} stroke={C.bg} strokeWidth={2}/>))}
                    </Pie>
                    <Tooltip content={<DarkTooltip/>}/>
                    <Legend wrapperStyle={{fontSize:11,color:C.muted}}/>
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>
              <ChartCard title="🔋 Green Vehicle Registrations 2023–2025" height={300}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={GREEN_DATA} margin={{top:5,right:10,left:0,bottom:5}}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#21262d"/>
                    <XAxis dataKey="year" tick={{fill:C.muted,fontSize:11}} tickLine={false}/>
                    <YAxis tick={{fill:C.muted,fontSize:11}} tickLine={false} axisLine={false}/>
                    <Tooltip content={<DarkTooltip/>}/>
                    <Legend wrapperStyle={{fontSize:11,color:C.muted}}/>
                    <Bar dataKey="electric" name="Pure EV" fill={C.yellow} radius={[4,4,0,0]} isAnimationActive animationDuration={800}/>
                    <Bar dataKey="mildHybrid" name="Mild Hybrid" fill={C.teal} radius={[4,4,0,0]} isAnimationActive animationDuration={900}/>
                    <Bar dataKey="fullHybrid" name="Full Hybrid" fill={C.green} radius={[4,4,0,0]} isAnimationActive animationDuration={1000}/>
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>
          </div>
        )}

        {/* ══════════════════ LICENCES TAB ══════════════════ */}
        {activeTab==="licences" && mounted && (
          <div style={{flex:1,overflowY:"auto",padding:"24px",animation:"fadeIn 0.35s ease"}}>
            <SectionTitle icon={BarChart2} title="Driver's Licences Issued — Magdeburg" subtitle="Source: Führerscheine | Post-COVID surge: 12,527 in 2022 vs 5,843 in 2020" color={C.purple}/>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:12,marginBottom:24}}>
              <StatCard icon={BarChart2} value="12,770" label="Total Licences" sub="2025" color={C.purple} animate/>
              <StatCard icon={Car}       value="2,820"  label="Car (Class B)" sub="2025" color={C.blue} animate/>
              <StatCard icon={Activity}  value="1,163"  label="Motorcycles" sub="2025" color={C.orange} animate/>
              <StatCard icon={TrendingUp} value="+119%" label="Growth 2020→2022" sub="COVID rebound" color={C.green} animate/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr",gap:16}}>
              <ChartCard title="🪪 Licences Issued per Year — by Category" height={300}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={LICENCE_DATA} margin={{top:5,right:10,left:0,bottom:5}}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#21262d"/>
                    <XAxis dataKey="year" tick={{fill:C.muted,fontSize:11}} tickLine={false}/>
                    <YAxis tick={{fill:C.muted,fontSize:11}} tickLine={false} axisLine={false}/>
                    <Tooltip content={<DarkTooltip/>}/>
                    <Legend wrapperStyle={{fontSize:11,color:C.muted}}/>
                    <Bar dataKey="car" name="Car (B)" fill={C.blue} stackId="a" isAnimationActive animationDuration={800}/>
                    <Bar dataKey="moto" name="Motorcycle" fill={C.orange} stackId="a" isAnimationActive animationDuration={900}/>
                    <Bar dataKey="truck" name="Truck/HGV" fill={C.green} stackId="a" radius={[4,4,0,0]} isAnimationActive animationDuration={1000}/>
                    <Line type="monotone" dataKey="total" name="Total" stroke={C.purple} strokeWidth={2.5} dot={{r:3}} isAnimationActive animationDuration={1200}/>
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>
          </div>
        )}

        {/* ══════════════════ BOATS TAB ══════════════════ */}
        {activeTab==="boats" && mounted && (
          <div style={{flex:1,overflowY:"auto",padding:"24px",animation:"fadeIn 0.35s ease"}}>
            <SectionTitle icon={Anchor} title="Weiße Flotte — River Transport 2017–2024" subtitle="Source: Weisse Flotte GmbH | COVID dip 2018–2020, strong rebound to 41,525 passengers in 2024" color={C.teal}/>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:12,marginBottom:24}}>
              <StatCard icon={Users}      value="41,525" label="Passengers 2024" sub="+24% vs 2023" color={C.teal} animate/>
              <StatCard icon={Navigation} value="36,501" label="Total Routes (km)" sub="2024" color={C.blue} animate/>
              <StatCard icon={Activity}   value="24,816" label="Line Service (km)" sub="2024" color={C.green} animate/>
              <StatCard icon={TrendingUp} value="809"    label="Service Events" sub="2024 (gastronomy)" color={C.yellow} animate/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              <ChartCard title="⛵ Passengers & Route-km by Year" height={280}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={BOAT_DATA} margin={{top:5,right:10,left:0,bottom:5}}>
                    <defs>
                      <linearGradient id="gBoat" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={C.teal} stopOpacity={0.8}/>
                        <stop offset="100%" stopColor={C.teal} stopOpacity={0.3}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#21262d"/>
                    <XAxis dataKey="year" tick={{fill:C.muted,fontSize:11}} tickLine={false}/>
                    <YAxis yAxisId="left" tick={{fill:C.muted,fontSize:11}} tickLine={false} axisLine={false} tickFormatter={v=>Math.round(v/1000)+"k"}/>
                    <YAxis yAxisId="right" orientation="right" tick={{fill:C.muted,fontSize:11}} tickLine={false} axisLine={false} tickFormatter={v=>Math.round(v/1000)+"k"}/>
                    <Tooltip content={<DarkTooltip/>}/>
                    <Legend wrapperStyle={{fontSize:11,color:C.muted}}/>
                    <Bar yAxisId="left" dataKey="passengers" name="Passengers" fill="url(#gBoat)" radius={[4,4,0,0]} isAnimationActive animationDuration={900}/>
                    <Line yAxisId="right" type="monotone" dataKey="totalKm" name="Route-km" stroke={C.orange} strokeWidth={2.5} dot={{r:3}} isAnimationActive animationDuration={1100}/>
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
              <ChartCard title="⛵ Line Service vs Charter Routes (km)" height={280}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={BOAT_DATA} margin={{top:5,right:10,left:0,bottom:5}}>
                    <defs>
                      <linearGradient id="gLine" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={C.blue} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={C.blue} stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="gCharter" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={C.orange} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={C.orange} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#21262d"/>
                    <XAxis dataKey="year" tick={{fill:C.muted,fontSize:11}} tickLine={false}/>
                    <YAxis tick={{fill:C.muted,fontSize:11}} tickLine={false} axisLine={false}/>
                    <Tooltip content={<DarkTooltip/>}/>
                    <Legend wrapperStyle={{fontSize:11,color:C.muted}}/>
                    <Area type="monotone" dataKey="lineKm" name="Line Service" stroke={C.blue} strokeWidth={2} fill="url(#gLine)" isAnimationActive animationDuration={900}/>
                    <Area type="monotone" dataKey="totalKm" name="Total Routes" stroke={C.orange} strokeWidth={2} fill="url(#gCharter)" isAnimationActive animationDuration={1100}/>
                  </AreaChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>
          </div>
        )}

        {/* ══════════════════ RAIL TAB ══════════════════ */}
        {activeTab==="rail" && mounted && (
          <div style={{flex:1,overflowY:"auto",padding:"24px",animation:"fadeIn 0.35s ease"}}>
            <SectionTitle icon={Train} title="Magdeburg Hauptbahnhof — Ticket Sales 1998–2019" subtitle="Source: Vertriebskennziffern | Local tickets collapsed; long-distance rail surged 15× in 20 years" color={C.orange}/>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:12,marginBottom:24}}>
              <StatCard icon={Train}      value="716k"  label="Total Tickets" sub="2019 (thousands)" color={C.orange} animate/>
              <StatCard icon={Navigation} value="415k"  label="Long-Distance" sub="ICE/IC 2019" color={C.blue} animate/>
              <StatCard icon={Activity}   value="165k"  label="Local/Regional" sub="2019 vs 977k in 1998" color={C.red} animate/>
              <StatCard icon={TrendingUp} value="+1,474%" label="ICE growth" sub="1998 → 2012" color={C.green} animate/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr",gap:16}}>
              <ChartCard title="🚆 Ticket Sales Breakdown — Local vs Long-Distance (thousands)" height={320}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={HBF_DATA} margin={{top:5,right:10,left:0,bottom:5}}>
                    <defs>
                      <linearGradient id="gHbfTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={C.purple} stopOpacity={0.2}/>
                        <stop offset="95%" stopColor={C.purple} stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="gHbfLong" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={C.blue} stopOpacity={0.25}/>
                        <stop offset="95%" stopColor={C.blue} stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="gHbfLocal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={C.orange} stopOpacity={0.2}/>
                        <stop offset="95%" stopColor={C.orange} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#21262d"/>
                    <XAxis dataKey="year" tick={{fill:C.muted,fontSize:11}} tickLine={false}/>
                    <YAxis tick={{fill:C.muted,fontSize:11}} tickLine={false} axisLine={false} label={{value:"Tickets (k)",angle:-90,position:"insideLeft",fill:C.muted,fontSize:11}}/>
                    <Tooltip content={<DarkTooltip/>}/>
                    <Legend wrapperStyle={{fontSize:11,color:C.muted}}/>
                    <Area type="monotone" dataKey="total" name="Total" stroke={C.purple} strokeWidth={2} fill="url(#gHbfTotal)" isAnimationActive animationDuration={800}/>
                    <Area type="monotone" dataKey="longDist" name="Long-Distance" stroke={C.blue} strokeWidth={2.5} fill="url(#gHbfLong)" isAnimationActive animationDuration={1000}/>
                    <Area type="monotone" dataKey="local" name="Local/Regional" stroke={C.orange} strokeWidth={2} fill="url(#gHbfLocal)" isAnimationActive animationDuration={1100}/>
                  </AreaChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>
          </div>
        )}

      </div>{/* end body */}

      <style>{`
        ::-webkit-scrollbar{display:none}
        .leaflet-popup-content-wrapper{border-radius:10px!important;box-shadow:0 4px 20px rgba(0,0,0,0.18)!important}
        .leaflet-popup-tip{display:none!important}
        .leaflet-attribution-flag{display:none!important}
      `}</style>
    </div>
  );
}
