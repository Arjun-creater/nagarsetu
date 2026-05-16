from apps.complaints.models import (
    ComplaintAssignment,
)
from asgiref.sync import async_to_sync

from channels.layers import (
    get_channel_layer,
)
from apps.notifications.models import (
    Notification,
)

def assign_complaint(
    *,
    complaint,
    department,
    assigned_to,
    assigned_by,
    remarks=None,
):

    assignment = ComplaintAssignment.objects.create(
        complaint=complaint,
        department=department,
        assigned_to=assigned_to,
        assigned_by=assigned_by,
        remarks=f"Complaint assigned to {assigned_to.username}",
    )
    notification = Notification.objects.create(
    recipient=assigned_to,
    message=(
        f"You have been assigned "
        f"complaint #{complaint.id}"
    ),
)
    channel_layer = get_channel_layer()
    async_to_sync(
    channel_layer.group_send
)(
    f"user_{assigned_to.id}",
    {
        "type": "send_notification",
        "message": (
            f"{notification.message}"
            
        ),
    },
)

    complaint.status = "under_review"
    complaint.save()

    return assignment