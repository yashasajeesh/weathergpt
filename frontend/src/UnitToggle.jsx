export default function UnitToggle({ unit, setUnit }) {
  return (
    <div className="glass rounded-3xl p-6">
      <p className="text-white/50 text-xs uppercase tracking-wide mb-3">Units</p>
      <div className="glass-pill rounded-full p-1 w-fit flex">
        <button
          onClick={() => setUnit("metric")}
          className={`px-4 py-1.5 rounded-full text-xs transition-all ${
            unit === "metric" ? "bg-white text-black font-medium" : "text-white/50"
          }`}
        >
          °C · km/h
        </button>
        <button
          onClick={() => setUnit("imperial")}
          className={`px-4 py-1.5 rounded-full text-xs transition-all ${
            unit === "imperial" ? "bg-white text-black font-medium" : "text-white/50"
          }`}
        >
          °F · mph
        </button>
      </div>
    </div>
  );
}
