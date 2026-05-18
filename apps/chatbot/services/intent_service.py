COMPLAINT_STATUS_KEYWORDS = [
    "complaint status",
    "track complaint",
    "my complaint",
    "latest complaint",
    "pending complaint",
    "complaint progress",
]


def is_complaint_status_query(
    message: str
):

    message = message.lower()

    return any(
        keyword in message
        for keyword in
        COMPLAINT_STATUS_KEYWORDS
    )