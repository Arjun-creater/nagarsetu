from django.db import models

from apps.complaints.models.complaint import Complaint


class ComplaintMedia(models.Model):

    complaint = models.ForeignKey(
        Complaint,
        on_delete=models.CASCADE,
        related_name="media",
    )

    image = models.ImageField(
        upload_to="complaints/",
    )

    uploaded_at = models.DateTimeField(
        auto_now_add=True,
    )

    def __str__(self):
        return self.complaint.title