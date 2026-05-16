from rest_framework.response import Response
from rest_framework.views import APIView

from apps.analytics.services.trend_service import (
    get_department_complaint_trends,
)

from apps.analytics.services.trend_service import (
    get_daily_complaint_trends,get_department_daily_trends
)

class DepartmentTrendAPIView(APIView):

    def get(self, request):

        trends = get_department_complaint_trends()

        return Response(trends)
    
class DailyComplaintTrendAPIView(APIView):

    def get(self, request):

        trends = get_daily_complaint_trends()

        return Response(trends)  

class DepartmentDailyTrendAPIView(APIView):

    def get(self, request):

        trends = get_department_daily_trends()

        return Response(trends)      