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
    try:
        response = client.chat.completions.create(
            model="openai/gpt-oss-20b",
            messages=[{"role": "user", "content": prompt}],
            temperature=0
        )
        text = response.choices[0].message.content.strip()
        text = text.replace("```json", "").replace("```", "").strip()
        return json.loads(text)
    except json.JSONDecodeError:
        return {"city": None, "intent": user_query}
    except Exception as e:
        raise RuntimeError(f"LLM intent extraction failed: {str(e)}")

ROLE_INSTRUCTIONS = {
    "General": "Answer in plain, everyday language suitable for daily life decisions (umbrella, clothing, travel).",
    "Agriculture": "Answer as an agricultural advisory. Focus on soil moisture, precipitation, evapotranspiration and irrigation/sowing/harvest implications.",
    "Marine": "Answer as a marine/coastal advisory. Focus on wave height, wave period, wind, and safety for boats/fishing operations.",
    "Aviation": "Answer as an aviation weather briefing. Focus on wind speed/direction at altitude, visibility, and cloud cover relevant to flight conditions.",
    "Smart City": "Answer as a smart-city operations advisory. Focus on rainfall accumulation, flooding risk, and infrastructure/traffic implications."
}

LANGUAGE_NAMES = {
    "English": "English",
    "ಕನ್ನಡ": "Kannada",
    "हिंदी": "Hindi"
}

def explain_weather(user_query: str, weather_data: dict, role: str = "General", extra_data: dict = None, language: str = "English"):
    role_instruction = ROLE_INSTRUCTIONS.get(role, ROLE_INSTRUCTIONS["General"])
    language_name = LANGUAGE_NAMES.get(language, "English")

    combined_data = {"core_weather": weather_data}
    if extra_data:
        combined_data["role_specific_data"] = extra_data

    prompt = f"""You are a weather assistant speaking to a {role} user. A user asked: "{user_query}"

{role_instruction}

Respond ENTIRELY in {language_name}. Do not mix in English unless it's a proper noun (like a city name).

Here is the ONLY weather data you are allowed to use (do not invent any numbers):
{json.dumps(combined_data)}

FORMAT RULES:
- Write in plain, natural conversational sentences, like you're explaining it to a friend who knows nothing about weather. No markdown, no headers, no bold text, no bullet points, no tables.
- Use as many sentences as genuinely needed to make it clear and useful — don't force it to be artificially short, but don't ramble either. A couple of sentences is fine for a simple question; a bit more is fine if the situation actually has more nuance (e.g. conditions changing through the day).
- Do not list out every single hour's forecast — summarize patterns instead (e.g. "rain picks up after 4pm and stays heavy into the evening").
- Include the specific numbers that actually matter (temperature, peak rain chance, wind if relevant), explained in plain terms a common person would understand, not just raw stats.
- End with a short, practical suggestion woven naturally into the answer, not as a separate labeled section.

Now answer the user's question in this style, using only the real data provided.
"""
    response = client.chat.completions.create(
        model="openai/gpt-oss-20b",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.4,
        max_tokens=600
    )
    return response.choices[0].message.content.strip()
