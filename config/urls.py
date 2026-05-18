from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView,
)
from apps.chatbot.views import (
    ChatbotAPIView
)
urlpatterns = [
    path("admin/", admin.site.urls),

    path(
        "api/auth/",
        include("apps.accounts.urls"),
    ),
     path(
        "api/complaints/",
        include("apps.complaints.urls.complaint_urls"),
    ),
    path(
        "api/notifications/",
        include("apps.notifications.urls"),
    ),
    path(
        "api/analytics/",
        include("apps.analytics.urls.dashboard_url"),
    ),
    path(
    "api/ai/",
    include("apps.ai_engine.urls"),

),
    path(
        "api/chatbot/",
        include("apps.chatbot.urls")
    ),
    path(
    "api/schema/",
    SpectacularAPIView.as_view(),
    name="schema",
),

path(
    "api/schema/swagger-ui/",
    SpectacularSwaggerView.as_view(
        url_name="schema"
    ),
    name="swagger-ui",
),

path(
    "api/schema/redoc/",
    SpectacularRedocView.as_view(
        url_name="schema"
    ),
    name="redoc",
),
]
urlpatterns += static(
    settings.MEDIA_URL,
    document_root=settings.MEDIA_ROOT,
)