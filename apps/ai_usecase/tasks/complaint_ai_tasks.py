from celery import shared_task

from apps.complaints.models import Complaint

from apps.ai_usecase.services.complaint_ai_service import (
    process_complaint_ai,
)


@shared_task
def process_complaint_ai_task(complaint_id):

    complaint = Complaint.objects.get(
        id=complaint_id
    )

    process_complaint_ai(
        complaint=complaint
    )