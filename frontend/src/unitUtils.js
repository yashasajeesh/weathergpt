export function convertTemp(celsius, unit) {
  if (unit === "imperial") return Math.round((celsius * 9) / 5 + 32);
  return Math.round(celsius);
}

export function convertSpeed(kmh, unit) {
  if (unit === "imperial") return Math.round(kmh * 0.621371);
  return Math.round(kmh);
}

export function tempLabel(unit) {
  return unit === "imperial" ? "°F" : "°C";
}

export function speedLabel(unit) {
  return unit === "imperial" ? "mph" : "km/h";
}
