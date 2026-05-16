from django.db import models
from django.utils import timezone

from apps.complaints.models import (
    Complaint,
)


class ComplaintSLA(models.Model):

    complaint = models.OneToOneField(
        Complaint,
        on_delete=models.CASCADE,
        related_name="sla",
    )

    deadline = models.DateTimeField()

    is_escalated = models.BooleanField(
        default=False
    )

    escalation_level = models.IntegerField(
        default=0
    )

    escalated_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):

        return (
            f"SLA - Complaint "
            f"{self.complaint.id}"
        )