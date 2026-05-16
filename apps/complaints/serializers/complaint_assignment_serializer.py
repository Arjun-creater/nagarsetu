from django.contrib.auth import get_user_model
from rest_framework import serializers

from apps.complaints.models import ComplaintAssignment
from apps.departments.models import Department

User = get_user_model()


class   ComplaintAssignmentSerializer(
    serializers.ModelSerializer
):

    class Meta:
        model = ComplaintAssignment

        fields = [
            "id",
            "department",
            "assigned_to",
            "remarks",
        ]

    def validate_assigned_to(self, value):

        if value.role != "officer":
            raise serializers.ValidationError(
                "Assigned user must be an officer."
            )

        return value