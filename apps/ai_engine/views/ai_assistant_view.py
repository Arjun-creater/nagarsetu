from rest_framework.views import APIView

from rest_framework.response import (
    Response,
)

from rest_framework.parsers import (
    MultiPartParser,
    FormParser,
)

from apps.ai_usecase.services.image_classifier_service import (
    classify_image,
)
import os
import tempfile

class AIComplaintAssistantAPIView(
    APIView
):

    parser_classes = [
        MultiPartParser,
        FormParser,
    ]

    def post(
        self,
        request,
    ):

        image = request.FILES.get(
            "image"
        )

        if not image:

            return Response(
                {
                    "error":
                        "Image required"
                },
                status=400,
            )

        with tempfile.NamedTemporaryFile(
    delete=False,
    suffix=".jpg",
) as temp_file:
             

            for chunk in image.chunks():

                temp_file.write(chunk)

            temp_image_path = (
                temp_file.name
            )

        image_result = classify_image(
            temp_image_path
        )

        os.remove(temp_image_path)

        department = image_result.get(
            "department",
            "general"
        )

        confidence = image_result.get(
            "confidence",
            0
        )

        generated_title = (
            f"{department.title()} Issue"
        )

        generated_description = (
            f"AI detected a possible "
            f"{department} related issue "
            f"from uploaded image."
        )

        return Response({

            "department":
                department,

            "confidence":
                confidence,
            "is_civic_issue":
    image_result.get(
        "is_civic_issue",
        True
    ),    

            "suggested_title":
                generated_title,

            "suggested_description":
                generated_description,

            "priority":
                "medium",
                
        })