from django.db.models import Count

from apps.complaints.models import Complaint


def complaints_by_status():

    return (
        Complaint.objects
        .values("status")
        .annotate(total=Count("id"))
    )