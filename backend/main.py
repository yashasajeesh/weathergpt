from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from weather_service import (
    get_coordinates,
    get_weather,
    get_aviation_data,
    get_marine_data,
    get_agriculture_data,
    get_historical_weather,
)
from llm_service import extract_intent, explain_weather
from alerts_service import generate_alerts

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    role: str = "General"
    language: str = "English"

@app.get("/")
def read_root():
    return {"message": "WeatherGPT backend is running"}

@app.get("/weather")
async def weather(city: str):
    location = await get_coordinates(city)
    if location is None:
        return {"error": "City not found"}
    data = await get_weather(location["lat"], location["lon"])
    return {"location": location, "weather": data}

@app.get("/history")
async def history(city: str, days: int = 30):
    location = await get_coordinates(city)
    if location is None:
        return {"error": "City not found"}
    try:
        data = await get_historical_weather(location["lat"], location["lon"], days)
    except Exception:
        return {"error": "Couldn't fetch historical data right now. Please try again shortly."}
    return {"location": location, "history": data}

@app.post("/chat")
async def chat(request: ChatRequest):
    if not request.message or not request.message.strip():
        return {"error": "Please type a question about the weather."}

    try:
        intent = extract_intent(request.message)
    except RuntimeError as e:
        return {"error": "The AI service is temporarily unavailable. Please try again in a moment."}

    city = intent.get("city")
    if not city:
        return {"error": "I couldn't figure out which city you're asking about. Try including a city name, e.g. 'weather in Chennai'."}

    try:
        location = await get_coordinates(city)
    except Exception:
        return {"error": "Couldn't reach the location service. Please check your internet connection and try again."}

    if location is None:
        return {"error": f"Sorry, I couldn't find the city '{city}'. Please check the spelling and try again."}

    try:
        weather_data = await get_weather(location["lat"], location["lon"])
    except Exception:
        return {"error": "Couldn't fetch weather data right now. Please try again shortly."}

    extra_data = None
    try:
        if request.role == "Aviation":
            extra_data = await get_aviation_data(location["lat"], location["lon"])
        elif request.role == "Marine":
            extra_data = await get_marine_data(location["lat"], location["lon"])
        elif request.role == "Agriculture":
            extra_data = await get_agriculture_data(location["lat"], location["lon"])
    except Exception:
        extra_data = None

    try:
        reply = explain_weather(request.message, weather_data, request.role, extra_data, request.language)
    except Exception:
        reply = "I have the weather data but couldn't generate an explanation right now. Please try again."

    try:
        alerts = generate_alerts(weather_data, request.role)
    except Exception:
        alerts = []

    return {
        "reply": reply,
        "location": location,
        "raw_weather": weather_data,
        "role": request.role,
        "alerts": alerts
    }
