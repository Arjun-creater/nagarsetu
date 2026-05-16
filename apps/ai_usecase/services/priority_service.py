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


PRIORITIES = [
    "low",
    "medium",
    "high",
    "critical",
]
HIGH_PRIORITY_KEYWORDS = [
    "danger",
    "urgent",
    "accident",
    "fire",
    "blast",
    "shock",
    "exposed wire",
    "flood",
    "severe",
    "collapsed",
    "major pothole",
    "deep pothole",
]

MEDIUM_PRIORITY_KEYWORDS = [
    "pothole",
    "road damage",
    "garbage",
    "water leakage",
    "street light",
    "drain blockage",
]

LOW_PRIORITY_KEYWORDS = [
    "minor",
    "small",
]


def classify_priority(text):

    text = text.lower()

    for keyword in HIGH_PRIORITY_KEYWORDS:

        if keyword in text:

            return {
                "priority": "high",
                "score": 0.9,
            }

    for keyword in MEDIUM_PRIORITY_KEYWORDS:

        if keyword in text:

            return {
                "priority": "medium",
                "score": 0.7,
            }

    for keyword in LOW_PRIORITY_KEYWORDS:

        if keyword in text:

            return {
                "priority": "low",
                "score": 0.5,
            }

    return {
        "priority": "medium",
        "score": 0.6,
    }