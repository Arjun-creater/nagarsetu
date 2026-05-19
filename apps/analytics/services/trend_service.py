from django.db.models import Count

from apps.complaints.models import Complaint


def get_department_complaint_trends():

    trends = (
        Complaint.objects
        .values("department__name")
        .annotate(
            total_complaints=Count("id")
        )
        .order_by("-total_complaints")
    )

    return trends

from django.db.models import Count
from django.db.models.functions import TruncDate

from apps.complaints.models import Complaint


def get_daily_complaint_trends():

    trends = (
        Complaint.objects
        .annotate(day=TruncDate("created_at"))
        .values("day")
        .annotate(
            total_complaints=Count("id")
        )
        .order_by("day")
    )

    return trends

def get_department_daily_trends():

    trends = (
        Complaint.objects
        .annotate(day=TruncDate("created_at"))
        .values(
            "day",
            "department__name",
        )
        .annotate(
            total_complaints=Count("id")
        )
        .order_by(
            "day",
            "department",
        )
    )

    return trends