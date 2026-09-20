const LEVEL_STYLES = {
  high: { text: "text-[#FF8A6B]", bg: "bg-[#FF8A6B]/10", border: "border-[#FF8A6B]/20" },
  moderate: { text: "text-[#E8A33D]", bg: "bg-[#E8A33D]/10", border: "border-[#E8A33D]/20" },
  low: { text: "text-[#7DD8CC]", bg: "bg-[#7DD8CC]/10", border: "border-[#7DD8CC]/20" },
  none: { text: "text-white/40", bg: "bg-white/5", border: "border-white/10" },
};

export default function AlertsCard({ alerts }) {
  const list = alerts && alerts.length > 0 ? alerts : [
    { level: "none", title: "No data yet", message: "Ask a weather question to see safety alerts here." }
  ];

  return (
    <div className="glass rounded-3xl p-6">
      <p className="text-white/50 text-xs uppercase tracking-wide mb-4">Weather Alerts & Safety</p>
      <div className="space-y-2.5">
        {list.map((alert, i) => {
          const style = LEVEL_STYLES[alert.level] || LEVEL_STYLES.none;
          return (
            <div key={i} className={`flex items-start gap-3 border ${style.border} ${style.bg} rounded-2xl p-3.5`}>
              <span className={`${style.text} text-lg leading-none`}>●</span>
              <div>
                <p className="text-sm text-white">{alert.title}</p>
                <p className="text-xs text-white/50 mt-0.5">{alert.message}</p>
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-[10px] text-white/30 mt-4 italic">
        Alerts are derived from live weather data thresholds, not official government warnings.
      </p>
    </div>
  );
}
