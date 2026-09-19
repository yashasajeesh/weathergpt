def generate_alerts(weather_data: dict, role: str = "General"):
    alerts = []
    current = weather_data.get("current", {})
    hourly = weather_data.get("hourly", {})

    temp = current.get("temperature_2m")
    wind = current.get("wind_speed_10m")
    precip_now = current.get("precipitation", 0)

    rain_probs = hourly.get("precipitation_probability", [])
    max_rain_next_12h = max(rain_probs[:12]) if rain_probs else 0

    if max_rain_next_12h >= 70:
        alerts.append({
            "level": "high",
            "title": "Heavy rain likely",
            "message": f"Rain probability reaches {max_rain_next_12h}% in the next 12 hours. Risk of waterlogging in low-lying areas.",
        })
    elif max_rain_next_12h >= 40:
        alerts.append({
            "level": "moderate",
            "title": "Rain expected",
            "message": f"Rain probability up to {max_rain_next_12h}% in the next 12 hours. Keep rain gear handy.",
        })

    if wind is not None and wind >= 40:
        alerts.append({
            "level": "high",
            "title": "Strong wind advisory",
            "message": f"Current wind speed is {wind} km/h. Secure loose outdoor items and drive carefully.",
        })

    if temp is not None:
        if temp >= 38:
            alerts.append({
                "level": "high",
                "title": "Extreme heat",
                "message": f"Temperature is {temp}°C. Stay hydrated and avoid prolonged sun exposure.",
            })
        elif temp <= 8:
            alerts.append({
                "level": "moderate",
                "title": "Cold conditions",
                "message": f"Temperature is {temp}°C. Dress warmly, especially early morning and night.",
            })

    if precip_now and precip_now > 0:
        alerts.append({
            "level": "low",
            "title": "Currently raining",
            "message": f"Precipitation of {precip_now} mm is being recorded right now.",
        })

    if not alerts:
        alerts.append({
            "level": "none",
            "title": "No active alerts",
            "message": "Conditions look normal based on current data. No thresholds exceeded.",
        })

    return alerts
