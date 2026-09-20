import { useState } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { API_BASE_URL } from "./config";

export default function HistoryChart({ cityName }) {
  const [historyData, setHistoryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState("");

  const loadHistory = async () => {
    if (!cityName) return;
    setLoading(true);
    setVisible(true);
    setError("");
    try {
      const response = await axios.get(`${API_BASE_URL}/history`, {
        params: { city: cityName, days: 30 },
      });
      if (response.data.error) {
        setError(response.data.error);
        setHistoryData(null);
      } else {
        setHistoryData(response.data.history);
      }
    } catch (err) {
      setError("Couldn't load historical data. Please try again.");
      setHistoryData(null);
    } finally {
      setLoading(false);
    }
  };

  const chartData =
    historyData && historyData.daily
      ? historyData.daily.time.map((date, i) => ({
          date: date.slice(5),
          max: historyData.daily.temperature_2m_max[i],
          min: historyData.daily.temperature_2m_min[i],
          rain: historyData.daily.precipitation_sum[i],
        }))
      : [];

  return (
    <div className="glass rounded-3xl p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-white/50 text-xs uppercase tracking-wide">Last 30 Days</p>
        {!visible && (
          <button
            onClick={loadHistory}
            className="text-xs px-3.5 py-1.5 rounded-full bg-white text-black hover:bg-white/90 transition-colors"
          >
            Load History
          </button>
        )}
      </div>

      {loading && <p className="text-white/50 text-sm">Loading historical data...</p>}
      {error && <p className="text-[#E8A33D] text-sm">{error}</p>}

      {chartData.length > 0 && (
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={chartData}>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
            <XAxis dataKey="date" stroke="rgba(255,255,255,0.4)" fontSize={9} interval={2} />
            <YAxis stroke="rgba(255,255,255,0.4)" fontSize={10} />
            <Tooltip
              contentStyle={{ background: "rgba(10,10,10,0.9)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "12px", fontSize: "12px" }}
              labelStyle={{ color: "#fff" }}
            />
            <Legend wrapperStyle={{ fontSize: "11px", color: "#fff" }} />
            <Line type="monotone" dataKey="max" stroke="#E8A33D" strokeWidth={2} dot={false} name="Max °C" />
            <Line type="monotone" dataKey="min" stroke="#7DD8CC" strokeWidth={2} dot={false} name="Min °C" />
            <Line type="monotone" dataKey="rain" stroke="#B8A6F0" strokeWidth={1.5} dot={false} name="Rain (mm)" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
