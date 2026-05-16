from apps.complaints.models import Complaint

from apps.complaints.tasks import (
    send_complaint_notification,
)

# from apps.ai_usecase.tasks.complaint_ai_tasks import (
#     process_complaint_ai_task,
# )
# from apps.ai_usecase.services.duplicate_detection_service import (
#     check_duplicate_complaint,
# )

def create_complaint(*, validated_data, citizen):

    complaint = Complaint.objects.create(
        citizen=citizen,
        **validated_data
    )

    send_complaint_notification.delay(
        complaint.id
    )

    # process_complaint_ai_task.delay(
    #     complaint.id
    # )
#     check_duplicate_complaint(
#     complaint=complaint
# )

    return complaint