from rest_framework.response import Response
from rest_framework.views import APIView

from apps.analytics.models import CivicHotspot


class CivicHotspotGeoJSONAPIView(APIView):

    def get(self, request):

        hotspots = CivicHotspot.objects.filter(
            is_active=True
        )

        features = []

        for hotspot in hotspots:

            features.append({
                "type": "Feature",

                "geometry": {
                    "type": "Point",

                    "coordinates": [
                        hotspot.center_longitude,
                        hotspot.center_latitude,
                    ],
                },

                "properties": {
                    "id": hotspot.id,
                    "department": hotspot.department,
                    "complaint_count": hotspot.complaint_count,
                    "severity_score": hotspot.severity_score,
                    "radius_meters": hotspot.radius_meters,
                },
            })

        geojson = {
            "type": "FeatureCollection",
            "features": features,
        }

        return Response(geojson)