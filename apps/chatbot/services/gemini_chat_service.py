import os

from dotenv import load_dotenv
from google import genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

client = genai.Client(
    api_key=api_key
)

SYSTEM_PROMPT = """
You are NagarSetu AI Assistant.

You help citizens regarding:
- civic complaints
- departments
- municipal problems
- complaint filing
- public issue guidance

Departments:
- Roads Department
- Water Department
- Sanitation Department
- Electricity Department
- Drainage Department

Rules:
- Be concise
- Be citizen friendly
- Avoid harmful responses
- Stay focused on civic issues
- If you dont know the answer say Sorry I dont have to context to this question
"""
FAQS = [
    {
        "keywords": [
            "garbage",
            "trash",
            "waste",
            "dirty area",
            "cleanliness",
        ],
        "answer":
            "Garbage and waste related complaints are handled by the Sanitation Department."
    },

    {
        "keywords": [
            "pothole",
            "road damage",
            "broken road",
            "damaged road",
            "bad road",
        ],
        "answer":
            "Road damage and pothole complaints are handled by the Roads Department."
    },

    {
        "keywords": [
            "water leakage",
            "water pipe",
            "water issue",
            "water supply",
            "pipeline leak",
        ],
        "answer":
            "Water related complaints are handled by the Water Department."
    },

    {
        "keywords": [
            "drain",
            "drainage",
            "sewage",
            "blocked drain",
            "overflow drain",
        ],
        "answer":
            "Drainage and sewage complaints are handled by the Drainage Department."
    },

    {
        "keywords": [
            "street light",
            "electricity",
            "electric wire",
            "power issue",
            "light not working",
        ],
        "answer":
            "Electricity and street light complaints are handled by the Electricity Department."
    },

    {
        "keywords": [
            "file complaint",
            "raise complaint",
            "submit complaint",
            "create complaint",
        ],
        "answer":
            "Go to the Create Complaint page, upload issue image, review AI suggestions, and submit the complaint."
    },

    {
        "keywords": [
            "track complaint",
            "complaint status",
            "my complaints",
            "status check",
        ],
        "answer":
            "You can track complaint progress from the My Complaints section in NagarSetu."
    },{
    "keywords": [
        "track complaint",
        "complaint status",
        "status of complaint",
        "current status",
        "my complaint status",
        "check complaint",
        "status check",
    ],
    "answer":
        "You can track complaint progress from the My Complaints section in NagarSetu."}
]

def check_faq(user_message):

    user_message = user_message.lower()

    for faq in FAQS:

        for keyword in faq["keywords"]:

            if keyword in user_message:

                return faq["answer"]

    return None
def get_chatbot_response(user_message,context=None):

    try:

        prompt = f"""
{SYSTEM_PROMPT}

Context:
{context}

Citizen Message:
{user_message}
"""
        faq_response = check_faq(user_message)

        if faq_response:
            return {
                "reply": faq_response,
                "source": "faq"
            }

        response = client.models.generate_content(
            model="gemini-2.5-flash-lite",
            contents=prompt,
        )

        return {
            "reply": response.text.strip()
        }

    except Exception as e:

        return {
            "reply":
                "Sorry, AI assistant is temporarily unavailable.",
            "error": str(e)
        }