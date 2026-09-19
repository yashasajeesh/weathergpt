import { convertTemp, convertSpeed, tempLabel, speedLabel } from "./unitUtils";

export default function WeatherCard({ weatherInfo, reply, unit = "metric" }) {
  if (!weatherInfo) {
    return (
      <div className="bg-[#171717] border border-[#2A2A2A] rounded-lg p-6 flex items-center justify-center min-h-[180px]">
        <p className="text-[#86A19C] text-sm">Ask a question above to see live conditions.</p>
      </div>
    );
  }

  const { location, raw_weather } = weatherInfo;
  const temp = convertTemp(raw_weather.current.temperature_2m, unit);
  const wind = convertSpeed(raw_weather.current.wind_speed_10m, unit);

  return (
    <div className="bg-[#171717] border border-[#2A2A2A] rounded-lg p-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="text-[#86A19C] text-xs uppercase tracking-wide mb-1">{location.name}, {location.country}</p>
          <p className="font-logo text-6xl text-[#E8A33D] leading-none">
            {temp}{tempLabel(unit)}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 font-mono-data text-sm">
          <div>
            <p className="text-[#86A19C] text-xs">Humidity</p>
            <p className="text-[#3FC1B0]">{raw_weather.current.relative_humidity_2m}%</p>
          </div>
          <div>
            <p className="text-[#86A19C] text-xs">Wind</p>
            <p className="text-[#3FC1B0]">{wind} {speedLabel(unit)}</p>
          </div>
          <div>
            <p className="text-[#86A19C] text-xs">Rain (next hr)</p>
            <p className="text-[#3FC1B0]">{raw_weather.hourly.precipitation_probability[0]}%</p>
          </div>
          <div>
            <p className="text-[#86A19C] text-xs">Precipitation</p>
            <p className="text-[#3FC1B0]">{raw_weather.current.precipitation} mm</p>
          </div>
        </div>
      </div>

      {reply && (
        <div className="mt-5 pt-5 border-t border-[#2A2A2A]">
          <p className="text-[#86A19C] text-xs uppercase tracking-wide mb-2">AI Weather Analysis</p>
          <p className="text-[#F2EDE4] text-sm leading-relaxed">{reply}</p>
        </div>
      )}
    </div>
  );
}
