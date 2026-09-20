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
import AmbientBackground from "./AmbientBackground";
import SoundToggle from "./SoundToggle";
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
  const [soundEnabled, setSoundEnabled] = useState(false);

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
  const currentIsDay = weatherInfo?.raw_weather?.current?.is_day ?? 1;
  const currentWind = weatherInfo?.raw_weather?.current?.wind_speed_10m ?? 0;
  const currentPrecip = weatherInfo?.raw_weather?.current?.precipitation ?? 0;
  const currentCode = weatherInfo?.raw_weather?.current?.weather_code;

  const bgClass =
    currentCode !== undefined && [95, 96, 99, 61, 63, 65, 80, 81, 82].includes(currentCode)
      ? "bg-[#03080C]"
      : currentIsDay === 0
      ? "bg-[#050812]"
      : "bg-[#05070A]";

  return (
    <div className={`min-h-screen relative overflow-x-hidden transition-colors duration-1000 ${bgClass}`}>
      <AmbientBackground />
      <div className="fixed inset-0 z-[1]">
        <WeatherBackground
          weatherCode={currentCode}
          isDay={currentIsDay}
          windSpeed={currentWind}
          precipMm={currentPrecip}
          soundEnabled={soundEnabled}
        />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <div className="sticky top-0 z-20 px-4 sm:px-6 pt-4 flex items-center gap-3">
          <div className="flex-1">
            <TopBar role={role} setRole={setRole} language={language} setLanguage={setLanguage} />
          </div>
          {hasSearched && <SoundToggle enabled={soundEnabled} setEnabled={setSoundEnabled} />}
        </div>

        {!hasSearched ? (
          <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6">
            <p className="font-logo text-2xl sm:text-3xl text-white font-light mb-2 text-center">
              Ask about the weather
            </p>
            <p className="text-white/40 text-sm mb-6 text-center">
              "Will it rain in Bengaluru tomorrow?"
            </p>
            <div className="w-full max-w-xl">
              <AskBar onAsk={handleAsk} loading={loading} />
            </div>
            {error && <p className="text-[#E8A33D] text-sm mt-4">{error}</p>}
          </div>
        ) : (
          <>
            <AskBar onAsk={handleAsk} loading={loading} />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-12 w-full">
              {error && <p className="text-[#E8A33D] text-sm mb-4">{error}</p>}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2 space-y-5">
                  <WeatherCard weatherInfo={weatherInfo} reply={reply} unit={unit} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <WeatherChart hourlyData={weatherInfo.raw_weather.hourly} />
                    <WeatherMap location={weatherInfo.location} />
                  </div>
                  <HistoryChart cityName={weatherInfo.location.name} />
                </div>

                <div className="space-y-5">
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
