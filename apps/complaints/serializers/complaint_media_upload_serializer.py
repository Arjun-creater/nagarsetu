from rest_framework import serializers

from apps.complaints.models import ComplaintMedia


class ComplaintMediaUploadSerializer(serializers.ModelSerializer):

    class Meta:
        model = ComplaintMedia

        fields = [
            "id",
            "image",
        ]

    def validate_image(self, value):

        max_size = 5 * 1024 * 1024

        if value.size > max_size:
            raise serializers.ValidationError(
                "Image size cannot exceed 5MB."
            )

        return value