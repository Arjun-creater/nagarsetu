from apps.complaints.models import Complaint


def get_latest_complaint_context(
    user
):

    latest_complaint = (
        Complaint.objects
        .filter(citizen=user)
        .select_related(
            "department"
        )
        .order_by("-created_at")
        .first()
    )

    if not latest_complaint:

        return None

    return f"""
Complaint ID:
{latest_complaint.id}

Title:
{latest_complaint.title}

Department:
{latest_complaint.department}

Status:
{latest_complaint.status}

Address:
{latest_complaint.address}

Created At:
{latest_complaint.created_at}
"""