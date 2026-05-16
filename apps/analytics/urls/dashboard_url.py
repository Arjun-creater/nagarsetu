from django.urls import path
from apps.analytics.views.dashboard_view import ComplaintStatusAnalyticsView
from apps.analytics.views.civic_hotspot_views import CivicHotspotListAPIView
from apps.analytics.views.hotspot_geojson_views import CivicHotspotGeoJSONAPIView
from apps.analytics.views.trend_views import DepartmentTrendAPIView,DailyComplaintTrendAPIView,DepartmentDailyTrendAPIView
urlpatterns = [
path(
    "complaints-by-status/",
    ComplaintStatusAnalyticsView.as_view(),
),
 path(
        "hotspots/",
        CivicHotspotListAPIView.as_view(),
        name="civic-hotspots",
    ),
path(
"hotspots/geojson/",
CivicHotspotGeoJSONAPIView.as_view(),
name="hotspot-geojson",
),
path(
    "trends/departments/",
    DepartmentTrendAPIView.as_view(),
    name="department-trends",
),
path(
    "trends/daily/",
    DailyComplaintTrendAPIView.as_view(),
    name="daily-complaint-trends",
),
path(
    "trends/departments/daily/",
    DepartmentDailyTrendAPIView.as_view(),
    name="department-daily-trends",
),
]