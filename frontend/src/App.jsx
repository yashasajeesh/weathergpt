import { useState } from "react";
import axios from "axios";
import TopBar from "./TopBar";
import AskBar from "./AskBar";
import WeatherCard from "./WeatherCard";
import AlertsCard from "./AlertsCard";
import WeatherChart from "./WeatherChart";
import WeatherMap from "./WeatherMap";
import HistoryChart from "./HistoryChart";
import UnitToggle from "./UnitToggle";
import WeatherBackground from "./WeatherBackground";
import { API_BASE_URL } from "./config";

function App() {
  const [role, setRole] = useState("General");
  const [language, setLanguage] = useState("English");
  const [weatherInfo, setWeatherInfo] = useState(null);
  const [reply, setReply] = useState("");
  const [alerts, setAlerts] = useState([]);
  const [unit, setUnit] = useState("metric");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAsk = async (query) => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(`${API_BASE_URL}/chat`, {
        message: query,
        role: role,
        language: language,
      });

      if (response.data.error) {
        setError(response.data.error);
        return;
      }

      const { reply, location, raw_weather, alerts } = response.data;
      setReply(reply);
      setWeatherInfo({ location, raw_weather });
      setAlerts(alerts || []);
    } catch (err) {
      if (err.response) {
        setError("The server had trouble processing that. Please try again.");
      } else if (err.request) {
        setError("Can't reach the backend. Make sure the server is running.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const hasSearched = weatherInfo !== null;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F2EDE4] relative overflow-hidden">
      <WeatherBackground weatherCode={weatherInfo?.raw_weather?.current?.weather_code} />

      <div className="relative z-10 flex flex-col min-h-screen">
        <TopBar role={role} setRole={setRole} language={language} setLanguage={setLanguage} />

        {!hasSearched ? (
          // Empty state — centered ask bar only
          <div className="flex-1 flex flex-col items-center justify-center px-6">
            <p className="font-logo text-3xl text-[#F2EDE4] mb-2">Ask about the weather</p>
            <p className="text-[#86A19C] text-sm mb-6">"Will it rain in Bengaluru tomorrow?"</p>
            <div className="w-full max-w-xl">
              <AskBar onAsk={handleAsk} loading={loading} />
            </div>
            {error && <p className="text-[#E8A33D] text-sm mt-4">{error}</p>}
          </div>
        ) : (
          // Full dashboard after first search
          <>
            <AskBar onAsk={handleAsk} loading={loading} />
            <div className="max-w-6xl mx-auto px-6 pb-12 w-full">
              {error && <p className="text-[#E8A33D] text-sm mb-4">{error}</p>}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <WeatherCard weatherInfo={weatherInfo} reply={reply} unit={unit} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <WeatherChart hourlyData={weatherInfo.raw_weather.hourly} />
                    <WeatherMap location={weatherInfo.location} />
                  </div>
                  <HistoryChart cityName={weatherInfo.location.name} />
                </div>

                <div className="space-y-6">
                  <AlertsCard alerts={alerts} />
                  <UnitToggle unit={unit} setUnit={setUnit} />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
