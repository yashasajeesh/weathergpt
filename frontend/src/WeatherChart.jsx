import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function WeatherChart({ hourlyData }) {
  if (!hourlyData) return null;

  const chartData = hourlyData.time.slice(0, 24).map((time, i) => ({
    time: time.slice(11, 16),
    temperature: hourlyData.temperature_2m[i],
    rainChance: hourlyData.precipitation_probability[i],
  }));

  return (
    <div className="glass rounded-3xl p-6">
      <p className="text-white/50 text-xs uppercase tracking-wide mb-4">Next 24 Hours</p>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData}>
          <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
          <XAxis dataKey="time" stroke="rgba(255,255,255,0.4)" fontSize={10} />
          <YAxis stroke="rgba(255,255,255,0.4)" fontSize={10} />
          <Tooltip
            contentStyle={{ background: "rgba(10,10,10,0.9)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "12px", fontSize: "12px" }}
            labelStyle={{ color: "#fff" }}
          />
          <Line type="monotone" dataKey="temperature" stroke="#E8A33D" strokeWidth={2} dot={false} name="Temp (°C)" />
          <Line type="monotone" dataKey="rainChance" stroke="#7DD8CC" strokeWidth={2} dot={false} name="Rain %" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
