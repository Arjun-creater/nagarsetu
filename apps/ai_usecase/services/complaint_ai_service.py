from apps.ai_usecase.services.classifier_service import (
    classify_department,
)

from apps.ai_usecase.services.priority_service import (
    classify_priority,
)

from apps.ai_engine.services.duplicate_detection_service import (
    generate_embedding,
    find_duplicate_complaint,
)

from apps.complaints.services.sla_service import (
    create_complaint_sla,
)


def process_complaint_ai(*, complaint):

    combined_text = f"""
    Title: {complaint.title}

    Description: {complaint.description}
    """

    # GENERATE EMBEDDING
    embedding = generate_embedding(
        combined_text
    )

    complaint.embedding = embedding

    # FIND DUPLICATES
    duplicate_result = (
        find_duplicate_complaint(
            complaint
        )
    )

    if duplicate_result[
        "is_duplicate"
    ]:

        complaint.is_duplicate = True

        complaint.duplicate_of = (
            duplicate_result[
                "duplicate_of"
            ]
        )

        print(
            f"Duplicate found: "
            f"{complaint.id} -> "
            f"{duplicate_result['duplicate_of'].id}"
        )

    # TEXT AI DEPARTMENT
    department_result = (
        classify_department(
            combined_text
        )
    )

    # PRIORITY AI
    priority_result = (
        classify_priority(
            complaint.description
        )
    )

    # CREATE SLA
    

    # SAVE MAIN AI RESULTS
    complaint.ai_department = (
        department_result[
            "department"
        ]
    )

    complaint.ai_confidence_score = (
        department_result[
            "score"
        ]
    )
    complaint.priority = (
    priority_result["priority"]
)

    complaint.ai_priority = (
        priority_result[
            "priority"
        ]
    )

    complaint.is_ai_processed = True
    create_complaint_sla(
    complaint
)

    # EXPLAINABILITY FIELDS

    # TEXT AI
    complaint.text_ai_category = (
        department_result[
            "department"
        ]
    )

    complaint.text_ai_confidence = (
        department_result[
            "score"
        ]
    )

    # IMAGE AI
    # Currently placeholder because
    # image AI pipeline separate

    complaint.image_ai_department = (
        None
    )

    complaint.image_ai_confidence = (
        0.0
    )

    # FINAL AI
    complaint.final_ai_department = (
        department_result[
            "department"
        ]
    )

    complaint.final_ai_confidence = (
        department_result[
            "score"
        ]
    )

    complaint.ai_reasoning = (
        f"Department classified as "
        f"{department_result['department']} "
        f"with confidence "
        f"{department_result['score']}"
    )

    complaint.requires_manual_review = (
        department_result[
            "score"
        ] < 0.5
    )

    print(
        "Department Result:",
        department_result
    )

    print(
        "Priority Result:",
        priority_result
    )
    print(
    complaint.text_ai_category
)

    print(
    complaint.final_ai_department
)

    complaint.save(
        update_fields=[
            "embedding",
            "is_duplicate",
            "duplicate_of",
            "ai_department",
            "ai_confidence_score",
            "priority",     
            "ai_priority",
            "is_ai_processed",

            # EXPLAINABILITY
            "text_ai_category",
            "text_ai_confidence",
            "image_ai_department",
            "image_ai_confidence",
            "final_ai_department",
            "final_ai_confidence",
            "ai_reasoning",
            "requires_manual_review",
        ]
    )