import { useMemo, useEffect, useRef } from "react";
import { startRain, stopRain, startThunderstorm, stopThunderstorm, startWind, stopWind, stopAllSounds } from "./weatherSounds";

function getEffectType(code) {
  if (code === undefined || code === null) return "clear";
  if ([95, 96, 99].includes(code)) return "thunderstorm";
  if ([61, 63, 65, 80, 81, 82].includes(code)) return "rain";
  if ([51, 53, 55, 56, 57].includes(code)) return "drizzle";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "snow";
  if ([1, 2, 3, 45, 48].includes(code)) return "cloudy";
  return "clear";
}

// Base intensity per exact WMO code (0 = barely there, 1 = torrential)
const CODE_INTENSITY = {
  51: 0.12, 53: 0.2, 55: 0.3, 56: 0.15, 57: 0.25,   // drizzle grades
  61: 0.35, 63: 0.55, 65: 0.85,                      // rain grades
  80: 0.4, 81: 0.6, 82: 0.95,                        // rain showers
  95: 0.65, 96: 0.8, 99: 0.95,                       // thunderstorm grades
};

function getIntensity(code, precipMm) {
  const base = CODE_INTENSITY[code] ?? 0.4;
  // nudge using the real measured precipitation for this hour, capped
  const precipBoost = Math.min(precipMm / 15, 0.25);
  return Math.max(0.05, Math.min(1, base + precipBoost));
}

function RainLayer({ intensity }) {
  const drops = useMemo(() => {
    const count = Math.round(20 + intensity * 100);
    return Array.from({ length: count }, () => ({
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 0.9 - intensity * 0.5 + Math.random() * 0.3,
      height: 10 + intensity * 25 + Math.random() * 10,
    }));
  }, [intensity]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {drops.map((d, i) => (
        <div key={i} className="absolute w-[2px] bg-[#9FE8DC]"
          style={{ left: `${d.left}%`, height: `${d.height}px`, top: "-5%", opacity: 0.3 + intensity * 0.3,
            animation: `rainfall ${d.duration}s linear ${d.delay}s infinite` }} />
      ))}
    </div>
  );
}

function ThunderLayer({ intensity }) {
  return (
    <>
      <RainLayer intensity={intensity} />
      <div className="absolute inset-0 bg-white pointer-events-none"
        style={{ animation: "flash 6s ease-in-out infinite" }} />
    </>
  );
}

function SnowLayer() {
  const flakes = useMemo(() => Array.from({ length: 50 }, () => ({
    left: Math.random() * 100, delay: Math.random() * 5, duration: 4 + Math.random() * 4,
    size: 2 + Math.random() * 3,
  })), []);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {flakes.map((f, i) => (
        <div key={i} className="absolute rounded-full bg-white"
          style={{ left: `${f.left}%`, width: `${f.size}px`, height: `${f.size}px`, top: "-5%", opacity: 0.7,
            animation: `snowfall ${f.duration}s linear ${f.delay}s infinite` }} />
      ))}
    </div>
  );
}

function SunnyDayLayer() {
  const bokeh = useMemo(() => Array.from({ length: 10 }, () => ({
    left: Math.random() * 100, top: Math.random() * 100, size: 60 + Math.random() * 100,
    delay: Math.random() * 10, duration: 15 + Math.random() * 15,
  })), []);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute rounded-full blur-[100px]"
        style={{ width: "400px", height: "400px", top: "8%", right: "10%",
          background: "radial-gradient(circle, #FFD98A 0%, transparent 70%)", opacity: 0.5 }} />
      {bokeh.map((b, i) => (
        <div key={i} className="absolute rounded-full bg-[#E8A33D] blur-3xl"
          style={{ left: `${b.left}%`, top: `${b.top}%`, width: `${b.size}px`, height: `${b.size}px`, opacity: 0.15,
            animation: `drift ${b.duration}s ease-in-out ${b.delay}s infinite` }} />
      ))}
    </div>
  );
}

function ClearNightLayer() {
  const stars = useMemo(() => Array.from({ length: 60 }, () => ({
    left: Math.random() * 100, top: Math.random() * 70, size: 1 + Math.random() * 1.5,
    delay: Math.random() * 4, duration: 2 + Math.random() * 3,
  })), []);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute rounded-full blur-[90px]"
        style={{ width: "300px", height: "300px", top: "6%", right: "14%",
          background: "radial-gradient(circle, #D9E4F5 0%, transparent 70%)", opacity: 0.35 }} />
      <div className="absolute rounded-full bg-[#EFF3FA]"
        style={{ width: "60px", height: "60px", top: "10%", right: "16%", opacity: 0.85, boxShadow: "0 0 40px 10px rgba(239,243,250,0.4)" }} />
      {stars.map((s, i) => (
        <div key={i} className="absolute rounded-full bg-white"
          style={{ left: `${s.left}%`, top: `${s.top}%`, width: `${s.size}px`, height: `${s.size}px`,
            animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite` }} />
      ))}
    </div>
  );
}

function CloudyLayer({ isDay }) {
  const clouds = useMemo(() => Array.from({ length: 6 }, () => ({
    top: Math.random() * 80, size: 150 + Math.random() * 200, delay: Math.random() * 20, duration: 35 + Math.random() * 25,
  })), []);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {clouds.map((c, i) => (
        <div key={i} className={`absolute rounded-full blur-3xl ${isDay ? "bg-white" : "bg-[#8892B0]"}`}
          style={{ top: `${c.top}%`, left: "-20%", width: `${c.size}px`, height: `${c.size * 0.5}px`, opacity: isDay ? 0.1 : 0.08,
            animation: `driftRight ${c.duration}s linear ${c.delay}s infinite` }} />
      ))}
    </div>
  );
}

export default function WeatherBackground({ weatherCode, isDay = 1, windSpeed = 0, precipMm = 0, soundEnabled }) {
  const effect = getEffectType(weatherCode);
  const intensity = getIntensity(weatherCode, precipMm);
  const prevEffect = useRef(null);

  useEffect(() => {
    if (!soundEnabled) {
      stopAllSounds();
      prevEffect.current = null;
      return;
    }
    if (prevEffect.current === effect) return;
    stopAllSounds();

    if (effect === "thunderstorm") startThunderstorm(intensity);
    else if (effect === "rain" || effect === "drizzle") startRain(intensity);
    else if (effect === "clear" && windSpeed > 20) startWind(Math.min(windSpeed / 50, 1));
    else if (effect === "cloudy" && windSpeed > 25) startWind(Math.min(windSpeed / 50, 1));

    prevEffect.current = effect;
  }, [effect, soundEnabled, intensity, windSpeed]);

  useEffect(() => stopAllSounds, []);

  return (
    <div className="absolute inset-0">
      <style>{`
        @keyframes rainfall { 0% { transform: translateY(0); opacity: 0; } 10% { opacity: 1; } 100% { transform: translateY(110vh); opacity: 0.2; } }
        @keyframes snowfall { 0% { transform: translateY(0) translateX(0); opacity: 0; } 10% { opacity: 0.7; } 100% { transform: translateY(110vh) translateX(20px); opacity: 0.3; } }
        @keyframes flash { 0%, 92%, 100% { opacity: 0; } 93% { opacity: 0.2; } 94% { opacity: 0; } 95% { opacity: 0.12; } 96% { opacity: 0; } }
        @keyframes drift { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(30px, -20px); } }
        @keyframes driftRight { 0% { transform: translateX(0); } 100% { transform: translateX(140vw); } }
        @keyframes twinkle { 0%, 100% { opacity: 0.2; } 50% { opacity: 1; } }
      `}</style>
      {(effect === "rain" || effect === "drizzle") && <RainLayer intensity={intensity} />}
      {effect === "thunderstorm" && <ThunderLayer intensity={intensity} />}
      {effect === "snow" && <SnowLayer />}
      {effect === "cloudy" && <CloudyLayer isDay={isDay === 1} />}
      {effect === "clear" && isDay === 1 && <SunnyDayLayer />}
      {effect === "clear" && isDay === 0 && <ClearNightLayer />}
    </div>
  );
}
