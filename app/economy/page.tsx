"use client";
import { useState, useEffect } from "react";
import {
  Building2, Factory, ShoppingCart, Hammer, Zap, TrendingUp,
  Users, BarChart2, Activity, Euro, ChevronRight, Wrench,
  HeartHandshake, BookOpen, UtensilsCrossed
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, ComposedChart,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

const C = {
  blue:   "#2563eb", green:  "#16a34a", orange: "#ea580c", yellow: "#d97706",
  purple: "#7c3aed", teal:   "#0d9488", red:    "#dc2626", cyan:   "#0891b2",
  pink:   "#db2777", lime:   "#65a30d", muted:  "#64748b", text:   "#0f172a",
  bg: "#f8fafc", panel: "#ffffff", border: "#e2e8f0",
};

const IHK_SECTORS = [
  {year:2018,total:13625,manufacturing:1484,trade:2914,transport:393,hospitality:794,finance:601,services:5137,construction:788,other:1497},
  {year:2019,total:13426,manufacturing:1445,trade:2877,transport:392,hospitality:806,finance:585,services:5048,construction:801,other:1456},
  {year:2020,total:13372,manufacturing:1465,trade:2867,transport:371,hospitality:793,finance:609,services:4998,construction:835,other:1417},
  {year:2021,total:13405,manufacturing:1334,trade:2907,transport:430,hospitality:817,finance:695,services:5021,construction:876,other:1306},
  {year:2022,total:12826,manufacturing:1314,trade:2772,transport:384,hospitality:761,finance:699,services:4831,construction:852,other:1192},
  {year:2023,total:12745,manufacturing:1309,trade:2726,transport:369,hospitality:757,finance:706,services:4784,construction:889,other:1185},
];
const CONSTRUCTION_SECTORS = [
  {year:2018,total:624,civil:113,finishing:13,other:498},{year:2019,total:557,civil:112,finishing:15,other:430},
  {year:2020,total:551,civil:110,finishing:18,other:423},{year:2021,total:533,civil:120,finishing:15,other:398},
  {year:2022,total:506,civil:111,finishing:15,other:380},{year:2023,total:504,civil:114,finishing:18,other:372},
];
const TRADE_SECTORS = [
  {year:2018,total:2914,wholesale:1932,retail:662,automotive:320},{year:2019,total:2877,wholesale:1905,retail:641,automotive:331},
  {year:2020,total:2867,wholesale:1905,retail:636,automotive:326},{year:2021,total:2907,wholesale:1941,retail:636,automotive:330},
  {year:2022,total:2772,wholesale:1869,retail:604,automotive:299},{year:2023,total:2726,wholesale:1851,retail:581,automotive:294},
];
const MFG_ANNUAL = [
  {year:2009,plants:82,persons:7044,wages:195146,turnover:1266464},{year:2010,plants:81,persons:7232,wages:204925,turnover:1310772},
  {year:2011,plants:80,persons:7239,wages:218494,turnover:1479783},{year:2012,plants:78,persons:7501,wages:233240,turnover:1630793},
  {year:2013,plants:81,persons:7896,wages:246056,turnover:1541982},{year:2014,plants:81,persons:8208,wages:259516,turnover:1426054},
  {year:2015,plants:76,persons:7915,wages:259460,turnover:1399778},{year:2016,plants:74,persons:7806,wages:262437,turnover:1387850},
  {year:2017,plants:77,persons:7880,wages:273773,turnover:1386051},{year:2018,plants:75,persons:7689,wages:274718,turnover:1289711},
  {year:2019,plants:76,persons:7551,wages:274270,turnover:1319953},{year:2020,plants:73,persons:6799,wages:261259,turnover:1276638},
  {year:2021,plants:70,persons:6190,wages:236164,turnover:1398251},
];
const MFG50_ANNUAL = [
  {year:2009,plants:39,persons:5897,turnover:1099593,domestic:760290,export:339303},
  {year:2010,plants:37,persons:5847,turnover:1162043,domestic:813239,export:348804},
  {year:2011,plants:38,persons:5957,turnover:1338161,domestic:926534,export:411627},
  {year:2012,plants:38,persons:5991,turnover:1488576,domestic:1039214,export:449362},
  {year:2013,plants:39,persons:6104,turnover:1411762,domestic:976210,export:435552},
  {year:2014,plants:39,persons:6290,turnover:1340780,domestic:977020,export:363760},
  {year:2015,plants:39,persons:6326,turnover:1340780,domestic:914212,export:426568},
  {year:2016,plants:39,persons:6319,turnover:1297508,domestic:887468,export:410040},
  {year:2017,plants:39,persons:6432,turnover:1287664,domestic:874270,export:413394},
  {year:2018,plants:39,persons:6556,turnover:1120598,domestic:717503,export:403095},
  {year:2019,plants:38,persons:6333,turnover:1138251,domestic:688497,export:449754},
  {year:2020,plants:37,persons:6060,turnover:1128627,domestic:611762,export:516865},
  {year:2021,plants:33,persons:5530,turnover:1121000,domestic:620000,export:501000},
];
const INVEST_DATA = [
  {year:2009,total:94131,buildings:86128,equipment:0,perPerson:13542},
  {year:2010,total:79119,buildings:71490,equipment:7629,perPerson:11041},
  {year:2011,total:107460,buildings:98637,equipment:8823,perPerson:14977},
  {year:2012,total:160280,buildings:124250,equipment:36030,perPerson:21980},
  {year:2013,total:60756,buildings:51424,equipment:9332,perPerson:7799},
  {year:2014,total:67383,buildings:62112,equipment:5271,perPerson:8333},
  {year:2015,total:66011,buildings:64403,equipment:1607,perPerson:8339},
  {year:2016,total:59246,buildings:46914,equipment:12333,perPerson:7642},
  {year:2017,total:34090,buildings:31944,equipment:2146,perPerson:4461},
  {year:2018,total:54386,buildings:52720,equipment:0,perPerson:7118},
  {year:2019,total:46019,buildings:39576,equipment:6443,perPerson:6316},
  {year:2020,total:35221,buildings:24260,equipment:10961,perPerson:5676},
];
const ENERGY_DATA = [
  {year:2013,consumed:197240,generated:222369,grid:175857},
  {year:2014,consumed:190571,generated:217162,grid:169765},
  {year:2015,consumed:206576,generated:233249,grid:186385},
  {year:2016,consumed:200037,generated:226536,grid:181144},
  {year:2017,consumed:197053,generated:221028,grid:178544},
  {year:2018,consumed:176207,generated:194848,grid:162210},
  {year:2019,consumed:179589,generated:180684,grid:150515},
  {year:2020,consumed:167087,generated:167449,grid:148790},
  {year:2021,consumed:162089,generated:149558,grid:132410},
];
const ENERGY_SUPPLY = [
  {year:2005,employees:1126,wages:1871,revenue:40729},{year:2006,employees:1138,wages:1896,revenue:45598},
  {year:2007,employees:1123,wages:1839,revenue:43411},{year:2008,employees:1098,wages:1765,revenue:44895},
  {year:2009,employees:1099,wages:1753,revenue:46877},{year:2010,employees:1074,wages:1750,revenue:47636},
  {year:2011,employees:1070,wages:1756,revenue:54007},{year:2012,employees:1045,wages:1703,revenue:52090},
  {year:2013,employees:1038,wages:1731,revenue:54266},{year:2014,employees:1042,wages:1753,revenue:55034},
  {year:2015,employees:1015,wages:1636,revenue:51382},{year:2016,employees:1003,wages:1616,revenue:46818},
  {year:2017,employees:976,wages:1560,revenue:44944},{year:2018,employees:957,wages:1545,revenue:43765},
  {year:2019,employees:949,wages:1572,revenue:44501},{year:2020,employees:939,wages:1574,revenue:42703},
  {year:2021,employees:930,wages:1598,revenue:46210},
];
const SECTOR_PIE_2023 = [
  {name:"Services",value:4784,color:C.blue},{name:"Trade",value:2726,color:C.green},
  {name:"Manufacturing",value:1309,color:C.orange},{name:"Construction",value:889,color:C.yellow},
  {name:"Finance",value:706,color:C.purple},{name:"Hospitality",value:757,color:C.teal},
  {name:"Transport",value:369,color:C.cyan},{name:"Other",value:1185,color:C.muted},
];
const MFG_RADAR = [
  {sector:"Food",value:12},{sector:"Chemicals",value:37},{sector:"Metal Prod.",value:29},
  {sector:"Machinery",value:49},{sector:"Electronics",value:22},{sector:"Rubber/Plastics",value:23},
  {sector:"Paper",value:11},{sector:"Textiles",value:43},{sector:"Construction Mat.",value:63},{sector:"Print",value:19},
];
const CRAFT_TOTAL = [
  {year:2010,total:2429,construction:643,electrical:655,wood:277,clothing:140,food:23,health:621,glass:70},
  {year:2011,total:2460,construction:659,electrical:649,wood:286,clothing:136,food:23,health:623,glass:84},
  {year:2012,total:2401,construction:628,electrical:641,wood:272,clothing:131,food:20,health:619,glass:90},
  {year:2013,total:2376,construction:634,electrical:639,wood:255,clothing:131,food:20,health:601,glass:96},
  {year:2014,total:2355,construction:620,electrical:630,wood:250,clothing:144,food:21,health:592,glass:98},
  {year:2015,total:2303,construction:596,electrical:620,wood:225,clothing:148,food:23,health:580,glass:111},
  {year:2016,total:2250,construction:571,electrical:615,wood:205,clothing:143,food:23,health:586,glass:107},
  {year:2017,total:2188,construction:554,electrical:586,wood:195,clothing:134,food:26,health:587,glass:106},
  {year:2018,total:2111,construction:527,electrical:560,wood:184,clothing:137,food:23,health:575,glass:105},
  {year:2019,total:2097,construction:519,electrical:538,wood:180,clothing:136,food:23,health:587,glass:114},
  {year:2020,total:2051,construction:489,electrical:528,wood:175,clothing:133,food:23,health:586,glass:117},
  {year:2021,total:2015,construction:468,electrical:517,wood:164,clothing:123,food:24,health:605,glass:114},
  {year:2022,total:1957,construction:459,electrical:515,wood:154,clothing:107,food:24,health:586,glass:112},
  {year:2023,total:1897,construction:445,electrical:508,wood:146,clothing:100,food:23,health:570,glass:105},
];
const CRAFT_PIE_2023 = [
  {name:"Construction/Expansion",value:445,color:C.yellow},{name:"Electrical/Metal",value:508,color:C.cyan},
  {name:"Wood/Plastics",value:146,color:C.orange},{name:"Health/Hygiene",value:570,color:C.green},
  {name:"Glass/Ceramic/Photo",value:105,color:C.purple},{name:"Food",value:23,color:C.pink},
  {name:"Clothing/Textiles",value:100,color:C.teal},
];
const CONSUMER_ADVISORY = [
  {year:2013,total:13010,inPerson:5163,phone:7835,online:12},
  {year:2014,total:10648,inPerson:5431,phone:5204,online:13},
  {year:2015,total:8323,inPerson:4765,phone:3548,online:10},
  {year:2016,total:7220,inPerson:4188,phone:3009,online:23},
  {year:2017,total:6548,inPerson:3543,phone:3002,online:3},
  {year:2018,total:6295,inPerson:3179,phone:2881,online:235},
  {year:2019,total:7791,inPerson:3104,phone:4397,online:290},
  {year:2020,total:12599,inPerson:2285,phone:8187,online:2127},
  {year:2021,total:9949,inPerson:1909,phone:6954,online:1086},
];
const IHK_VS_CRAFT = [
  {year:2018,ihkTotal:13625,craftTotal:2111},{year:2019,ihkTotal:13426,craftTotal:2097},
  {year:2020,ihkTotal:13372,craftTotal:2051},{year:2021,ihkTotal:13405,craftTotal:2015},
  {year:2022,ihkTotal:12826,craftTotal:1957},{year:2023,ihkTotal:12745,craftTotal:1897},
];

const TABS = [
  {id:"overview",     label:"🏙️ Overview"},
  {id:"companies",    label:"🏢 IHK Companies"},
  {id:"manufacturing",label:"🏭 Manufacturing"},
  {id:"investment",   label:"💶 Investment"},
  {id:"energy",       label:"⚡ Energy"},
  {id:"trade",        label:"🛒 Trade"},
  {id:"handwerk",     label:"🔧 Crafts"},
  {id:"consumer",     label:"🫱 Consumer Advisory"},
];

type TooltipPayload = {name:string;value:number;color:string};
const LightTooltip = ({active,payload,label}:{active?:boolean;payload?:TooltipPayload[];label?:string}) => {
  if(!active||!payload?.length) return null;
  return(
    <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:8,padding:"10px 14px",fontSize:12,color:"#0f172a",boxShadow:"0 4px 16px rgba(0,0,0,0.10)"}}>
      <p style={{margin:"0 0 6px",fontWeight:700,color:"#64748b"}}>{label}</p>
      {payload.map(p=>(
        <p key={p.name} style={{margin:"2px 0",display:"flex",alignItems:"center",gap:6}}>
          <span style={{width:8,height:8,borderRadius:"50%",background:p.color,display:"inline-block"}}/>
          <span style={{color:"#64748b"}}>{p.name}:</span>
          <strong style={{color:p.color}}>{typeof p.value==="number"&&p.value>999?p.value.toLocaleString():p.value}</strong>
        </p>
      ))}
    </div>
  );
};

function StatCard({icon:Icon,value,label,sub,color=C.blue,delta}:{icon:React.ElementType;value:string;label:string;sub?:string;color?:string;delta?:string;}){
  return(
    <div className="bg-white rounded-xl border border-slate-200 p-4 relative overflow-hidden hover:shadow-md transition-shadow">
      <div style={{position:"absolute",right:12,top:12,opacity:0.08}}><Icon size={32} color={color}/></div>
      <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
        <Icon size={14} color={color}/>
        <span style={{fontSize:11,color:C.muted,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em"}}>{label}</span>
      </div>
      <div style={{fontSize:24,fontWeight:800,color:C.text,fontVariantNumeric:"tabular-nums"}}>{value}</div>
      {sub&&<div style={{fontSize:11,color:C.muted,marginTop:2}}>{sub}</div>}
      {delta&&<div style={{fontSize:11,color:delta.startsWith("+")?C.green:C.red,marginTop:2,fontWeight:600}}>{delta}</div>}
    </div>
  );
}

function ChartCard({title,height=280,children}:{title:string;height?:number;children:React.ReactNode;}){
  return(
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <p style={{margin:"0 0 14px",fontSize:13,fontWeight:600,color:C.text}}>{title}</p>
      <div style={{height}}>{children}</div>
    </div>
  );
}

function SectionTitle({icon:Icon,title,subtitle,color=C.blue}:{icon:React.ElementType;title:string;subtitle:string;color?:string;}){
  return(
    <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
      <div style={{width:42,height:42,borderRadius:10,background:`${color}18`,border:`1.5px solid ${color}33`,display:"flex",alignItems:"center",justifyContent:"center"}}>
        <Icon size={20} color={color}/>
      </div>
      <div>
        <h2 style={{margin:0,fontSize:20,fontWeight:700,color:C.text}}>{title}</h2>
        <p style={{margin:0,fontSize:12,color:C.muted}}>{subtitle}</p>
      </div>
    </div>
  );
}

export default function EconomyDashboard(){
  const [tab,setTab]=useState("overview");
  const [mounted,setMounted]=useState(false);
  const [liveTime,setLiveTime]=useState("");
  useEffect(()=>setMounted(true),[]);

  useEffect(()=>{
    const tick=()=>setLiveTime(new Date().toLocaleTimeString("de-DE",{hour:"2-digit",minute:"2-digit",second:"2-digit"}));
    tick(); const t=setInterval(tick,1000); return()=>clearInterval(t);
  },[]);

  const latestIHK   = IHK_SECTORS.at(-1)!;
  const latestMFG   = MFG_ANNUAL.at(-1)!;
  const latestCraft = CRAFT_TOTAL.at(-1)!;
  const latestCons  = CONSUMER_ADVISORY.at(-1)!;

  const GRID  = {display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))",gap:12,marginBottom:24};
  const GRID2 = {display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16};

  const kpiTiles = [
    {Icon:Building2,      val:latestIHK.total.toLocaleString(),   label:"IHK Companies",  sub:"2023",                color:"#60a5fa"},
    {Icon:Wrench,         val:latestCraft.total.toLocaleString(),  label:"Craft Firms",     sub:"2023",                color:"#fbbf24"},
    {Icon:Factory,        val:String(latestMFG.plants),            label:"Mfg Plants",      sub:"≥20 employees 2021",  color:"#fb923c"},
    {Icon:Users,          val:latestMFG.persons.toLocaleString(),  label:"Mfg Employees",   sub:"2021",                color:"#34d399"},
    {Icon:TrendingUp,     val:"€1.40B",                            label:"Mfg Turnover",    sub:"2021",                color:"#c084fc"},
    {Icon:HeartHandshake, val:latestCons.total.toLocaleString(),   label:"Consultations",   sub:"Verbraucherzentrale", color:"#f472b6"},
  ];

  return(
    <div className="bg-[#f8fafc] min-h-screen">

      {/* ── GLANCE BAR */}
      <div className="sticky top-0 z-40 bg-[#061B46] border-b border-white/10 shadow-xl">
        <div className="px-4 lg:px-8">
          <div className="flex items-center gap-4 py-2.5 border-b border-white/10">
            <div className="flex items-center gap-2.5 flex-shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20">
                <Building2 className="h-4 w-4 text-blue-300" />
              </div>
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-widest text-blue-300/70">Smart City Magdeburg</div>
                <div className="text-sm font-bold text-white leading-tight">Economy Dashboard</div>
              </div>
            </div>
            <div className="h-6 w-px bg-white/10 flex-shrink-0" />
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" style={{animation:"ping 1.5s ease-in-out infinite"}}/>
              <span className="text-xs font-mono font-bold text-green-300">{liveTime||"—"}</span>
            </div>
            <div className="h-6 w-px bg-white/10 flex-shrink-0" />
            <span className="text-[10px] text-white/40 uppercase tracking-widest">IHK · Handwerkskammer · Statistisches Amt · Verbraucherzentrale</span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 divide-x divide-white/10">
            {kpiTiles.map(k=>(
              <div key={k.label} className="flex flex-col items-center justify-center py-3 px-2 text-center hover:bg-white/5 transition-colors cursor-default">
                <k.Icon size={12} color={k.color} />
                <div className="text-xl font-bold tabular-nums text-white leading-tight mt-1">{k.val}</div>
                <div className="text-[10px] font-semibold text-white/60 mt-0.5">{k.label}</div>
                <div className="text-[9px] text-white/30">{k.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tab Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-[108px] z-30 px-6">
        <div className="max-w-7xl mx-auto flex gap-1 overflow-x-auto">
          {TABS.map(t=>{
            const active=tab===t.id;
            return(
              <button key={t.id} onClick={()=>setTab(t.id)}
                style={{padding:"11px 16px",fontSize:12,fontWeight:active?700:500,background:"transparent",border:"none",borderBottom:active?`2px solid ${C.blue}`:"2px solid transparent",color:active?C.blue:C.muted,cursor:"pointer",transition:"all 0.15s",whiteSpace:"nowrap"}}>
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Content */}
      {mounted&&(
        <div style={{padding:"28px 24px",maxWidth:1400,margin:"0 auto"}}>

          {/* OVERVIEW */}
          {tab==="overview"&&(
            <>
              <SectionTitle icon={Building2} title="Magdeburg Economy at a Glance" subtitle="Snapshot 2023 · Source: IHK, Handwerkskammer & Statistisches Amt" color={C.blue}/>
              <div style={GRID}>
                <StatCard icon={Building2}    value={latestIHK.total.toLocaleString()}        label="Total IHK Companies"  sub="2023" delta="-880 vs 2018" color={C.blue}/>
                <StatCard icon={Wrench}       value={latestCraft.total.toLocaleString()}       label="Craft Businesses"     sub="2023" delta="-532 vs 2010" color={C.yellow}/>
                <StatCard icon={Factory}      value={latestIHK.manufacturing.toLocaleString()} label="Manufacturing Firms"  sub="2023" color={C.orange}/>
                <StatCard icon={ShoppingCart} value={latestIHK.trade.toLocaleString()}         label="Trade Companies"      sub="2023" color={C.green}/>
                <StatCard icon={Hammer}       value={latestCraft.construction.toString()}      label="Build Crafts 2023"    sub="Bau+Ausbau" delta="-198 vs 2010" color={C.teal}/>
                <StatCard icon={HeartHandshake} value={latestCons.total.toLocaleString()}      label="Advisory Sessions"    sub="Verbraucherzentrale 2021" color={C.pink}/>
              </div>
              <div style={GRID2}>
                <ChartCard title="🏙️ IHK Company Trend 2018–2023" height={260}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={IHK_SECTORS} margin={{top:5,right:10,left:0,bottom:5}}>
                      <defs><linearGradient id="gTot" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.blue} stopOpacity={0.15}/><stop offset="95%" stopColor={C.blue} stopOpacity={0}/></linearGradient></defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
                      <XAxis dataKey="year" tick={{fill:C.muted,fontSize:11}} tickLine={false}/>
                      <YAxis domain={[12000,14000]} tick={{fill:C.muted,fontSize:11}} tickLine={false} axisLine={false} tickFormatter={v=>v.toLocaleString()}/>
                      <Tooltip content={<LightTooltip/>}/>
                      <Area type="monotone" dataKey="total" name="IHK Total" stroke={C.blue} strokeWidth={2.5} fill="url(#gTot)" isAnimationActive animationDuration={1000}/>
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartCard>
                <ChartCard title="🔧 Craft Businesses vs IHK Companies 2018–2023" height={260}>
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={IHK_VS_CRAFT} margin={{top:5,right:10,left:0,bottom:5}}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
                      <XAxis dataKey="year" tick={{fill:C.muted,fontSize:11}} tickLine={false}/>
                      <YAxis yAxisId="left" tick={{fill:C.muted,fontSize:11}} tickLine={false} axisLine={false} tickFormatter={v=>v.toLocaleString()}/>
                      <YAxis yAxisId="right" orientation="right" tick={{fill:C.muted,fontSize:11}} tickLine={false} axisLine={false}/>
                      <Tooltip content={<LightTooltip/>}/>
                      <Legend wrapperStyle={{fontSize:10,color:C.muted}}/>
                      <Bar  yAxisId="left"  dataKey="ihkTotal"   name="IHK Companies" fill={C.blue}   radius={[3,3,0,0]} isAnimationActive animationDuration={800}/>
                      <Line yAxisId="right" dataKey="craftTotal" name="Craft Firms"   stroke={C.orange} strokeWidth={2.5} dot={{r:3}} isAnimationActive animationDuration={1000}/>
                    </ComposedChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>
              <div style={GRID2}>
                <ChartCard title="🥧 IHK Sector Mix — 2023" height={280}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={SECTOR_PIE_2023} cx="50%" cy="50%" innerRadius="45%" outerRadius="72%" paddingAngle={2} dataKey="value" nameKey="name" isAnimationActive animationDuration={900} animationBegin={200}>
                        {SECTOR_PIE_2023.map((e,i)=>(<Cell key={i} fill={e.color} stroke="#fff" strokeWidth={2}/>))}
                      </Pie>
                      <Tooltip content={<LightTooltip/>}/>
                      <Legend wrapperStyle={{fontSize:10,color:C.muted}}/>
                    </PieChart>
                  </ResponsiveContainer>
                </ChartCard>
                <ChartCard title="🔧 Craft Sector Mix — 2023" height={280}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={CRAFT_PIE_2023} cx="50%" cy="50%" innerRadius="45%" outerRadius="72%" paddingAngle={2} dataKey="value" nameKey="name" isAnimationActive animationDuration={900} animationBegin={300}>
                        {CRAFT_PIE_2023.map((e,i)=>(<Cell key={i} fill={e.color} stroke="#fff" strokeWidth={2}/>))}
                      </Pie>
                      <Tooltip content={<LightTooltip/>}/>
                      <Legend wrapperStyle={{fontSize:10,color:C.muted}}/>
                    </PieChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>
            </>
          )}

          {/* IHK COMPANIES */}
          {tab==="companies"&&(
            <>
              <SectionTitle icon={BarChart2} title="IHK Companies by Sector 2018–2023" subtitle="Source: IHK Magdeburg" color={C.purple}/>
              <div style={GRID}>
                <StatCard icon={ShoppingCart} value="2,726" label="Trade Total 2023"  sub="Wholesale + Retail + Auto" delta="-188 vs 2018" color={C.green}/>
                <StatCard icon={ShoppingCart} value="1,851" label="Wholesale 2023"    sub="67.9% of trade" color={C.blue}/>
                <StatCard icon={ShoppingCart} value="581"   label="Retail 2023"       delta="-81 vs 2018" color={C.orange}/>
                <StatCard icon={Hammer}       value="504"   label="Construction 2023" sub="IHK firms" delta="-120 vs 2018" color={C.yellow}/>
              </div>
              <div style={GRID2}>
                <ChartCard title="🛒 Trade Sub-Sectors 2018–2023" height={270}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={TRADE_SECTORS} margin={{top:5,right:10,left:0,bottom:5}}>
                      <defs>
                        {([["gW",C.blue],["gR",C.orange],["gA",C.green]] as [string,string][]).map(([id,c])=>(
                          <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={c} stopOpacity={0.15}/><stop offset="95%" stopColor={c} stopOpacity={0}/></linearGradient>
                        ))}
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
                      <XAxis dataKey="year" tick={{fill:C.muted,fontSize:11}} tickLine={false}/>
                      <YAxis tick={{fill:C.muted,fontSize:11}} tickLine={false} axisLine={false}/>
                      <Tooltip content={<LightTooltip/>}/>
                      <Legend wrapperStyle={{fontSize:10,color:C.muted}}/>
                      <Area type="monotone" dataKey="wholesale"  name="Wholesale"  stroke={C.blue}   strokeWidth={2} fill="url(#gW)" isAnimationActive animationDuration={900}/>
                      <Area type="monotone" dataKey="retail"     name="Retail"     stroke={C.orange} strokeWidth={2} fill="url(#gR)" isAnimationActive animationDuration={1000}/>
                      <Area type="monotone" dataKey="automotive" name="Automotive" stroke={C.green}  strokeWidth={2} fill="url(#gA)" isAnimationActive animationDuration={1100}/>
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartCard>
                <ChartCard title="🏗️ Construction Sub-Sectors 2018–2023" height={270}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={CONSTRUCTION_SECTORS} margin={{top:5,right:10,left:0,bottom:5}}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
                      <XAxis dataKey="year" tick={{fill:C.muted,fontSize:11}} tickLine={false}/>
                      <YAxis tick={{fill:C.muted,fontSize:11}} tickLine={false} axisLine={false}/>
                      <Tooltip content={<LightTooltip/>}/>
                      <Legend wrapperStyle={{fontSize:10,color:C.muted}}/>
                      <Bar dataKey="other"    name="General"    fill={C.yellow} stackId="a" isAnimationActive animationDuration={800}/>
                      <Bar dataKey="civil"    name="Civil Eng." fill={C.blue}   stackId="a" isAnimationActive animationDuration={900}/>
                      <Bar dataKey="finishing" name="Finishing" fill={C.orange} stackId="a" radius={[4,4,0,0]} isAnimationActive animationDuration={1000}/>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>
              <ChartCard title="🕷️ Manufacturing Sub-Sectors Radar (2023)" height={320}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={MFG_RADAR} margin={{top:10,right:30,left:30,bottom:10}}>
                    <PolarGrid stroke="#e2e8f0"/>
                    <PolarAngleAxis dataKey="sector" tick={{fill:C.muted,fontSize:10}}/>
                    <Radar name="Companies" dataKey="value" stroke={C.orange} fill={C.orange} fillOpacity={0.15} isAnimationActive animationDuration={900}/>
                    <Tooltip content={<LightTooltip/>}/>
                  </RadarChart>
                </ResponsiveContainer>
              </ChartCard>
            </>
          )}

          {/* MANUFACTURING */}
          {tab==="manufacturing"&&(
            <>
              <SectionTitle icon={Factory} title="Manufacturing Sector — Magdeburg 2009–2021" subtitle="Plants ≥20 employees · Source: Statistisches Amt" color={C.orange}/>
              <div style={GRID}>
                <StatCard icon={Factory}      value="70"      label="Plants 2021"       sub="≥20 employees" delta="-12 vs 2009" color={C.orange}/>
                <StatCard icon={Users}        value="6,190"   label="Employees 2021"    delta="-854 vs 2012 peak" color={C.blue}/>
                <StatCard icon={Euro}         value="€236M"   label="Total Wages 2021"  sub="k€ 236,164" color={C.green}/>
                <StatCard icon={TrendingUp}   value="€1.40B"  label="Turnover 2021"     sub="k€ 1,398,251" color={C.yellow}/>
                <StatCard icon={Activity}     value="39"      label="Plants ≥50 (peak)" sub="2009–2011" color={C.purple}/>
                <StatCard icon={ChevronRight} value="36%"     label="Export share 2020" sub="highest recorded" color={C.teal}/>
              </div>
              <div style={GRID2}>
                <ChartCard title="🏭 Plants & Employees (≥20) 2009–2021" height={270}>
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={MFG_ANNUAL} margin={{top:5,right:10,left:0,bottom:5}}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
                      <XAxis dataKey="year" tick={{fill:C.muted,fontSize:11}} tickLine={false}/>
                      <YAxis yAxisId="left"  tick={{fill:C.muted,fontSize:11}} tickLine={false} axisLine={false}/>
                      <YAxis yAxisId="right" orientation="right" tick={{fill:C.muted,fontSize:11}} tickLine={false} axisLine={false}/>
                      <Tooltip content={<LightTooltip/>}/>
                      <Legend wrapperStyle={{fontSize:10,color:C.muted}}/>
                      <Bar  yAxisId="right" dataKey="plants"  name="Plants"     fill={C.orange} radius={[3,3,0,0]} isAnimationActive animationDuration={800}/>
                      <Line yAxisId="left"  dataKey="persons" name="Employees"  stroke={C.blue} strokeWidth={2.5} dot={{r:3}} isAnimationActive animationDuration={1000}/>
                    </ComposedChart>
                  </ResponsiveContainer>
                </ChartCard>
                <ChartCard title="💶 Wages vs Turnover (≥20) 2009–2021 (k€M)" height={270}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={MFG_ANNUAL} margin={{top:5,right:10,left:0,bottom:5}}>
                      <defs>
                        <linearGradient id="gT"  x1="0" y1="0" x2="0" y2="1"><stop offset="5%"  stopColor={C.yellow} stopOpacity={0.2}/><stop offset="95%" stopColor={C.yellow} stopOpacity={0}/></linearGradient>
                        <linearGradient id="gW2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%"  stopColor={C.green}  stopOpacity={0.15}/><stop offset="95%" stopColor={C.green}  stopOpacity={0}/></linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
                      <XAxis dataKey="year" tick={{fill:C.muted,fontSize:11}} tickLine={false}/>
                      <YAxis tickFormatter={v=>Math.round(v/1000)+"M"} tick={{fill:C.muted,fontSize:11}} tickLine={false} axisLine={false}/>
                      <Tooltip content={<LightTooltip/>}/>
                      <Legend wrapperStyle={{fontSize:10,color:C.muted}}/>
                      <Area type="monotone" dataKey="turnover" name="Turnover" stroke={C.yellow} strokeWidth={2.5} fill="url(#gT)"  isAnimationActive animationDuration={1000}/>
                      <Area type="monotone" dataKey="wages"    name="Wages"    stroke={C.green}  strokeWidth={2}   fill="url(#gW2)" isAnimationActive animationDuration={900}/>
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>
              <ChartCard title="📦 Domestic vs Export Turnover — ≥50 employees 2009–2021 (k€)" height={280}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={MFG50_ANNUAL} margin={{top:5,right:10,left:0,bottom:5}}>
                    <defs>
                      <linearGradient id="gDom" x1="0" y1="0" x2="0" y2="1"><stop offset="5%"  stopColor={C.blue}   stopOpacity={0.15}/><stop offset="95%" stopColor={C.blue}   stopOpacity={0}/></linearGradient>
                      <linearGradient id="gExp" x1="0" y1="0" x2="0" y2="1"><stop offset="5%"  stopColor={C.orange} stopOpacity={0.15}/><stop offset="95%" stopColor={C.orange} stopOpacity={0}/></linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
                    <XAxis dataKey="year" tick={{fill:C.muted,fontSize:11}} tickLine={false}/>
                    <YAxis tickFormatter={v=>Math.round(v/1000)+"M"} tick={{fill:C.muted,fontSize:11}} tickLine={false} axisLine={false}/>
                    <Tooltip content={<LightTooltip/>}/>
                    <Legend wrapperStyle={{fontSize:10,color:C.muted}}/>
                    <Area type="monotone" dataKey="domestic" name="Domestic" stroke={C.blue}   strokeWidth={2.5} fill="url(#gDom)" isAnimationActive animationDuration={900}/>
                    <Area type="monotone" dataKey="export"   name="Export"   stroke={C.orange} strokeWidth={2.5} fill="url(#gExp)" isAnimationActive animationDuration={1100}/>
                  </AreaChart>
                </ResponsiveContainer>
              </ChartCard>
            </>
          )}

          {/* INVESTMENT */}
          {tab==="investment"&&(
            <>
              <SectionTitle icon={Euro} title="Capital Investment — Manufacturing 2009–2020" subtitle="Plants ≥20 employees · Source: Statistisches Amt · All values in k€" color={C.yellow}/>
              <div style={GRID}>
                <StatCard icon={Euro}       value="€160M"  label="Peak Investment"   sub="2012 (k€ 160,280)" color={C.yellow}/>
                <StatCard icon={TrendingUp} value="€35M"   label="Investment 2020"   sub="k€ 35,221" delta="-78% vs 2012" color={C.red}/>
                <StatCard icon={Building2}  value="69%"    label="Buildings share"   sub="2020 (€24M of €35M)" color={C.blue}/>
                <StatCard icon={Activity}   value="€5,676" label="Invest/Employee"   sub="2020 (k€)" color={C.purple}/>
              </div>
              <div style={GRID2}>
                <ChartCard title="💶 Total Investment 2009–2020 (k€)" height={270}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={INVEST_DATA} margin={{top:5,right:10,left:0,bottom:5}}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
                      <XAxis dataKey="year" tick={{fill:C.muted,fontSize:11}} tickLine={false}/>
                      <YAxis tickFormatter={v=>Math.round(v/1000)+"M"} tick={{fill:C.muted,fontSize:11}} tickLine={false} axisLine={false}/>
                      <Tooltip content={<LightTooltip/>}/>
                      <Legend wrapperStyle={{fontSize:10,color:C.muted}}/>
                      <Bar dataKey="buildings"  name="Buildings"  fill={C.blue}   stackId="a" isAnimationActive animationDuration={800}/>
                      <Bar dataKey="equipment"  name="Equipment"  fill={C.yellow} stackId="a" radius={[4,4,0,0]} isAnimationActive animationDuration={900}/>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
                <ChartCard title="👤 Investment per Employee (k€) 2009–2020" height={270}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={INVEST_DATA} margin={{top:5,right:10,left:0,bottom:5}}>
                      <defs><linearGradient id="gPP" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.purple} stopOpacity={0.2}/><stop offset="95%" stopColor={C.purple} stopOpacity={0}/></linearGradient></defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
                      <XAxis dataKey="year" tick={{fill:C.muted,fontSize:11}} tickLine={false}/>
                      <YAxis tick={{fill:C.muted,fontSize:11}} tickLine={false} axisLine={false} tickFormatter={v=>"€"+v.toLocaleString()}/>
                      <Tooltip content={<LightTooltip/>}/>
                      <Area type="monotone" dataKey="perPerson" name="k€/Employee" stroke={C.purple} strokeWidth={2.5} fill="url(#gPP)" isAnimationActive animationDuration={1000}/>
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>
            </>
          )}

          {/* ENERGY */}
          {tab==="energy"&&(
            <>
              <SectionTitle icon={Zap} title="Energy & Industrial Power — Magdeburg" subtitle="Manufacturing electricity balance 2013–2021 · Energy & Water Supply sector 2005–2021" color={C.teal}/>
              <div style={GRID}>
                <StatCard icon={Zap}        value="162 GWh" label="Consumed 2021"           sub="MWh 162,089" delta="-18% vs 2013" color={C.yellow}/>
                <StatCard icon={Activity}   value="150 GWh" label="Generated 2021"           sub="MWh 149,558" color={C.green}/>
                <StatCard icon={TrendingUp} value="-8%"     label="Power surplus era"        sub="2013–2015 surplus" color={C.blue}/>
                <StatCard icon={Users}      value="930"     label="Energy Sector Employees"  sub="2021 (−196 vs 2005)" color={C.orange}/>
              </div>
              <div style={GRID2}>
                <ChartCard title="⚡ Manufacturing Electricity Balance 2013–2021 (MWh)" height={280}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={ENERGY_DATA} margin={{top:5,right:10,left:0,bottom:5}}>
                      <defs>
                        <linearGradient id="gCon" x1="0" y1="0" x2="0" y2="1"><stop offset="5%"  stopColor={C.orange} stopOpacity={0.15}/><stop offset="95%" stopColor={C.orange} stopOpacity={0}/></linearGradient>
                        <linearGradient id="gGen" x1="0" y1="0" x2="0" y2="1"><stop offset="5%"  stopColor={C.green}  stopOpacity={0.15}/><stop offset="95%" stopColor={C.green}  stopOpacity={0}/></linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
                      <XAxis dataKey="year" tick={{fill:C.muted,fontSize:11}} tickLine={false}/>
                      <YAxis tickFormatter={v=>Math.round(v/1000)+"k"} tick={{fill:C.muted,fontSize:11}} tickLine={false} axisLine={false}/>
                      <Tooltip content={<LightTooltip/>}/>
                      <Legend wrapperStyle={{fontSize:10,color:C.muted}}/>
                      <Area type="monotone" dataKey="generated" name="Generated (MWh)" stroke={C.green}  strokeWidth={2.5} fill="url(#gGen)" isAnimationActive animationDuration={900}/>
                      <Area type="monotone" dataKey="consumed"  name="Consumed (MWh)"  stroke={C.orange} strokeWidth={2}   fill="url(#gCon)" isAnimationActive animationDuration={800}/>
                      <Area type="monotone" dataKey="grid"      name="Grid Use (MWh)"   stroke={C.blue}   strokeWidth={2}   fill="none" strokeDasharray="5 3" isAnimationActive animationDuration={1000}/>
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartCard>
                <ChartCard title="💧 Energy & Water Supply — Employees & Revenue 2005–2021" height={280}>
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={ENERGY_SUPPLY} margin={{top:5,right:10,left:0,bottom:5}}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
                      <XAxis dataKey="year" tick={{fill:C.muted,fontSize:10}} tickLine={false}/>
                      <YAxis yAxisId="left"  tick={{fill:C.muted,fontSize:11}} tickLine={false} axisLine={false}/>
                      <YAxis yAxisId="right" orientation="right" tick={{fill:C.muted,fontSize:11}} tickLine={false} axisLine={false} tickFormatter={v=>Math.round(v/1000)+"M"}/>
                      <Tooltip content={<LightTooltip/>}/>
                      <Legend wrapperStyle={{fontSize:10,color:C.muted}}/>
                      <Bar  yAxisId="right" dataKey="revenue"   name="Revenue (k€)" fill={C.teal}   radius={[3,3,0,0]} isAnimationActive animationDuration={800}/>
                      <Line yAxisId="left"  dataKey="employees" name="Employees"     stroke={C.orange} strokeWidth={2.5} dot={{r:2}} isAnimationActive animationDuration={1000}/>
                    </ComposedChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>
            </>
          )}

          {/* TRADE */}
          {tab==="trade"&&(
            <>
              <SectionTitle icon={ShoppingCart} title="Trade & Commerce — IHK Magdeburg 2018–2023" subtitle="Wholesale · Retail · Automotive · Construction detail" color={C.green}/>
              <div style={GRID}>
                <StatCard icon={ShoppingCart} value="2,726" label="Trade Total 2023"  delta="-6.4% vs 2018" color={C.green}/>
                <StatCard icon={TrendingUp}   value="67.9%" label="Wholesale Share"   sub="1,851 of 2,726 firms" color={C.blue}/>
                <StatCard icon={ShoppingCart} value="294"   label="Automotive 2023"   sub="Dealerships + service" delta="-8.1% vs 2018" color={C.orange}/>
                <StatCard icon={Building2}    value="504"   label="Construction 2023" sub="IHK members" delta="-19.2% vs 2018" color={C.yellow}/>
              </div>
              <div style={GRID2}>
                <ChartCard title="🛒 Trade Companies 2018–2023" height={270}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={TRADE_SECTORS} margin={{top:5,right:10,left:0,bottom:5}}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
                      <XAxis dataKey="year" tick={{fill:C.muted,fontSize:11}} tickLine={false}/>
                      <YAxis tick={{fill:C.muted,fontSize:11}} tickLine={false} axisLine={false}/>
                      <Tooltip content={<LightTooltip/>}/>
                      <Legend wrapperStyle={{fontSize:10,color:C.muted}}/>
                      <Line type="monotone" dataKey="wholesale"  name="Wholesale"  stroke={C.blue}   strokeWidth={2.5} dot={{r:4,fill:C.blue}}   isAnimationActive animationDuration={900}/>
                      <Line type="monotone" dataKey="retail"     name="Retail"     stroke={C.orange} strokeWidth={2.5} dot={{r:4,fill:C.orange}} isAnimationActive animationDuration={1000}/>
                      <Line type="monotone" dataKey="automotive" name="Automotive" stroke={C.green}  strokeWidth={2.5} dot={{r:4,fill:C.green}}  isAnimationActive animationDuration={1100}/>
                    </LineChart>
                  </ResponsiveContainer>
                </ChartCard>
                <ChartCard title="🏗️ Construction Firms 2018–2023" height={270}>
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={CONSTRUCTION_SECTORS} margin={{top:5,right:10,left:0,bottom:5}}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
                      <XAxis dataKey="year" tick={{fill:C.muted,fontSize:11}} tickLine={false}/>
                      <YAxis yAxisId="left" tick={{fill:C.muted,fontSize:11}} tickLine={false} axisLine={false}/>
                      <Tooltip content={<LightTooltip/>}/>
                      <Legend wrapperStyle={{fontSize:10,color:C.muted}}/>
                      <Bar  yAxisId="left" dataKey="other"     name="General"    fill={C.yellow} stackId="a" isAnimationActive animationDuration={800}/>
                      <Bar  yAxisId="left" dataKey="civil"     name="Civil Eng." fill={C.blue}   stackId="a" isAnimationActive animationDuration={900}/>
                      <Bar  yAxisId="left" dataKey="finishing" name="Finishing"  fill={C.orange} stackId="a" radius={[4,4,0,0]} isAnimationActive animationDuration={1000}/>
                      <Line yAxisId="left" dataKey="total"     name="Total"      stroke={C.purple} strokeWidth={2.5} dot={{r:3}} isAnimationActive animationDuration={1100}/>
                    </ComposedChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>
              <ChartCard title="📈 IHK Companies — All Sectors Trend 2018–2023" height={300}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={IHK_SECTORS} margin={{top:5,right:10,left:0,bottom:5}}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
                    <XAxis dataKey="year" tick={{fill:C.muted,fontSize:11}} tickLine={false}/>
                    <YAxis tick={{fill:C.muted,fontSize:11}} tickLine={false} axisLine={false}/>
                    <Tooltip content={<LightTooltip/>}/>
                    <Legend wrapperStyle={{fontSize:10,color:C.muted}}/>
                    <Line type="monotone" dataKey="services"      name="Services"      stroke={C.blue}   strokeWidth={2} dot={false} isAnimationActive animationDuration={800}/>
                    <Line type="monotone" dataKey="trade"         name="Trade"         stroke={C.green}  strokeWidth={2} dot={false} isAnimationActive animationDuration={850}/>
                    <Line type="monotone" dataKey="manufacturing" name="Manufacturing" stroke={C.orange} strokeWidth={2} dot={false} isAnimationActive animationDuration={900}/>
                    <Line type="monotone" dataKey="construction"  name="Construction"  stroke={C.yellow} strokeWidth={2} dot={false} isAnimationActive animationDuration={950}/>
                    <Line type="monotone" dataKey="hospitality"   name="Hospitality"   stroke={C.purple} strokeWidth={2} dot={false} isAnimationActive animationDuration={1000}/>
                    <Line type="monotone" dataKey="finance"       name="Finance"       stroke={C.teal}   strokeWidth={2} dot={false} isAnimationActive animationDuration={1050}/>
                    <Line type="monotone" dataKey="transport"     name="Transport"     stroke={C.cyan}   strokeWidth={2} dot={false} isAnimationActive animationDuration={1100}/>
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>
            </>
          )}

          {/* HANDWERK */}
          {tab==="handwerk"&&(
            <>
              <SectionTitle icon={Wrench} title="Crafts & Trades (Handwerk) — Magdeburg 2010–2023" subtitle="Source: Handwerkskammer Magdeburg · 7 craft sectors · 1,897 businesses in 2023" color={C.yellow}/>
              <div style={GRID}>
                <StatCard icon={Wrench}          value="1,897" label="Total Craft Firms 2023"  delta="-532 vs 2010" color={C.yellow}/>
                <StatCard icon={Hammer}          value="445"   label="Build/Expand Crafts"     sub="Roofers, masons, painters…" delta="-198 vs 2010" color={C.orange}/>
                <StatCard icon={Activity}        value="570"   label="Health/Hygiene Crafts"   sub="Largest craft sector" color={C.green}/>
                <StatCard icon={Factory}         value="508"   label="Electrical/Metal Crafts" sub="2nd largest" color={C.cyan}/>
                <StatCard icon={BookOpen}        value="146"   label="Wood/Plastics Crafts"    delta="-131 vs 2010" color={C.blue}/>
                <StatCard icon={UtensilsCrossed} value="23"    label="Food Crafts 2023"        sub="Bakers, butchers, brewers" color={C.pink}/>
              </div>
              <div style={GRID2}>
                <ChartCard title="🔧 Total Craft Businesses 2010–2023" height={270}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={CRAFT_TOTAL} margin={{top:5,right:10,left:0,bottom:5}}>
                      <defs><linearGradient id="gCraft" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.yellow} stopOpacity={0.2}/><stop offset="95%" stopColor={C.yellow} stopOpacity={0}/></linearGradient></defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
                      <XAxis dataKey="year" tick={{fill:C.muted,fontSize:11}} tickLine={false}/>
                      <YAxis domain={[1800,2500]} tick={{fill:C.muted,fontSize:11}} tickLine={false} axisLine={false} tickFormatter={v=>v.toLocaleString()}/>
                      <Tooltip content={<LightTooltip/>}/>
                      <Area type="monotone" dataKey="total" name="Total Craft Firms" stroke={C.yellow} strokeWidth={2.5} fill="url(#gCraft)" isAnimationActive animationDuration={1000}/>
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartCard>
                <ChartCard title="📊 Craft Sectors Stacked 2010–2023" height={270}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={CRAFT_TOTAL} margin={{top:5,right:10,left:0,bottom:5}}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
                      <XAxis dataKey="year" tick={{fill:C.muted,fontSize:11}} tickLine={false}/>
                      <YAxis tick={{fill:C.muted,fontSize:11}} tickLine={false} axisLine={false}/>
                      <Tooltip content={<LightTooltip/>}/>
                      <Legend wrapperStyle={{fontSize:10,color:C.muted}}/>
                      <Bar dataKey="health"      name="Health"       fill={C.green}  stackId="a" isAnimationActive animationDuration={700}/>
                      <Bar dataKey="electrical"  name="Electrical"   fill={C.cyan}   stackId="a" isAnimationActive animationDuration={800}/>
                      <Bar dataKey="construction" name="Construction" fill={C.yellow} stackId="a" isAnimationActive animationDuration={900}/>
                      <Bar dataKey="wood"        name="Wood"         fill={C.orange} stackId="a" isAnimationActive animationDuration={1000}/>
                      <Bar dataKey="clothing"    name="Clothing"     fill={C.teal}   stackId="a" isAnimationActive animationDuration={1100}/>
                      <Bar dataKey="glass"       name="Glass"        fill={C.purple} stackId="a" isAnimationActive animationDuration={1200}/>
                      <Bar dataKey="food"        name="Food"         fill={C.pink}   stackId="a" radius={[4,4,0,0]} isAnimationActive animationDuration={1300}/>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>
            </>
          )}

          {/* CONSUMER ADVISORY */}
          {tab==="consumer"&&(
            <>
              <SectionTitle icon={HeartHandshake} title="Consumer Advisory — Verbraucherzentrale 2013–2021" subtitle="In-person, phone, online, lectures & group consultations" color={C.pink}/>
              <div style={GRID}>
                <StatCard icon={HeartHandshake} value="9,949" label="Total 2021"      color={C.pink}/>
                <StatCard icon={Users}          value="1,909" label="In-Person 2021"  sub="vs 5,163 in 2013" delta="-63%" color={C.blue}/>
                <StatCard icon={Activity}       value="6,954" label="Phone 2021"      color={C.green}/>
                <StatCard icon={TrendingUp}     value="1,086" label="Online 2021"     sub="New channel since 2018" color={C.purple}/>
              </div>
              <ChartCard title="🫱 Advisory Sessions by Channel 2013–2021" height={320}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={CONSUMER_ADVISORY} margin={{top:5,right:10,left:0,bottom:5}}>
                    <defs>
                      <linearGradient id="gIP" x1="0" y1="0" x2="0" y2="1"><stop offset="5%"  stopColor={C.blue}   stopOpacity={0.15}/><stop offset="95%" stopColor={C.blue}   stopOpacity={0}/></linearGradient>
                      <linearGradient id="gPH" x1="0" y1="0" x2="0" y2="1"><stop offset="5%"  stopColor={C.green}  stopOpacity={0.15}/><stop offset="95%" stopColor={C.green}  stopOpacity={0}/></linearGradient>
                      <linearGradient id="gOL" x1="0" y1="0" x2="0" y2="1"><stop offset="5%"  stopColor={C.purple} stopOpacity={0.15}/><stop offset="95%" stopColor={C.purple} stopOpacity={0}/></linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
                    <XAxis dataKey="year" tick={{fill:C.muted,fontSize:11}} tickLine={false}/>
                    <YAxis tick={{fill:C.muted,fontSize:11}} tickLine={false} axisLine={false}/>
                    <Tooltip content={<LightTooltip/>}/>
                    <Legend wrapperStyle={{fontSize:10,color:C.muted}}/>
                    <Area type="monotone" dataKey="inPerson" name="In-Person" stroke={C.blue}   strokeWidth={2} fill="url(#gIP)" isAnimationActive animationDuration={900}/>
                    <Area type="monotone" dataKey="phone"    name="Phone"     stroke={C.green}  strokeWidth={2} fill="url(#gPH)" isAnimationActive animationDuration={1000}/>
                    <Area type="monotone" dataKey="online"   name="Online"    stroke={C.purple} strokeWidth={2} fill="url(#gOL)" isAnimationActive animationDuration={1100}/>
                  </AreaChart>
                </ResponsiveContainer>
              </ChartCard>
            </>
          )}

        </div>
      )}

      <style>{`
        @keyframes ping { 0%,100%{transform:scale(1);opacity:0.5} 50%{transform:scale(1.85);opacity:0} }
      `}</style>
    </div>
  );
}
