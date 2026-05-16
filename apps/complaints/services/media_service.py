from apps.complaints.models import (
    ComplaintMedia,
)


def create_complaint_media(
    *,
    complaint,
    image,
):

    return ComplaintMedia.objects.create(
        complaint=complaint,
        image=image,
    )