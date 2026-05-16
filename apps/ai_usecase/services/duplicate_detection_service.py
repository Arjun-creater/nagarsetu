# from sentence_transformers import SentenceTransformer
# from sentence_transformers.util import cos_sim

# from apps.complaints.models import Complaint


# _model = None


# def get_model():
#     global _model

#     if _model is None:
#         _model = SentenceTransformer(
#             "all-MiniLM-L6-v2"
#         )

#     return _model


# SIMILARITY_THRESHOLD = 0.80


# def check_duplicate_complaint(*, complaint):
#     print("DUPLICATE CHECK STARTED")

#     model = get_model()

#     current_text = f"""
# Title: {complaint.title}

# Description: {complaint.description}

# Address: {complaint.address}
# """

#     current_embedding = model.encode(
#         current_text,
#         convert_to_tensor=True,
#     )

#     previous_complaints = (
#         Complaint.objects
#         .exclude(id=complaint.id)
#         .order_by("-created_at")[:20]
#     )

#     for old_complaint in previous_complaints:

#         old_text = f"""
# Title: {old_complaint.title}

# Description: {old_complaint.description}

# Address: {old_complaint.address}
# """
#         old_embedding = model.encode(
#             old_text,
#             convert_to_tensor=True,
#         )

#         similarity = cos_sim(
#             current_embedding,
#             old_embedding,
#         ).item()

#         print(similarity)

#         if similarity >= SIMILARITY_THRESHOLD:

#             complaint.is_duplicate = True
#             complaint.duplicate_of = old_complaint

#             complaint.save(
#                 update_fields=[
#                     "is_duplicate",
#                     "duplicate_of",
#                 ]
#             )

#             return {
#                 "is_duplicate": True,
#                 "duplicate_id": old_complaint.id,
#                 "similarity": similarity,
#             }

#     return {
#         "is_duplicate": False,
#     }