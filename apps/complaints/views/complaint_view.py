from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from apps.complaints.models import Complaint,ComplaintHistory,ComplaintAssignment
from apps.complaints.serializers import (
    ComplaintSerializer,
    ComplaintCreateSerializer,ComplaintMediaSerializer,ComplaintAssignmentDetailSerializer
)
from apps.complaints.selectors.complaint_selector import (
    get_user_complaints,
)
from apps.complaints.services.complaint_service import (
    create_complaint,
)
from apps.complaints.serializers import (
    ComplaintStatusSerializer,ComplaintAssignmentSerializer
)
from apps.complaints.services.complaint_media_service import (
    upload_complaint_media,
)
from apps.complaints.services.complaint_assignment_service import assign_complaint
from apps.complaints.serializers import (
    ComplaintMediaUploadSerializer,
)
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import (
    MultiPartParser,
    FormParser,
)
from apps.complaints.permissions import (
    IsCitizenOwner,
    IsAdminOrOfficer,
)
from rest_framework.exceptions import PermissionDenied
from apps.complaints.selectors.complaint_selector import (
    get_officer_assigned_complaints,
)
from django_filters.rest_framework import (
    DjangoFilterBackend,
)
from rest_framework.filters import (
    SearchFilter,
    OrderingFilter,
)
from django.db.models import Count
from apps.complaints.models.complaint_assignment import ComplaintAssignment
from apps.complaints.services.complaint_status_service import update_complaint_status
from apps.complaints.serializers.complaint_history_serializer import (
    ComplaintHistorySerializer,
)
from rest_framework.permissions import AllowAny

class ComplaintViewSet(viewsets.ModelViewSet):

    permission_classes = [AllowAny]
    filter_backends = [
    DjangoFilterBackend,
    SearchFilter,
    OrderingFilter,
]
    filterset_fields = [
    "status",
    "category",
    "priority",
]
    search_fields = [
    "title",
    "description",
]
    ordering_fields = [
    "created_at",
    "updated_at",
]

    queryset = Complaint.objects.all().order_by("-id")
 

    def get_queryset(self):

        return (
            Complaint.objects
            .all()
            .order_by("-created_at")
        )

    def get_serializer_class(self):

        if self.action == "create":
            return ComplaintCreateSerializer

        return ComplaintSerializer
    # def get_object(self):

    #     obj = super().get_object()

    #     user = self.request.user

    #     if user.role in ["admin", "officer"]:
    #         return obj

    #     if obj.citizen == user:
    #         return obj

    #     raise PermissionDenied(
    #         "You do not have permission to access this complaint."
    def get_object(self):

        complaint = self.queryset.get(
            id=self.kwargs["pk"]
        )

        return complaint
        
    def update(self, request, *args, **kwargs):

        complaint = self.get_object()

        if request.user.role != "admin" and complaint.citizen != request.user:
            raise PermissionDenied(
                "You cannot edit this complaint."
            )

        return super().update(
            request,
            *args,
            **kwargs,
        )
    def destroy(self, request, *args, **kwargs):

        complaint = self.get_object()

        if request.user.role != "admin" and complaint.citizen != request.user:
            raise PermissionDenied(
                "You cannot delete this complaint."
            )

        return super().destroy(
            request,
            *args,
            **kwargs,
        )

    def perform_create(self, serializer):

        create_complaint(
            validated_data=serializer.validated_data,
            citizen=self.request.user,
        )

    @action(
    detail=True,
    methods=["POST"],
    url_path="change-status",
)
    def change_status(self, request, pk=None):


        complaint = self.get_object()
        if request.user.role not in ["admin","officer",]:
            raise PermissionDenied("Only officers/admins can change complaint status.")

        serializer = ComplaintStatusSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        old_status = complaint.status

        complaint.status = serializer.validated_data["status"]
        complaint.save()

        ComplaintHistory.objects.create(
            complaint=complaint,
            old_status=old_status,
            new_status=serializer.validated_data["status"],
            updated_by=request.user,
            remarks=serializer.validated_data.get("remarks"),
        )

        return Response(
            ComplaintSerializer(complaint).data,
            status=status.HTTP_200_OK,
        )
    @action(
    detail=True,
    methods=["POST"],
    url_path="upload-media",parser_classes=[MultiPartParser, FormParser],
)
    def upload_media(self, request, pk=None):

        complaint = self.get_object()

        serializer = ComplaintMediaUploadSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        media = upload_complaint_media(
            complaint=complaint,
            image=serializer.validated_data["image"],
        )

        return Response(
            ComplaintMediaSerializer(media).data,
            status=status.HTTP_201_CREATED,
        )
    @action(
    detail=True,
    methods=["POST"],
    url_path="assign",
)
    def assign(self, request, pk=None):

        if request.user.role != "admin":
            raise PermissionDenied(
                "Only admins can assign complaints."
            )

        complaint = self.get_object()

        serializer = ComplaintAssignmentSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        assignment = assign_complaint(
    complaint=complaint,
    department=serializer.validated_data[
        "department"
    ],
    assigned_to=serializer.validated_data[
        "assigned_to"
    ],
    assigned_by=request.user,
    remarks=serializer.validated_data.get(
        "remarks"
    ),
)

        return Response(
            ComplaintAssignmentDetailSerializer(
                assignment
            ).data,
            status=status.HTTP_201_CREATED,
        )
    
    @action(
    detail=False,
    methods=["GET"],
    url_path="my-assignments",
)
    def my_assignments(self, request):

        if request.user.role != "officer":
            raise PermissionDenied(
                "Only officers can access assignments."
            )

        complaints = get_officer_assigned_complaints(
            officer=request.user
        )

        serializer = ComplaintSerializer(
            complaints,
            many=True,
        )

        return Response(serializer.data)
    
    @action(
    detail=False,
    methods=["GET"],
    url_path="dashboard-summary",
)
    def dashboard_summary(self, request):

        queryset = Complaint.objects.all().order_by("-id")

        data = {
            "total_complaints": queryset.count(),

            "open_complaints": queryset.filter(
                status="open"
            ).count(),

            "in_progress_complaints": queryset.filter(
                status="in_progress"
            ).count(),

            "resolved_complaints": queryset.filter(
                status="resolved"
            ).count(),
        }

        return Response(data)
    
    @action(
    detail=False,
    methods=["GET"],
    url_path="category-analytics",
)
    def category_analytics(self, request):

        if request.user.role == "citizen":
            raise PermissionDenied(
                "Only admins and officers  can access analytics."
            )

        data = (
            Complaint.objects
            .values("category")
            .annotate(
                total=Count("id")
            )
            .order_by("-total")
        )

        return Response(data)
    
    @action(
    detail=False,
    methods=["GET"],
    url_path="officer-workload",
)
    def officer_workload(self, request):

        if request.user.role == "citizen":
            raise PermissionDenied(
                "Only admins and officers can access workload."
            )

        data = (
            ComplaintAssignment.objects
            .values(
                "assigned_to__username"
            )
            .annotate(
                total_assigned=Count("id")
            )
            .order_by("-total_assigned")
        )

        return Response(data)
    
    @action(
    detail=True,
    methods=["patch"],
)
    def start_progress(self, request, pk=None):

        complaint = self.get_object()

        old_status = complaint.status

        complaint.status = (
            Complaint.ComplaintStatus.IN_PROGRESS
        )

        complaint.save(
            update_fields=["status"]
        )

        update_complaint_status(
            complaint=complaint,
            old_status=old_status,
            new_status=complaint.status,
            updated_by=request.user,
            remarks="Work started",
        )

        return Response(
            {
                "message": "Complaint marked as in progress"
            }
        )
    @action(
    detail=True,
    methods=["patch"],
)
    def resolve(self, request, pk=None):

        complaint = self.get_object()

        old_status = complaint.status

        complaint.status = (
            Complaint.ComplaintStatus.RESOLVED
        )

        complaint.save(
            update_fields=["status"]
        )

        update_complaint_status(
            complaint=complaint,
            old_status=old_status,
            new_status=complaint.status,
            updated_by=request.user,
            remarks="Complaint resolved",
        )

        return Response(
            {
                "message": "Complaint resolved"
            }
        )
    
    @action(
    detail=True,
    methods=["patch"],
)
    def close(self, request, pk=None):

        complaint = self.get_object()

        old_status = complaint.status

        complaint.status = (
            Complaint.ComplaintStatus.CLOSED
        )

        complaint.save(
            update_fields=["status"]
        )

        create_complaint_status_history(
            complaint=complaint,
            old_status=old_status,
            new_status=complaint.status,
            updated_by=request.user,
            remarks="Complaint closed",
        )

        return Response(
            {
                "message": "Complaint closed"
            }
        )
    @action(
    detail=True,
    methods=["get"],
)
    def timeline(self, request, pk=None):

        complaint = self.get_object()

        history = complaint.history.all()

        serializer = ComplaintHistorySerializer(
            history,
            many=True,
        )

        return Response(serializer.data)
    
    @action(
    detail=False,
    methods=["get"],
    url_path="hotspot-summary",
)
    def hotspot_summary(self, request):


        complaints =Complaint.objects.all()

        high_risk_zones = complaints.values("address").annotate( total=Count("id")).filter(total__gte=2).count()

        active_complaints =complaints.exclude(status="resolved").count()

        total_complaints = complaints.count()

        resolved_complaints =complaints.filter(status="resolved").count()

        resolution_rate = 0

        if total_complaints > 0:

            resolution_rate = round(
                (
                    resolved_complaints
                    / total_complaints
                ) * 100
            )

        return Response({
            "high_risk_zones":
                high_risk_zones,
            "active_complaints":
                active_complaints,
            "resolution_rate":
                resolution_rate,
        })
    @action(
    detail=False,
    methods=["get"],
    url_path="hotspot-areas",
)
    def hotspot_areas(self, request):

        hotspots = (
            Complaint.objects
            .exclude(address__isnull=True)
            .exclude(address="")
            .values("address")
            .annotate(
                total=Count("id")
            )
            .order_by("-total")[:5]
        )

        return Response(hotspots)
    
    @action(
    detail=False,
    methods=["get"],
    url_path="my-complaints",
)
    def my_complaints(self, request):

        complaints = (
            Complaint.objects
            .filter(citizen=request.user)
            .order_by("-created_at")
        )

        serializer = (
            ComplaintSerializer(
                complaints,
                many=True,
            )
        )

        return Response(serializer.data)