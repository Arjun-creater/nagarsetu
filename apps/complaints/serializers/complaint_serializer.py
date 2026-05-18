from rest_framework import serializers

from apps.complaints.models import Complaint
from apps.complaints.serializers.complaint_media_serializer import (
    ComplaintMediaSerializer,
)
from apps.complaints.serializers.complaint_history_serializer import (
    ComplaintHistorySerializer,
)

class ComplaintSerializer(serializers.ModelSerializer):

    citizen = serializers.StringRelatedField()
    department = serializers.StringRelatedField()

#     media = ComplaintMediaSerializer(
#         many=True,
#         read_only=True,
#     )
#     history = ComplaintHistorySerializer(
#     many=True,
#     read_only=True,
# )
    def validate_latitude(self, value):

        if value < -90 or value > 90:
            raise serializers.ValidationError("Invalid latitude")
        return value


    def validate_longitude(self, value):
        if value < -180 or value > 180:
            raise serializers.ValidationError("Invalid longitude")
        return value

    class Meta:
        model = Complaint

        fields = [
    "id",
    "title",
    "status",
    "priority",
    # "history",
    # 'media',
    "address",
    "created_at",
    "citizen",
    "department",
]