from django.conf import settings
from django.db import models
from apps.departments.models import Department
from apps.accounts.models import User


class Complaint(models.Model):

    class ComplaintStatus(models.TextChoices):
        OPEN = "open", "Open"
        UNDER_REVIEW = "under_review", "Under Review"
        IN_PROGRESS = "in_progress", "In Progress"
        RESOLVED = "resolved", "Resolved"
        CLOSED = "closed", "Closed"

    class ComplaintPriority(models.TextChoices):
        LOW = "low", "Low"
        MEDIUM = "medium", "Medium"
        HIGH = "high", "High"
        CRITICAL = "critical", "Critical"

    class ComplaintCategory(models.TextChoices):
        WATER = "water", "Water"
        ELECTRICITY = "electricity", "Electricity"
        ROADS = "roads", "Roads"
        GARBAGE = "garbage", "Garbage"
        SEWAGE = "sewage", "Sewage"
  
    title = models.CharField(max_length=255)
    department = models.ForeignKey(
    Department,
    on_delete=models.SET_NULL,
    null=True,
    blank=True,
    related_name="complaints",
)
    assigned_officer = models.ForeignKey(
    User,
    on_delete=models.SET_NULL,
    null=True,
    blank=True,
    related_name="officer_assigned_complaints",
)

    description = models.TextField()

    category = models.CharField(
        max_length=50,
        choices=ComplaintCategory.choices,
    )

    status = models.CharField(
        max_length=50,
        choices=ComplaintStatus.choices,
        default=ComplaintStatus.OPEN,
    )

    priority = models.CharField(
        max_length=50,
        choices=ComplaintPriority.choices,
        default=ComplaintPriority.MEDIUM,
    )

    citizen = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="complaints",
    )

    address = models.TextField()

    latitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        null=True,
        blank=True,
    )

    longitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        null=True,
        blank=True,
    )
    area_name = models.CharField(
    max_length=255,
    null=True,
    blank=True,
)

    ward = models.CharField(
        max_length=255,
        null=True,
        blank=True,
    )
    ai_department = models.CharField(
    max_length=100,
    null=True,
    blank=True,
)

    ai_priority = models.CharField(
        max_length=50,
        null=True,
        blank=True,
    )

    ai_confidence_score = models.FloatField(
        null=True,
        blank=True,
    )

    ai_summary = models.TextField(
        null=True,
        blank=True,
    )

    is_ai_processed = models.BooleanField(
        default=False,
    )
    is_duplicate = models.BooleanField(
    default=False
)

    duplicate_of = models.ForeignKey(
        "self",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    text_ai_category = models.CharField( max_length=50,
        null=True,
        blank=True,)
    text_ai_confidence = models.FloatField(default=0)

    image_ai_department = models.CharField( max_length=50,
        null=True,
        blank=True,)
    image_ai_confidence = models.FloatField(default=0)

    final_ai_department = models.CharField( max_length=50,
        null=True,
        blank=True,)
    final_ai_confidence = models.FloatField(default=0)

    ai_reasoning = models.TextField(
        blank=True,
        null=True,
    )

    requires_manual_review = models.BooleanField(
        default=False
    )
    embedding = models.JSONField(
    null=True,
    blank=True,
)
        


    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title