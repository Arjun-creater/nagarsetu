import numpy as np

from math import radians, sin, cos, sqrt, atan2
from datetime import timedelta

from django.utils import timezone

from sklearn.cluster import DBSCAN

from apps.complaints.models import Complaint
from apps.analytics.models import CivicHotspot


EARTH_RADIUS_KM = 6371.0088


def run_geo_clustering():

    stale_time = timezone.now() - timedelta(days=7)

    CivicHotspot.objects.filter(
        updated_at__lt=stale_time,
        is_active=True,
    ).update(
        is_active=False,
        resolved_at=timezone.now(),
    )

    last_7_days = timezone.now() - timedelta(days=7)

    complaints = Complaint.objects.filter(
        latitude__isnull=False,
        longitude__isnull=False,
        status__in=["open", "in_progress"],
        created_at__gte=last_7_days,
    )

    print(f"Processing {complaints.count()} complaints")

    if not complaints.exists():
        return

    department_groups = {}

    for complaint in complaints:

        department = (
            complaint.final_ai_department
            or "unknown"
        )

        department_groups.setdefault(
            department,
            []
        ).append(complaint)

    for (
        department,
        department_complaints,
    ) in department_groups.items():

        coordinates = np.array([
            [
                float(complaint.latitude),
                float(complaint.longitude),
            ]
            for complaint in department_complaints
        ])

        radians_coordinates = np.radians(
            coordinates
        )

        clustering = DBSCAN(
            eps=0.5 / EARTH_RADIUS_KM,
            min_samples=3,
            algorithm="ball_tree",
            metric="haversine",
        ).fit(radians_coordinates)

        labels = clustering.labels_

        create_hotspots(
            department=department,
            complaints=department_complaints,
            labels=labels,
        )


def create_hotspots(
    *,
    department,
    complaints,
    labels,
):

    unique_labels = set(labels)

    for label in unique_labels:

        if label == -1:
            continue

        cluster_complaints = []

        for (
            index,
            cluster_label,
        ) in enumerate(labels):

            if cluster_label == label:

                cluster_complaints.append(
                    complaints[index]
                )

        if not cluster_complaints:
            continue

        average_latitude = sum(
            float(complaint.latitude)
            for complaint in cluster_complaints
        ) / len(cluster_complaints)

        average_longitude = sum(
            float(complaint.longitude)
            for complaint in cluster_complaints
        ) / len(cluster_complaints)

        complaint_count = len(
            cluster_complaints
        )

        severity_score = (
            calculate_severity_score(
                cluster_complaints
            )
        )

        existing_hotspot = (
            find_existing_hotspot(
                department=department,
                latitude=average_latitude,
                longitude=average_longitude,
            )
        )

        if existing_hotspot:

            previous_count = (
                existing_hotspot.complaint_count
            )

            growth_rate = 0

            if previous_count > 0:

                growth_rate = (
                    (
                        complaint_count
                        - previous_count
                    )
                    / previous_count
                ) * 100

            if not existing_hotspot.is_active:

                existing_hotspot.is_active = True

                existing_hotspot.resolved_at = None

                existing_hotspot.times_reactivated += 1

            existing_hotspot.last_complaint_count = (
                previous_count
            )

            existing_hotspot.complaint_count = (
                complaint_count
            )

            existing_hotspot.growth_rate = (
                growth_rate
            )

            existing_hotspot.severity_score = (
                severity_score
            )

            existing_hotspot.center_latitude = (
                average_latitude
            )

            existing_hotspot.center_longitude = (
                average_longitude
            )

            existing_hotspot.days_active = (
                timezone.now().date()
                - existing_hotspot.first_detected_at.date()
            ).days

            existing_hotspot.save()

            print(
                f"Updated hotspot: {department}"
            )

        else:

            CivicHotspot.objects.create(
                department=department,
                center_latitude=average_latitude,
                center_longitude=average_longitude,
                complaint_count=complaint_count,
                severity_score=severity_score,
                radius_meters=500,
            )

            print(
                f"Created new hotspot: {department}"
            )


def calculate_severity_score(
    complaints,
):

    priority_weights = {
        "high": 3,
        "medium": 2,
        "low": 1,
    }

    total_score = 0

    for complaint in complaints:

        priority = (
            complaint.priority.lower()
            if complaint.priority
            else "low"
        )

        total_score += (
            priority_weights.get(
                priority,
                1,
            )
        )

    return (
        total_score
        / len(complaints)
    )


def calculate_distance_km(
    lat1,
    lon1,
    lat2,
    lon2,
):

    earth_radius = 6371

    dlat = radians(
        lat2 - lat1
    )

    dlon = radians(
        lon2 - lon1
    )

    a = (
        sin(dlat / 2) ** 2
        + cos(radians(lat1))
        * cos(radians(lat2))
        * sin(dlon / 2) ** 2
    )

    c = 2 * atan2(
        sqrt(a),
        sqrt(1 - a),
    )

    return (
        earth_radius * c
    )


def find_existing_hotspot(
    *,
    department,
    latitude,
    longitude,
):

    hotspots = CivicHotspot.objects.filter(
        department=department,
    )

    for hotspot in hotspots:

        distance = calculate_distance_km(
            latitude,
            longitude,
            hotspot.center_latitude,
            hotspot.center_longitude,
        )

        if distance <= 0.5:
            return hotspot

    return None