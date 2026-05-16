from django.contrib import admin

from apps.complaints.models import ComplaintAssignment


@admin.register(ComplaintAssignment)
class ComplaintAssignmentAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "complaint",
        "department",
        "assigned_to",
        "assigned_by",
        "assigned_at",
    )

    search_fields = (
        "complaint__title",
        "assigned_to__username",
    )

    list_filter = (
        "department",
        "assigned_at",
    )