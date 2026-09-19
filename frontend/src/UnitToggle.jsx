export default function UnitToggle({ unit, setUnit }) {
  return (
    <div className="bg-[#171717] border border-[#2A2A2A] rounded-lg p-6">
      <p className="text-[#86A19C] text-xs uppercase tracking-wide mb-3">Units</p>
      <div className="flex bg-[#0A0A0A] border border-[#2A2A2A] rounded-full p-1 w-fit">
        <button
          onClick={() => setUnit("metric")}
          className={`px-4 py-1.5 rounded-full text-xs transition-colors ${
            unit === "metric" ? "bg-[#3FC1B0] text-[#0A0A0A] font-medium" : "text-[#86A19C]"
          }`}
        >
          °C · km/h
        </button>
        <button
          onClick={() => setUnit("imperial")}
          className={`px-4 py-1.5 rounded-full text-xs transition-colors ${
            unit === "imperial" ? "bg-[#3FC1B0] text-[#0A0A0A] font-medium" : "text-[#86A19C]"
          }`}
        >
          °F · mph
        </button>
      </div>
    </div>
  );
}
