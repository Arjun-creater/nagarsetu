from rest_framework import serializers

from apps.analytics.models import CivicHotspot


class CivicHotspotSerializer(serializers.ModelSerializer):

    class Meta:
        model = CivicHotspot

        fields = "__all__"