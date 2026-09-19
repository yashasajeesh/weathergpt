import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function WeatherChart({ hourlyData }) {
  if (!hourlyData) return null;

  const chartData = hourlyData.time.slice(0, 24).map((time, i) => ({
    time: time.slice(11, 16),
    temperature: hourlyData.temperature_2m[i],
    rainChance: hourlyData.precipitation_probability[i],
  }));

  return (
    <div>
      <p className="text-[#86A19C] text-xs uppercase tracking-wide mb-3">Next 24 Hours</p>
      <div className="bg-[#171717] border border-[#2A2A2A] rounded-lg p-4">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid stroke="#2A2A2A" strokeDasharray="3 3" />
            <XAxis dataKey="time" stroke="#86A19C" fontSize={10} />
            <YAxis stroke="#86A19C" fontSize={10} />
            <Tooltip
              contentStyle={{ background: "#0A0A0A", border: "1px solid #2A2A2A", borderRadius: "6px", fontSize: "12px" }}
              labelStyle={{ color: "#EDF3F2" }}
            />
            <Line type="monotone" dataKey="temperature" stroke="#E8A33D" strokeWidth={2} dot={false} name="Temp (°C)" />
            <Line type="monotone" dataKey="rainChance" stroke="#3FC1B0" strokeWidth={2} dot={false} name="Rain %" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
