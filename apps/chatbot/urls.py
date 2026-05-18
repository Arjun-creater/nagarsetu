from django.urls import path

from apps.chatbot.views import (
    ChatbotAPIView
)

urlpatterns = [
    path(
        "chat/",
        ChatbotAPIView.as_view()
    ),
]