from apps.departments.models import Department
from apps.complaints.services.officer_assignment_service import auto_assign_officer

def auto_assign_department(*, complaint):

    if not complaint.ai_department:
        return

    department = Department.objects.filter(
        name__iexact=complaint.ai_department
    ).first()

    if not department:
        return

    complaint.department = department
    auto_assign_officer(
    complaint=complaint
)

    complaint.save(
        update_fields=["department"]
    )