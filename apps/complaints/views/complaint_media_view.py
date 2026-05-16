from rest_framework import viewsets
from rest_framework.parsers import (
    MultiPartParser,
    FormParser,
)

from apps.complaints.models import (
    ComplaintMedia,
)

from apps.complaints.serializers.complaint_media_serializer import (
    ComplaintMediaSerializer,
)

from apps.ai_engine.tasks.complaint_ai_tasks import (
    process_complaint_ai,
)


class ComplaintMediaViewSet(
    viewsets.ModelViewSet
):

    queryset = (
        ComplaintMedia.objects.all()
    )

    serializer_class = (
        ComplaintMediaSerializer
    )

    parser_classes = [
        MultiPartParser,
        FormParser,
    ]

    def perform_create(
        self,
        serializer,
    ):

        media = serializer.save()

        print("NEW MEDIA SAVED:")
        print("MEDIA ID:", media.id)
        print("IMAGE PATH:", media.image.path)

        process_complaint_ai.delay(
            complaint_id=media.complaint.id,
            media_id=media.id,
        )