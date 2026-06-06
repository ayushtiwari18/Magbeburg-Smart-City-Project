"use client";
import { useEffect, useState } from "react";

export default function WelcomeToast() {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [progress, setProgress] = useState(100);

  const DURATION = 5000; // ms before auto-dismiss

  useEffect(() => {
    // Only show once per session
    if (sessionStorage.getItem("mgb-welcome-shown")) return;
    sessionStorage.setItem("mgb-welcome-shown", "1");

    const showTimer = setTimeout(() => setVisible(true), 600);
    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const elapsed = now - start;
      const pct = Math.max(0, 100 - (elapsed / DURATION) * 100);
      setProgress(pct);
      if (elapsed < DURATION) {
        raf = requestAnimationFrame(tick);
      } else {
        dismiss();
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible]);

  const dismiss = () => {
    setLeaving(true);
    setTimeout(() => setVisible(false), 500);
  };

  if (!visible) return null;

  return (
    <>
      <style>{`
        @keyframes toastIn  { from { opacity:0; transform:translateY(32px) scale(.94); } to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes toastOut { from { opacity:1; transform:translateY(0) scale(1); } to { opacity:0; transform:translateY(32px) scale(.94); } }
        @keyframes flagWave { 0%,100%{transform:rotate(-4deg)} 50%{transform:rotate(4deg)} }
        @keyframes cityRise { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer  { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes dotPulse { 0%,100%{transform:scale(1);opacity:.6} 50%{transform:scale(1.5);opacity:1} }
        .toast-enter { animation: toastIn  .5s cubic-bezier(.22,1,.36,1) both; }
        .toast-leave  { animation: toastOut .45s cubic-bezier(.55,0,1,.45) both; }
      `}</style>

      {/* backdrop blur spot */}
      <div
        className={leaving ? "toast-leave" : "toast-enter"}
        style={{
          position: "fixed",
          bottom: 28,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 9999,
          width: "min(92vw, 420px)",
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: "0 24px 60px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.10)",
          background: "linear-gradient(135deg,#0a1628 0%,#0f2952 60%,#1a3a6b 100%)",
          cursor: "default",
        }}
      >
        {/* SVG city skyline strip */}
        <svg viewBox="0 0 420 56" style={{ width:"100%",height:56,display:"block" }} preserveAspectRatio="xMidYMax meet">
          <defs>
            <linearGradient id="wbg1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1e3a5f"/><stop offset="100%" stopColor="#0f2952"/></linearGradient>
            <linearGradient id="wbg2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#16304e"/><stop offset="100%" stopColor="#0a1e3a"/></linearGradient>
          </defs>
          {/* back layer */}
          {[[0,28,22,28],[26,18,18,38],[48,22,24,34],[76,12,20,44],[100,20,22,36],[126,14,28,42],
            [158,22,20,34],[182,16,22,40],[208,24,18,32],[230,18,22,38],[256,12,20,44],
            [280,20,24,36],[308,16,20,40],[332,22,22,34],[358,18,26,38],[388,24,18,32],[408,20,14,36]
          ].map(([x,y,w,h],i)=>(
            <rect key={i} x={x} y={y} width={w} height={h} rx="1" fill="url(#wbg2)" opacity="0.55"
              style={{ animation:`cityRise .6s ease both`,animationDelay:`${i*0.03}s` }}/>
          ))}
          {/* front bank building */}
          <rect x="186" y="8" width="48" height="48" rx="1" fill="url(#wbg1)"
            style={{ animation:"cityRise .5s ease both",animationDelay:".2s" }}/>
          <polygon points="183,10 210,1 237,10" fill="#1e3a5f"/>
          <text x="210" y="30" textAnchor="middle"
            style={{ fill:"rgba(253,224,71,0.8)",fontSize:11,fontWeight:900,
              filter:"drop-shadow(0 0 5px rgba(253,224,71,0.7))" }}>€</text>
          {/* windows */}
          {[[192,14],[202,14],[212,14],[222,14],[192,22],[202,22],[212,22],[222,22]].map(([wx,wy],i)=>(
            <rect key={i} x={wx} y={wy} width="4" height="3" rx="1"
              fill={i%2===0?"rgba(253,224,71,0.85)":"rgba(147,197,253,0.6)"}
              style={{ animation:`dotPulse ${1.8+i*0.15}s ease-in-out infinite`,animationDelay:`${i*0.1}s` }}/>
          ))}
          {/* ground line */}
          <rect x="0" y="54" width="420" height="2" fill="rgba(255,255,255,0.06)"/>
        </svg>

        {/* content */}
        <div style={{ padding:"14px 18px 16px" }}>
          <div style={{ display:"flex",alignItems:"flex-start",gap:14 }}>
            {/* animated flag */}
            <div style={{ flexShrink:0,marginTop:2 }}>
              <span style={{ fontSize:28,display:"block",transformOrigin:"bottom left",animation:"flagWave 1.8s ease-in-out infinite" }}>🏙️</span>
            </div>

            <div style={{ flex:1,minWidth:0 }}>
              {/* shimmer headline */}
              <div style={{
                fontSize:15,fontWeight:800,letterSpacing:".01em",
                background:"linear-gradient(90deg,#fff 20%,#fde047 45%,#60a5fa 65%,#fff 80%)",
                backgroundSize:"200% auto",
                WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
                animation:"shimmer 2.8s linear infinite",
                marginBottom:4,
              }}>
                Welcome to Magdeburg! 👋
              </div>

              <p style={{ fontSize:12,color:"rgba(255,255,255,0.55)",lineHeight:1.5,margin:0 }}>
                Explore live city data — transport, climate, economy & more, all in one smart dashboard.
              </p>

              {/* tag pills */}
              <div style={{ display:"flex",flexWrap:"wrap",gap:6,marginTop:10 }}>
                {["🚌 Transport","🌿 Climate","📊 Insights","🏘️ Housing"].map((tag,i)=>(
                  <span key={i} style={{
                    fontSize:10,fontWeight:600,padding:"3px 9px",borderRadius:20,
                    background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.13)",
                    color:"rgba(255,255,255,0.65)",
                    animation:`cityRise .4s ease both`,animationDelay:`${.3+i*.07}s`,
                  }}>{tag}</span>
                ))}
              </div>
            </div>

            {/* close button */}
            <button
              onClick={dismiss}
              aria-label="Close"
              style={{
                flexShrink:0,width:24,height:24,borderRadius:"50%",
                background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",
                color:"rgba(255,255,255,0.5)",fontSize:13,lineHeight:1,
                cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",
                transition:"background .15s, color .15s",
              }}
              onMouseEnter={e=>{ (e.currentTarget as HTMLElement).style.background="rgba(255,255,255,0.18)"; (e.currentTarget as HTMLElement).style.color="#fff"; }}
              onMouseLeave={e=>{ (e.currentTarget as HTMLElement).style.background="rgba(255,255,255,0.08)"; (e.currentTarget as HTMLElement).style.color="rgba(255,255,255,0.5)"; }}
            >✕</button>
          </div>

          {/* live dot + status */}
          <div style={{ display:"flex",alignItems:"center",gap:6,marginTop:12 }}>
            <span style={{ width:6,height:6,borderRadius:"50%",background:"#4ade80",display:"inline-block",animation:"dotPulse 1.4s ease-in-out infinite" }}/>
            <span style={{ fontSize:10,color:"rgba(255,255,255,0.35)",fontWeight:500 }}>Smart City Dashboard · Live Data</span>
          </div>
        </div>

        {/* progress bar */}
        <div style={{ height:3,background:"rgba(255,255,255,0.07)" }}>
          <div style={{
            height:"100%",
            width:`${progress}%`,
            background:"linear-gradient(90deg,#60a5fa,#fde047)",
            transition:"width .1s linear",
            boxShadow:"0 0 6px rgba(96,165,250,0.6)",
          }}/>
        </div>
      </div>
    </>
  );
}
