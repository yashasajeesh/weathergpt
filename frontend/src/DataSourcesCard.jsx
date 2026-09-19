const ROLE_SOURCES = {
  General: ["Open-Meteo forecast API (temperature, humidity, wind, rain probability)"],
  Agriculture: [
    "Open-Meteo forecast API (core conditions)",
    "Open-Meteo agriculture data (soil moisture, evapotranspiration)",
  ],
  Marine: [
    "Open-Meteo forecast API (core conditions)",
    "Open-Meteo Marine API (wave height, period, direction)",
  ],
  Aviation: [
    "Open-Meteo forecast API (core conditions)",
    "Open-Meteo aviation data (wind at altitude, visibility, cloud cover)",
  ],
  "Smart City": ["Open-Meteo forecast API (rainfall accumulation, core conditions)"],
};

export default function DataSourcesCard({ role, language }) {
  const sources = ROLE_SOURCES[role] || ROLE_SOURCES.General;

  return (
    <div className="bg-[#171717] border border-[#2A2A2A] rounded-lg p-6">
      <p className="text-[#86A19C] text-xs uppercase tracking-wide mb-3">Data Sources</p>

      <div className="space-y-2 mb-4">
        {sources.map((src, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3FC1B0] mt-1.5 flex-shrink-0" />
            <p className="text-xs text-[#F2EDE4] leading-relaxed">{src}</p>
          </div>
        ))}
      </div>

      <div className="pt-3 border-t border-[#2A2A2A] space-y-2">
        <div className="flex items-start gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E8A33D] mt-1.5 flex-shrink-0" />
          <p className="text-xs text-[#F2EDE4] leading-relaxed">
            Safety alerts: computed from live data thresholds (not official warnings)
          </p>
        </div>
        <div className="flex items-start gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#86A19C] mt-1.5 flex-shrink-0" />
          <p className="text-xs text-[#86A19C] leading-relaxed">
            AI ({language}) explains this data only — it does not generate its own forecasts.
          </p>
        </div>
      </div>
    </div>
  );
}
