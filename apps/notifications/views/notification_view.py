from rest_framework import viewsets
from rest_framework.permissions import (
    IsAuthenticated,
)

from apps.notifications.models import (
    Notification,
)

from apps.notifications.serializers import (
    NotificationSerializer,
)
from rest_framework.decorators import action
from rest_framework.response import Response

class NotificationViewSet(
    viewsets.ReadOnlyModelViewSet
):

    serializer_class = (
        NotificationSerializer
    )

    permission_classes = [
        IsAuthenticated
    ]

    def get_queryset(self):

        return Notification.objects.filter(
            recipient=self.request.user
        )
    
    @action(
    detail=True,
    methods=["POST"],
    url_path="mark-read",
)
    def mark_read(self, request, pk=None):

        notification = self.get_object()

        notification.is_read = True

        notification.save()

        return Response({
            "message": "Notification marked as read."
        })