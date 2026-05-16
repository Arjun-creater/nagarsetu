from celery import shared_task

from apps.complaints.models import (
    Complaint,
    ComplaintMedia,
)

from apps.ai_engine.services.complaint_ai_service import (
    analyze_complaint_text,
)

from apps.ai_engine.services.department_routing_service import (
    get_department_for_category,
)

from apps.complaints.services.assignment_service import (
    auto_assign_department,
)

from apps.ai_usecase.services.image_classifier_service import (
    classify_image,
)

from apps.ai_engine.services.fusion_service import (
    get_final_department,
)


@shared_task
def process_complaint_ai(
    complaint_id,
    media_id=None,
):

    try:

        complaint = Complaint.objects.get(
            id=complaint_id
        )

        text = (
            f"{complaint.title} "
            f"{complaint.description}"
        )

        # =========================
        # TEXT AI ANALYSIS
        # =========================

        result = analyze_complaint_text(
            text=text
        )

        complaint.category = result[
            "category"
        ]

        complaint.priority = result[
            "priority"
        ]
        complaint.ai_priority = (
    result["priority"]
)

        # TEXT AI EXPLAINABILITY

        complaint.text_ai_category = (
            result["category"]
        )

        complaint.text_ai_confidence = (
            result.get(
                "confidence",
                0.7,
            )
        )

        # ROUTING FROM TEXT AI

        department = (
            get_department_for_category(
                category=result["category"]
            )
        )

        if department:
            complaint.department = (
                department
            )

        # =========================
        # IMAGE AI ANALYSIS
        # =========================

        if media_id:

            try:

                media = (
                    ComplaintMedia.objects.get(
                        id=media_id
                    )
                )

                print(
                    "PROCESSING MEDIA:"
                )

                print(
                    "MEDIA ID:",
                    media.id
                )

                print(
                    "IMAGE:",
                    media.image.path
                )

                image_result = (
                    classify_image(
                        media.image.path
                    )
                )

                print(
                    "IMAGE AI RESULT:"
                )

                print(image_result)

                # SAVE IMAGE AI FIELDS

                complaint.image_ai_department = (
                    image_result[
                        "department"
                    ]
                )

                complaint.image_ai_confidence = (
                    image_result[
                        "confidence"
                    ]
                )

            except ComplaintMedia.DoesNotExist:

                print(
                    f"Media "
                    f"{media_id} "
                    f"not found."
                )

        # =========================
        # FUSION AI
        # =========================

        fusion_result = (
            get_final_department(
                text_result={
                    "category":
                        result["category"],

                    "confidence":
                        result.get(
                            "confidence",
                            0.7,
                        ),
                },

                image_result={
                    "department":
                        complaint.image_ai_department,

                    "confidence":
                        complaint.image_ai_confidence,
                },
            )
        )

        print("FUSION RESULT:")
        print(fusion_result)

        # SAVE FINAL AI FIELDS

        complaint.final_ai_department = (
            fusion_result[
                "department"
            ]
        )

        complaint.final_ai_confidence = (
            fusion_result[
                "confidence"
            ]
        )

        complaint.ai_reasoning = (
            fusion_result[
                "reason"
            ]
        )

        complaint.requires_manual_review = (
            fusion_result[
                "requires_manual_review"
            ]
        )

        # FINAL ROUTING

        final_department = (
            get_department_for_category(
                category=fusion_result[
                    "department"
                ]
            )
        )

        if final_department:

            complaint.department = (
                final_department
            )

        # =========================
        # SAVE COMPLAINT
        # =========================
        print("FINAL PRIORITY:")
        print(complaint.priority)

        print("FINAL AI PRIORITY:")
        print(complaint.ai_priority)
        complaint.save()

        # =========================
        # AUTO ASSIGNMENT
        # =========================

        auto_assign_department(
            complaint=complaint
        )

        print(
            f"AI processed complaint "
            f"{complaint.id}"
        )

    except Complaint.DoesNotExist:

        print(
            f"Complaint "
            f"{complaint_id} "
            f"not found."
        )