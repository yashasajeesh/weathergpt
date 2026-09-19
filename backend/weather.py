import httpx

async def get_coordinates(city: str):
    url = "https://geocoding-api.open-meteo.com/v1/search"
    params = {"name": city, "count": 1}
    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)
        data = response.json()
        if "results" not in data or len(data["results"]) == 0:
            return None
        result = data["results"][0]
        return {
            "lat": result["latitude"],
            "lon": result["longitude"],
            "name": result["name"],
            "country": result.get("country", "")
        }

async def get_weather(lat: float, lon: float):
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": lat,
        "longitude": lon,
        "current": "temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation,weather_code,cloud_cover",
        "hourly": "precipitation_probability,temperature_2m",
        "forecast_days": 2,
        "timezone": "auto"
    }
    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)
        return response.json()

async def get_aviation_data(lat: float, lon: float):
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": lat,
        "longitude": lon,
        "current": "wind_speed_10m,wind_direction_10m,visibility,cloud_cover",
        "hourly": "wind_speed_80m,wind_speed_120m,visibility",
        "forecast_days": 1,
        "timezone": "auto"
    }
    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)
        return response.json()

async def get_marine_data(lat: float, lon: float):
    url = "https://marine-api.open-meteo.com/v1/marine"
    params = {
        "latitude": lat,
        "longitude": lon,
        "current": "wave_height,wave_direction,wave_period",
        "forecast_days": 1,
        "timezone": "auto"
    }
    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)
        return response.json()

async def get_agriculture_data(lat: float, lon: float):
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": lat,
        "longitude": lon,
        "current": "soil_moisture_0_to_1cm,soil_temperature_0cm",
        "hourly": "evapotranspiration,precipitation",
        "forecast_days": 1,
        "timezone": "auto"
    }
    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)
        return response.json()
