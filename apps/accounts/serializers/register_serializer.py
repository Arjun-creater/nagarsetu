from django.contrib.auth import get_user_model
from rest_framework import serializers
from apps.accounts.services.auth_service import create_user
User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):

    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "password",
            "phone_number",
            "address",
        ]

    def create(self, validated_data):

        return create_user(validated_data)