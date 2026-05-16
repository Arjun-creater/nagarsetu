from django.db import models


class CivicHotspot(models.Model):

    department = models.CharField(max_length=255)

    center_latitude = models.FloatField()

    center_longitude = models.FloatField()

    complaint_count = models.IntegerField(default=0)

    severity_score = models.FloatField(default=0)

    radius_meters = models.FloatField(default=0)

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)
    first_detected_at = models.DateTimeField(
    auto_now_add=True
)

    last_detected_at = models.DateTimeField(
        auto_now=True
    )

    days_active = models.IntegerField(default=0)
    last_complaint_count = models.IntegerField(default=0)

    growth_rate = models.FloatField(default=0)

    times_reactivated = models.IntegerField(default=0)

    resolved_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    def __str__(self):
        return f"{self.department} hotspot"