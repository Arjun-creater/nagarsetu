from rest_framework import serializers

from apps.complaints.models import Complaint


class ComplaintCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Complaint

        fields = [
            "id",
            "title",
            "description",
            "department",
            "address",
            "latitude",
            "longitude",
        ]

    def validate_title(self, value):

        if len(value) < 5:
            raise serializers.ValidationError(
                "Title must be at least 5 characters long."
            )

        return value