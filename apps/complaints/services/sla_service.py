from datetime import timedelta

from django.utils import timezone

from apps.complaints.models import (
    ComplaintSLA,
)

SLA_RULES = {
    "high": timedelta(minutes=1),
    "medium": timedelta(days=3),
    "low": timedelta(days=7),
}


def calculate_sla_deadline(
    priority,
):

    print("RAW PRIORITY:")
    print(priority)

    if not priority:
        return None

    priority = str(priority).lower().strip()

    print("NORMALIZED PRIORITY:")
    print(priority)

    duration = SLA_RULES.get(
        priority
    )

    print("DURATION:")
    print(duration)

    if not duration:
        return None

    return timezone.now() + duration


def create_complaint_sla(
    complaint,
):

    deadline = calculate_sla_deadline(
        complaint.priority
    )

    print("DEADLINE:")
    print(deadline)

    if not deadline:
        return None

    sla, created = (
    ComplaintSLA.objects.get_or_create(
        complaint=complaint,
        defaults={
            "deadline": deadline,
        }
    )
)

    sla.deadline = deadline

    sla.save(
        update_fields=[
            "deadline",
        ]
    )

    return sla