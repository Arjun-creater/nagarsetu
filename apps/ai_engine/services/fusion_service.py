def get_final_department(
    text_result,
    image_result,
):
    """
    Combines text AI and image AI predictions
    into a final department decision.
    """

    text_department = text_result.get(
        "category"
    )

    text_confidence = text_result.get(
        "confidence",
        0,
    )

    image_department = image_result.get(
        "department"
    )

    image_confidence = image_result.get(
        "confidence",
        0,
    )

    # SAME PREDICTION
    if (
        text_department
        and image_department
        and text_department == image_department
    ):
        return {
            "department": text_department,
            "confidence": round(
                (
                    text_confidence
                    + image_confidence
                ) / 2,
                2,
            ),
            "reason": "Text AI and Image AI agree",
            "requires_manual_review": False,
        }

    # TEXT STRONGER
    if text_confidence >= image_confidence:
        final_confidence = round(
            (
                text_confidence * 0.7
            )
            + (
                image_confidence * 0.3
            ),
            2,
        )

        return {
            "department": text_department,
            "confidence": final_confidence,
            "reason": "Text AI weighted higher",
            "requires_manual_review":
                final_confidence < 0.5,
        }

    # IMAGE STRONGER
    final_confidence = round(
        (
            image_confidence * 0.7
        )
        + (
            text_confidence * 0.3
        ),
        2,
    )

    return {
        "department": image_department,
        "confidence": final_confidence,
        "reason": "Image AI weighted higher",
        "requires_manual_review":
            final_confidence < 0.5,
    }