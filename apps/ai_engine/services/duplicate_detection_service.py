from sentence_transformers import SentenceTransformer

model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)


def generate_embedding(
    text: str,
):

    embedding = model.encode(
        text
    )

    return embedding.tolist()

from sklearn.metrics.pairwise import (
    cosine_similarity,
)


def calculate_similarity(
    embedding1,
    embedding2,
):

    similarity = cosine_similarity(
        [embedding1],
        [embedding2],
    )[0][0]

    return float(similarity)

from apps.complaints.models import (
    Complaint,
)


def find_duplicate_complaint(
    complaint,
    threshold=0.85,
):

    highest_similarity = 0
    duplicate_complaint = None

    for existing in Complaint.objects.exclude(
        id=complaint.id
    ):

        if not existing.embedding:
            continue

        similarity = calculate_similarity(
            complaint.embedding,
            existing.embedding,
        )

        print(
            f"Similarity with complaint "
            f"{existing.id}: {similarity}"
        )

        if similarity > highest_similarity:

            highest_similarity = similarity
            duplicate_complaint = existing

    if (
        duplicate_complaint
        and highest_similarity >= threshold
    ):

        return {
            "is_duplicate": True,
            "duplicate_of": duplicate_complaint,
            "similarity": round(
                highest_similarity,
                2,
            ),
        }

    return {
        "is_duplicate": False,
        "duplicate_of": None,
        "similarity": round(
            highest_similarity,
            2,
        ),
    }