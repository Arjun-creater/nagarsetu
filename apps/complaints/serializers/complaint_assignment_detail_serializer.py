from rest_framework import serializers

from apps.complaints.models import ComplaintAssignment


class ComplaintAssignmentDetailSerializer(
    serializers.ModelSerializer
):

    assigned_to = serializers.StringRelatedField()

    assigned_by = serializers.StringRelatedField()

    department = serializers.StringRelatedField()

    class Meta:
        model = ComplaintAssignment

        fields = "__all__"