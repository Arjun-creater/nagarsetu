from rest_framework import serializers

from apps.complaints.models import (
    ComplaintMedia,
)


class ComplaintMediaSerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = ComplaintMedia

        fields = [
            "id",
            "complaint",
            "image",
            "uploaded_at",
        ]