from celery import shared_task

from apps.analytics.services.geo_clustering_service import (
    run_geo_clustering,
)


@shared_task
def run_hotspot_detection_task():

    run_geo_clustering()