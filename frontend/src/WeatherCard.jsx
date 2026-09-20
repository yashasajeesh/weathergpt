import { convertTemp, convertSpeed, tempLabel, speedLabel } from "./unitUtils";

export default function WeatherCard({ weatherInfo, reply, unit = "metric" }) {
  if (!weatherInfo) {
    return (
      <div className="glass rounded-3xl p-8 flex items-center justify-center min-h-[180px]">
        <p className="text-white/50 text-sm">Ask a question above to see live conditions.</p>
      </div>
    );
  }

  const { location, raw_weather } = weatherInfo;
  const temp = convertTemp(raw_weather.current.temperature_2m, unit);
  const wind = convertSpeed(raw_weather.current.wind_speed_10m, unit);

  return (
    <div className="glass rounded-3xl p-6 sm:p-8">
      <div className="flex items-start justify-between flex-wrap gap-6">
        <div>
          <p className="text-white/50 text-xs uppercase tracking-wide mb-1">{location.name}, {location.country}</p>
          <p className="font-logo text-7xl font-light text-white leading-none">
            {temp}<span className="text-4xl align-top">{tempLabel(unit)}</span>
          </p>
        </div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-3 font-mono-data text-sm">
          <div>
            <p className="text-white/40 text-xs">Humidity</p>
            <p className="text-[#7DD8CC] text-base">{raw_weather.current.relative_humidity_2m}%</p>
          </div>
          <div>
            <p className="text-white/40 text-xs">Wind</p>
            <p className="text-[#7DD8CC] text-base">{wind} {speedLabel(unit)}</p>
          </div>
          <div>
            <p className="text-white/40 text-xs">Rain (next hr)</p>
            <p className="text-[#7DD8CC] text-base">{raw_weather.hourly.precipitation_probability[0]}%</p>
          </div>
          <div>
            <p className="text-white/40 text-xs">Precipitation</p>
            <p className="text-[#7DD8CC] text-base">{raw_weather.current.precipitation} mm</p>
          </div>
        </div>
      </div>

      {reply && (
        <div className="mt-6 pt-6 border-t border-white/10">
          <p className="text-white/50 text-xs uppercase tracking-wide mb-2">AI Weather Analysis</p>
          <p className="text-white/90 text-sm leading-relaxed">{reply}</p>
        </div>
      )}
    </div>
  );
}
