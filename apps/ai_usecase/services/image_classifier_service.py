import json
import os
import time
from pathlib import Path
from apps.departments.models import Department
from dotenv import load_dotenv
from google import genai
from PIL import Image

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY not found in .env")

client = genai.Client(api_key=api_key)

VALID_DEPARTMENTS = [
    "Roads Department",
    "Water Department",
    "Sanitation Department",
    "Electricity Department",
    "Drainage Department",
]

PROMPT = """
You are an AI classifier for municipal civic complaints.

Analyze the uploaded image carefully.

First determine whether the image clearly shows a civic or municipal issue.

Examples of civic issues:
- potholes
- broken roads
- garbage accumulation
- sewage overflow
- water leakage
- damaged street lights
- exposed electric wires
- blocked drains

Non-civic images include:
- selfies
- pets
- food
- indoor rooms
- memes
- screenshots
- anime/cartoons
- unrelated objects

If the image is NOT related to a civic issue:
- set is_civic_issue to False
- set department to "Unknown"

If the image IS related to a civic issue:
- set is_civic_issue to True
- choose ONE department only

Valid departments:
- Roads Department
- Water Department
- Sanitation Department
- Electricity Department
- Drainage Department
For unrelated images:
- department MUST be "Unknown"
- is_civic_issue MUST be False

For civic issue images:
- department MUST be one of:
  Roads, Water, Sanitation,
  Electricity, Drainage
- is_civic_issue MUST be true

Return ONLY valid JSON:

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

                "error":
                    "AI quota exceeded",

                "message":
                    "Daily AI analysis limit reached. Please try again later.",

                "is_civic_issue": None
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


# Fix Gemini invalid booleans
        raw = (
            raw
            .replace(": True", ": true")
            .replace(": False", ": false")
        )

        # Safe JSON parsing
        try:
            result = json.loads(raw)
            if not result.get(
    "is_civic_issue",
    False
):

                return {

                    "department": "Unknown",

                    "confidence": 0.0,

                    "label": "Not a civic issue",

                    "reasoning": result.get(
                        "reasoning",
                        ""
                    ),

                    "is_civic_issue": False
                }

        except json.JSONDecodeError:
            return {
                "department": "Unknown",
                "confidence": 0.0,
                "label": "Invalid JSON response",
                "reasoning": raw[:300],
                "is_civic_issue": False
            }

        department = result.get("department", "Unknown")
        
        DEPARTMENT_MAPPING = {

    "Roads":
        "Roads Department",

    "Water":
        "Water Department",

    "Sanitation":
        "Sanitation Department",

    "Electricity":
        "Electricity Department",

    "Drainage":
        "Drainage Department",
}

        department = DEPARTMENT_MAPPING.get(
            department,
            department
        )
        department_obj = Department.objects.filter(
    name__iexact=department
).first()
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
            "department_id": (
        department_obj.id
        if department_obj else None
    ),
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
        if "429" in str(e):

            return {

                "error":
                    "AI quota exceeded",

                "message":
                    "Daily AI analysis limit reached. Please try again later.",

                "is_civic_issue": None
            }

        return {
            "department": "Unknown",
            "confidence": 0.0,
            "label": "AI classification failed",
            "reasoning": str(e),
            "is_civic_issue": False
        }