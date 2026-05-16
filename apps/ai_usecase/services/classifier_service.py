from transformers import pipeline

_classifier = None


def get_classifier():
    global _classifier

    if _classifier is None:
        _classifier = pipeline(
            "zero-shot-classification",
            model="valhalla/distilbart-mnli-12-3",
        )

    return _classifier


KEYWORD_MAPPING = {
    "electricity": "Electricity",
    "wire": "Electricity",
    "street light": "Electricity",
    "power": "Electricity",

    "garbage": "Sanitation",
    "trash": "Sanitation",
    "waste": "Sanitation",

    "pothole": "Roads",
    "road": "Roads",

    "water leakage": "Water",
    "water": "Water",

    "drain": "Drainage",
    "sewage": "Drainage",
}


DEPARTMENTS = [
    "Sanitation and garbage issues",
    "Road and pothole issues",
    "Water supply and leakage issues",
    "Electricity and street light issues",
    "Drainage and sewage issues",
    "Public safety and emergency issues",
]


LABEL_MAPPING = {
    "Sanitation and garbage issues": "Sanitation",
    "Road and pothole issues": "Roads",
    "Water supply and leakage issues": "Water",
    "Electricity and street light issues": "Electricity",
    "Drainage and sewage issues": "Drainage",
    "Public safety and emergency issues": "Public Safety",
}


def classify_department(text):

    lower_text = text.lower()

    # RULE-BASED MATCHING
    for keyword, department in KEYWORD_MAPPING.items():

        if keyword in lower_text:

            return {
                "department": department,
                "score": 0.95,
            }

    # AI FALLBACK
    classifier = get_classifier()

    result = classifier(
        text,
        DEPARTMENTS,
    )

    predicted_label = result["labels"][0]

    return {
        "department": LABEL_MAPPING[predicted_label],
        "score": result["scores"][0],
    }