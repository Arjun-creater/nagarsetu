from apps.complaints.models import Complaint
from apps.complaints.tasks import (
    send_complaint_notification,
)
from apps.departments.models import Department


CATEGORY_DEPARTMENT_MAP = {
    "water": "Water Department",
    "electricity": "Electricity Department",
    "roads": "Roads Department",
    "garbage": "Sanitation Department",
}


def create_complaint(*, validated_data, citizen):

    print(validated_data)

    department = validated_data.pop(
        "department",
        None
    )

    category = validated_data.get(
        "category"
    )

    if not department and category:

        department_name = (
            CATEGORY_DEPARTMENT_MAP.get(
                category
            )
        )

        if department_name:

            department = (
                Department.objects.filter(
                    name__iexact=department_name
                ).first()
            )

    print("FINAL DEPARTMENT:", department)

    complaint = Complaint.objects.create(
        citizen=citizen,
        department=department,
        **validated_data
    )

    send_complaint_notification.delay(
        complaint.id
    )

    return complaint