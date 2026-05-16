from rest_framework.response import Response
from rest_framework.views import APIView

from apps.analytics.models import CivicHotspot
from apps.analytics.serializers.civic_hotspot_serializer import (
    CivicHotspotSerializer,
)


class CivicHotspotListAPIView(APIView):

    def get(self, request):

        hotspots = CivicHotspot.objects.filter(
            is_active=True
        )

        serializer = CivicHotspotSerializer(
            hotspots,
            many=True,
        )

        return Response(serializer.data)