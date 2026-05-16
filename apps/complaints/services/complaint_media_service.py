from apps.complaints.models import ComplaintMedia


def upload_complaint_media(
    *,
    complaint,
    image,
):

    return ComplaintMedia.objects.create(
        complaint=complaint,
        image=image,
    )