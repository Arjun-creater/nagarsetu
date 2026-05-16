from django.conf import settings
from django.db import models

from apps.complaints.models.complaint import Complaint


class ComplaintHistory(models.Model):

    complaint = models.ForeignKey(
        Complaint,
        on_delete=models.CASCADE,
        related_name="history",
    )

    old_status = models.CharField(
        max_length=50,
        blank=True,
        null=True,
    )

    new_status = models.CharField(
        max_length=50,
    )

    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
    )

    remarks = models.TextField(
        blank=True,
        null=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    def __str__(self):
        return f"{self.complaint.title} - {self.new_status}"