const LEVEL_STYLES = {
  high: { border: "border-[#E85D3D]", text: "text-[#E85D3D]", bg: "bg-[#E85D3D]/10" },
  moderate: { border: "border-[#E8A33D]", text: "text-[#E8A33D]", bg: "bg-[#E8A33D]/10" },
  low: { border: "border-[#3FC1B0]", text: "text-[#3FC1B0]", bg: "bg-[#3FC1B0]/10" },
  none: { border: "border-[#2A2A2A]", text: "text-[#86A19C]", bg: "bg-transparent" },
};

export default function AlertsCard({ alerts }) {
  const list = alerts && alerts.length > 0 ? alerts : [
    { level: "none", title: "No data yet", message: "Ask a weather question to see safety alerts here." }
  ];

  return (
    <div className="bg-[#171717] border border-[#2A2A2A] rounded-lg p-6">
      <p className="text-[#86A19C] text-xs uppercase tracking-wide mb-4">Weather Alerts & Safety</p>
      <div className="space-y-3">
        {list.map((alert, i) => {
          const style = LEVEL_STYLES[alert.level] || LEVEL_STYLES.none;
          return (
            <div key={i} className={`flex items-start gap-3 border ${style.border} ${style.bg} rounded-md p-3`}>
              <span className={`${style.text} text-lg leading-none`}>!</span>
              <div>
                <p className="text-sm text-[#F2EDE4]">{alert.title}</p>
                <p className="text-xs text-[#86A19C] mt-0.5">{alert.message}</p>
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-[10px] text-[#86A19C] mt-4 italic">
        Alerts are derived from live weather data thresholds, not official government warnings.
      </p>
    </div>
  );
}
