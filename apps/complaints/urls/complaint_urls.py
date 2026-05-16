from rest_framework.routers import DefaultRouter

from apps.complaints.views import (
    ComplaintViewSet,
)

from apps.complaints.views.complaint_media_view import (
    ComplaintMediaViewSet,
)

router = DefaultRouter()

router.register(
    "complaints",
    ComplaintViewSet,
    basename="complaints",
)

router.register(
    "complaint-media",
    ComplaintMediaViewSet,
    basename="complaint-media",
)

urlpatterns = router.urls