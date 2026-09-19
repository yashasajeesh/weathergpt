import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def extract_intent(user_query: str):
    prompt = f"""Extract the city/location and what the user wants to know from this weather query.
Respond ONLY with valid JSON in this exact format, nothing else:
{{"city": "<city name>", "intent": "<short description of what they want>"}}

Query: "{user_query}"
"""
    response = client.chat.completions.create(
        model="openai/gpt-oss-20b",
        messages=[{"role": "user", "content": prompt}],
        temperature=0
    )
    text = response.choices[0].message.content.strip()
    return json.loads(text)

ROLE_INSTRUCTIONS = {
    "General": "Answer in plain, everyday language suitable for daily life decisions (umbrella, clothing, travel).",
    "Agriculture": "Answer as an agricultural advisory. Focus on soil moisture, precipitation, evapotranspiration and irrigation/sowing/harvest implications.",
    "Marine": "Answer as a marine/coastal advisory. Focus on wave height, wave period, wind, and safety for boats/fishing operations.",
    "Aviation": "Answer as an aviation weather briefing. Focus on wind speed/direction at altitude, visibility, and cloud cover relevant to flight conditions.",
    "Smart City": "Answer as a smart-city operations advisory. Focus on rainfall accumulation, flooding risk, and infrastructure/traffic implications."
}

def explain_weather(user_query: str, weather_data: dict, role: str = "General", extra_data: dict = None):
    role_instruction = ROLE_INSTRUCTIONS.get(role, ROLE_INSTRUCTIONS["General"])

    combined_data = {"core_weather": weather_data}
    if extra_data:
        combined_data["role_specific_data"] = extra_data

    prompt = f"""You are a weather assistant speaking to a {role} user. A user asked: "{user_query}"

{role_instruction}

Here is the ONLY weather data you are allowed to use (do not invent any numbers):
{json.dumps(combined_data)}

Give a short, clear, natural-language answer tailored to this {role} user's needs using only this data. If role-specific data is missing or unavailable, say so briefly rather than guessing.
"""
    response = client.chat.completions.create(
        model="openai/gpt-oss-20b",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3
    )
    return response.choices[0].message.content.strip()
