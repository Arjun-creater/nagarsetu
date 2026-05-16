from django.urls import path

from apps.ai_engine.views.ai_assistant_view import (
    AIComplaintAssistantAPIView,
)

urlpatterns = [

    path(
        "analyze-image/",
        AIComplaintAssistantAPIView.as_view(),
    ),
]