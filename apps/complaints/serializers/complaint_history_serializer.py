from rest_framework import serializers

from apps.complaints.models import ComplaintHistory


class ComplaintHistorySerializer(serializers.ModelSerializer):

    updated_by = serializers.StringRelatedField()

    class Meta:
        model = ComplaintHistory

        fields = [
            "id",
            "old_status",
            "new_status",
            "updated_by",
            "remarks",
            "created_at",
        ]