from django.conf import settings
from django.db import models

from apps.complaints.models import Complaint
from apps.departments.models import Department


class ComplaintAssignment(models.Model):

    complaint = models.ForeignKey(
        Complaint,
        on_delete=models.CASCADE,
        related_name="assignments",
    )

    department = models.ForeignKey(
        Department,
        on_delete=models.CASCADE,
    )

    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="assigned_complaints",
    )

    assigned_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="created_assignments",
    )

    remarks = models.TextField(
        blank=True,
        null=True,
    )

    assigned_at = models.DateTimeField(
        auto_now_add=True,
    )

    def __str__(self):

        return (
            f"{self.complaint.title} -> "
            f"{self.assigned_to.username}"
        )