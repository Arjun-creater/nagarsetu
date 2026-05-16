from apps.complaints.models import Complaint


def get_user_complaints(*, user):

    return (
        Complaint.objects
        .select_related("citizen")
        .prefetch_related(
            "media",
            "history",
        )
        .order_by("-created_at")
    )

    # queryset = (
    #     Complaint.objects
    #     .select_related(
    #         "citizen",
    #     )
    #     .prefetch_related(
    #         "media",
    #         "history",
    #     )
    #     .order_by("-created_at")
    # )

    # if user.role in ["admin", "officer"]:
    #     return queryset

    # return queryset.filter(
    #     citizen=user
    # )


def get_all_complaints():

    return (
        Complaint.objects
        .select_related(
            "citizen",
        )
        .prefetch_related(
            "media",
            "history",
        )
        .order_by("-created_at")
    )
def get_officer_assigned_complaints(
    *,
    officer,
):

    return (
        Complaint.objects
        .select_related(
            "citizen",
        )
        .prefetch_related(
            "media",
            "history",
            "assignments",
        )
        .filter(
            assignments__assigned_to=officer
        )
        .distinct()
        .order_by("-created_at")
    )