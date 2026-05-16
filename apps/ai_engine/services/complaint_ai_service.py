def analyze_complaint_text(
    *,
    text,
):

    text = text.lower()

    category = "other"
    priority = "medium"
    confidence = 0.5

    # CATEGORY PREDICTION

    # CATEGORY PREDICTION

    if any(
        keyword in text
        for keyword in [
            "sewage",
            "drainage",
            "drain",
            "manhole",
            "overflow",
            "foul smell",
            "gutter",
        ]
    ):
        category = "sewage"
        confidence = 0.92

    elif any(
        keyword in text
        for keyword in [
            "water",
            "leakage",
            "pipeline",
            "water logging",
        ]
    ):
        category = "water"
        confidence = 0.85

    elif any(
        keyword in text
        for keyword in [
            "garbage",
            "waste",
            "dustbin",
            "trash",
            "litter",
        ]
    ):
        category = "garbage"
        confidence = 0.88

    elif any(
        keyword in text
        for keyword in [
            "light",
            "electricity",
            "transformer",
            "power",
            "wire",
            "shock",
        ]
    ):
        category = "electricity"
        confidence = 0.9

    elif any(
        keyword in text
        for keyword in [
            "pothole",
            "traffic",
            "crack",
            "broken road",
            "damaged road",
        ]
    ):
        category = "roads"
        confidence = 0.87
        priority = "low"

    return {
        "category": category,
        
        "confidence": confidence,
    }