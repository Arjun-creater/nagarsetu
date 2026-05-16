import json
import os
import time
from pathlib import Path

from dotenv import load_dotenv
from google import genai
from PIL import Image

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY not found in .env")

client = genai.Client(api_key=api_key)

VALID_DEPARTMENTS = [
    "Roads",
    "Water",
    "Sanitation",
    "Electricity",
    "Drainage",
]

PROMPT = """
You are an AI classifier for municipal civic complaints.

Analyze the uploaded image carefully.

First determine whether the image is related
to a real civic or municipal issue.

If the image is unrelated to civic issues
(for example selfies, pets, food, indoor rooms,
memes, random screenshots, nature photos, etc.)
then return:

{
  "department": "Unknown",
  "confidence": 0.0,
  "label": "Not a civic issue",
  "reasoning": "Image does not contain a civic problem.",
  "is_civic_issue":False
}

ONLY if the image clearly shows a civic issue,
choose ONE department based on the PRIMARY issue.

Departments:

- Roads:
  potholes, broken asphalt, road cracks, damaged pavement

- Water:
  clean water leakage, burst pipes, water supply overflow

- Sanitation:
  garbage, trash, litter, waste accumulation, overflowing dustbins

- Electricity:
  damaged electric poles, exposed wires, broken street lights, hanging cables

- Drainage:
  sewage overflow, blocked drains, dirty gutter overflow, manhole overflow

Important distinctions:
- If the issue is sewage/drain water -> Drainage
- If the issue is clean pipeline water leakage -> Water
- If road damage contains water but MAIN issue is pothole -> Roads
- Ignore background objects.

Return ONLY valid JSON in this format:

{
  "department": "",
  "confidence": 0.0,
  "label": "",
  "reasoning": "",
  "is_civic_issue": false
}
"""


def classify_image(image_path: str, confidence_threshold: float = 0.5) -> dict:

    try:
        image_path = Path(image_path)

        print("========== GEMINI IMAGE DEBUG ==========")
        print("IMAGE PATH:", image_path)
        print("FILE EXISTS:", image_path.exists())
        print("ABSOLUTE PATH:", image_path.resolve())

        if not image_path.exists():
            return {
                "department": "Unknown",
                "confidence": 0.0,
                "label": "Image file not found",
                "reasoning": "Provided image path does not exist.",
            }

        # Open image safely
        image = Image.open(image_path)

        print("IMAGE SIZE:", image.size)
        print("IMAGE MODE:", image.mode)

        # Resize image to reduce token usage
        image.thumbnail((512, 512))

        response = None

        # Retry logic for temporary quota/rate issues
        for attempt in range(3):

            try:
                response = client.models.generate_content(
                    model="gemini-2.5-flash-lite",
                    contents=[
                        PROMPT,
                        image,
                    ],
                )

                break

            except Exception as e:
                print(f"GEMINI ATTEMPT {attempt + 1} FAILED:", str(e))

                if "429" in str(e):
                    time.sleep(7)
                else:
                    raise

        if not response:
            return {
                "department": "Unknown",
                "confidence": 0.0,
                "label": "Gemini request failed",
                "reasoning": "No response received from Gemini.",
            }

        raw = response.text.strip()

        print("RAW GEMINI RESPONSE:")
        print(raw)

        # Remove markdown if Gemini adds it
        if raw.startswith("```"):
            raw = raw.split("```")[1]

            if raw.startswith("json"):
                raw = raw[4:]

        raw = raw.strip()

        # Safe JSON parsing
        try:
            result = json.loads(raw)

        except json.JSONDecodeError:
            return {
                "department": "Unknown",
                "confidence": 0.0,
                "label": "Invalid JSON response",
                "reasoning": raw[:300],
            }

        department = result.get("department", "Unknown")
        confidence = result.get("confidence", 0.0)

        # Validate department
        if department not in VALID_DEPARTMENTS:
            return {
                "department": "Unknown",
                "confidence": 0.0,
                "label": "Invalid department predicted",
                "reasoning": result.get("reasoning", ""),
                "is_civic_issue": False
            }

        # Confidence filtering
        # if confidence < confidence_threshold:
        #     return {
        #         "department": "Unknown",
        #         "confidence": confidence,
        #         "label": "Low confidence prediction",
        #         "reasoning": result.get("reasoning", ""),
        #         "is_civic_issue": False
        #     }

        final_result = {
            "department": department,
            "confidence": confidence,
            "label": result.get("label", ""),
            "reasoning": result.get("reasoning", ""),
            "is_civic_issue": True
        }

        print("FINAL AI RESULT:")
        print(final_result)

        return final_result

    except Exception as e:
        print("GEMINI CLASSIFICATION ERROR:", str(e))

        return {
            "department": "Unknown",
            "confidence": 0.0,
            "label": "AI classification failed",
            "reasoning": str(e),
            "is_civic_issue": False
        }