from celery import shared_task


@shared_task
def send_complaint_notification(
    complaint_id,
):

    print(
        f"Notification sent for complaint {complaint_id}"
    )

    return True
from django.utils import timezone

from apps.complaints.models import (
    ComplaintSLA,
)

from apps.notifications.models import (
    Notification,
)

from apps.accounts.models import (
    User,
)


@shared_task
def check_sla_escalations():

    overdue_slas = (
        ComplaintSLA.objects.filter(
            deadline__lt=timezone.now(),
            is_escalated=False,
        )
    )

    print(
        f"Found "
        f"{overdue_slas.count()} "
        f" overdue complaints"
    )

    for sla in overdue_slas:

        complaint = sla.complaint

        # Skip resolved complaints
        if complaint.status == "Resolved":
            continue

        # Mark escalation
        sla.is_escalated = True

        sla.escalation_level += 1

        sla.escalated_at = (
            timezone.now()
        )

        sla.save(
            update_fields=[
                "is_escalated",
                "escalation_level",
                "escalated_at",
            ]
        )

        # Notify admins
        admins = User.objects.filter(
            role="admin"
        )

        for admin in admins:

            Notification.objects.create(
                user=admin,
                title="Complaint Escalated",
                message=(
                    f"Complaint "
                    f"#{complaint.id} "
                    f"has exceeded SLA deadline."
                ),
            )

        print(
            f"Complaint "
            f"{complaint.id} escalated"
        )