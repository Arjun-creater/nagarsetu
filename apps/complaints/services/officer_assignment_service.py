from apps.accounts.models import User
from apps.complaints.services.complaint_status_service import update_complaint_status

def auto_assign_officer(*, complaint):

    if not complaint.department:
        return

    officer = (
        User.objects.filter(
            role="OFFICER",
            department=complaint.department,
            is_active=True,
        )
        .first()
    )

    if not officer:
        return
    old_status = complaint.status
    complaint.assigned_officer = officer
    complaint.status='in_progress'

    complaint.save(
        update_fields=["assigned_officer","status"]
    )
    update_complaint_status(
    complaint=complaint,
    old_status=old_status,
    new_status=complaint.status,
    updated_by=officer,
    remarks="Complaint assigned automatically",
)