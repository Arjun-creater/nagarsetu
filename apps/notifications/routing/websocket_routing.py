from django.urls import path

from apps.notifications.consumers.notification_consumer import (
    NotificationConsumer,
)


websocket_urlpatterns = [

    path(
        "ws/notifications/$",
        NotificationConsumer.as_asgi(),
    ),
]