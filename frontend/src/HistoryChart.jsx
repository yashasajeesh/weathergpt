import { useState } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { API_BASE_URL } from "./config";

export default function HistoryChart({ cityName }) {
  const [historyData, setHistoryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  const loadHistory = async () => {
    if (!cityName) return;
    setLoading(true);
    setVisible(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/history`, {
        params: { city: cityName, days: 30 },
      });
      setHistoryData(response.data.history);
    } catch (err) {
      setHistoryData(null);
    } finally {
      setLoading(false);
    }
  };

  const chartData = historyData
    ? historyData.daily.time.map((date, i) => ({
        date: date.slice(5),
        max: historyData.daily.temperature_2m_max[i],
        min: historyData.daily.temperature_2m_min[i],
        rain: historyData.daily.precipitation_sum[i],
      }))
    : [];

  return (
    <div className="bg-[#171717] border border-[#2A2A2A] rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[#86A19C] text-xs uppercase tracking-wide">Last 30 Days</p>
        {!visible && (
          <button
            onClick={loadHistory}
            className="text-xs px-3 py-1.5 rounded-full bg-[#3FC1B0] text-[#0A0A0A] hover:bg-[#56d4c2] transition-colors"
          >
            Load History
          </button>
        )}
      </div>

      {loading && <p className="text-[#86A19C] text-sm">Loading historical data...</p>}

      {historyData && (
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={chartData}>
            <CartesianGrid stroke="#2A2A2A" strokeDasharray="3 3" />
            <XAxis dataKey="date" stroke="#86A19C" fontSize={9} interval={2} />
            <YAxis stroke="#86A19C" fontSize={10} />
            <Tooltip
              contentStyle={{ background: "#0A0A0A", border: "1px solid #2A2A2A", borderRadius: "6px", fontSize: "12px" }}
              labelStyle={{ color: "#F2EDE4" }}
            />
            <Legend wrapperStyle={{ fontSize: "11px" }} />
            <Line type="monotone" dataKey="max" stroke="#E8A33D" strokeWidth={2} dot={false} name="Max °C" />
            <Line type="monotone" dataKey="min" stroke="#3FC1B0" strokeWidth={2} dot={false} name="Min °C" />
            <Line type="monotone" dataKey="rain" stroke="#5FD6C4" strokeWidth={1.5} dot={false} name="Rain (mm)" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
