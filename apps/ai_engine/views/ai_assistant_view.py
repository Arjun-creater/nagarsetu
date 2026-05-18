from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from apps.ai_usecase.services.image_classifier_service import classify_image
import os
import tempfile


class AIComplaintAssistantAPIView(APIView):

    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):

        image = request.FILES.get("image")

        if not image:
            return Response({"error": "Image required"}, status=400)

        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp_file:
            for chunk in image.chunks():
                temp_file.write(chunk)
            temp_image_path = temp_file.name

        image_result = classify_image(temp_image_path)
        if image_result.get(
    "error"
) == "AI quota exceeded":

            return Response({

                "error":
                    "AI quota exceeded",

                "message":
                    image_result.get(
                        "message"
                    )

            }, status=429)
        

        os.remove(temp_image_path)

        # ✅ Bug fix 1: default is False, not True
        if not image_result.get("is_civic_issue", False):
            return Response({
                "is_civic_issue": False,
                "message": "This image does not appear related to a civic issue."
            })

        # ✅ Bug fix 2: default is "Unknown", not "general"
        department = image_result.get("department", "Unknown")
        confidence = image_result.get("confidence", 0)
        department_id = image_result.get(
    "department_id"
)

        return Response({
            "department": department,
            "department_id": department_id,
            "confidence": confidence,
            "is_civic_issue": True,
            "suggested_title": f"{department} Issue",
            "suggested_description": (
                f"AI detected a possible {department} related issue "
                f"from the uploaded image."
            ),
            "priority": "medium",
        })