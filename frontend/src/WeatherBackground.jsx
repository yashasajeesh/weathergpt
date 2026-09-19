import { useMemo } from "react";

function getEffectType(code) {
  if (code === undefined || code === null) return "clear";
  if ([95, 96, 99].includes(code)) return "thunderstorm";
  if ([61, 63, 65, 80, 81, 82].includes(code)) return "rain";
  if ([51, 53, 55, 56, 57].includes(code)) return "drizzle";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "snow";
  if ([1, 2, 3, 45, 48].includes(code)) return "cloudy";
  return "clear";
}

function RainLayer({ intense }) {
  const drops = useMemo(() => {
    const count = intense ? 100 : 60;
    return Array.from({ length: count }, () => ({
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 0.4 + Math.random() * 0.4,
      height: 20 + Math.random() * 20,
    }));
  }, [intense]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {drops.map((d, i) => (
        <div
          key={i}
          className="absolute w-[2px] bg-[#5FD6C4]"
          style={{
            left: `${d.left}%`,
            height: `${d.height}px`,
            top: "-5%",
            opacity: 0.6,
            animation: `rainfall ${d.duration}s linear ${d.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

function DrizzleLayer() {
  const drops = useMemo(() => {
    return Array.from({ length: 60 }, () => ({
      left: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 1 + Math.random() * 0.6,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {drops.map((d, i) => (
        <div
          key={i}
          className="absolute w-[1.5px] h-[12px] bg-[#5FD6C4]"
          style={{
            left: `${d.left}%`,
            top: "-5%",
            opacity: 0.45,
            animation: `rainfall ${d.duration}s linear ${d.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

function ThunderLayer() {
  return (
    <>
      <RainLayer intense />
      <div
        className="absolute inset-0 bg-white pointer-events-none"
        style={{ animation: "flash 6s ease-in-out infinite" }}
      />
    </>
  );
}

function SunnyLayer() {
  const bokeh = useMemo(() => {
    return Array.from({ length: 12 }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 60 + Math.random() * 100,
      delay: Math.random() * 10,
      duration: 15 + Math.random() * 15,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {bokeh.map((b, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-[#E8A33D] blur-3xl"
          style={{
            left: `${b.left}%`,
            top: `${b.top}%`,
            width: `${b.size}px`,
            height: `${b.size}px`,
            opacity: 0.18,
            animation: `drift ${b.duration}s ease-in-out ${b.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

function CloudyLayer() {
  const clouds = useMemo(() => {
    return Array.from({ length: 6 }, () => ({
      top: Math.random() * 80,
      size: 150 + Math.random() * 200,
      delay: Math.random() * 20,
      duration: 35 + Math.random() * 25,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {clouds.map((c, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-[#86A19C] blur-3xl"
          style={{
            top: `${c.top}%`,
            left: "-20%",
            width: `${c.size}px`,
            height: `${c.size * 0.5}px`,
            opacity: 0.12,
            animation: `driftRight ${c.duration}s linear ${c.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

export default function WeatherBackground({ weatherCode }) {
  const effect = getEffectType(weatherCode);

  return (
    <div className="fixed inset-0 z-0" style={{ pointerEvents: "none" }}>
      <style>{`
        @keyframes rainfall {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateY(110vh); opacity: 0.2; }
        }
        @keyframes flash {
          0%, 92%, 100% { opacity: 0; }
          93% { opacity: 0.2; }
          94% { opacity: 0; }
          95% { opacity: 0.12; }
          96% { opacity: 0; }
        }
        @keyframes drift {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(30px, -20px); }
        }
        @keyframes driftRight {
          0% { transform: translateX(0); }
          100% { transform: translateX(140vw); }
        }
      `}</style>
      {effect === "rain" && <RainLayer />}
      {effect === "drizzle" && <DrizzleLayer />}
      {effect === "thunderstorm" && <ThunderLayer />}
      {effect === "clear" && <SunnyLayer />}
      {effect === "cloudy" && <CloudyLayer />}
    </div>
  );
}
