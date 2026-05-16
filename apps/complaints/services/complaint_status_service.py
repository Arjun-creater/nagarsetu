from apps.complaints.models import (
    Complaint,
    ComplaintHistory,
)


def update_complaint_status(
    *,
    complaint,
    new_status,
    updated_by,
    remarks=None,
):

    old_status = complaint.status

    complaint.status = new_status
    complaint.save()

    ComplaintHistory.objects.create(
        complaint=complaint,
        old_status=old_status,
        new_status=new_status,
        updated_by=updated_by,
        remarks=remarks,
    )

    return complaint