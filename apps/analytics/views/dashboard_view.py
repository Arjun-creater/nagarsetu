from rest_framework.views import APIView
from rest_framework.response import Response

from apps.analytics.services.dashboard_service import (
    complaints_by_status,
)


class ComplaintStatusAnalyticsView(APIView):

    def get(self, request):

        data = complaints_by_status()

        return Response(data)