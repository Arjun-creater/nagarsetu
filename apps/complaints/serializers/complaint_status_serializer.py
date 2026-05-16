from rest_framework import serializers

from apps.complaints.models import Complaint


class ComplaintStatusSerializer(serializers.Serializer):

    status = serializers.ChoiceField(
        choices=Complaint.ComplaintStatus.choices
    )

    remarks = serializers.CharField(
        required=False,
        allow_blank=True,
    )