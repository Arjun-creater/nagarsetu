from apps.departments.models import Department


CATEGORY_DEPARTMENT_MAPPING = {

    "water": "Water Department",

    "sanitation": "Sanitation Department",

    "electricity": "Electricity Department",

    "roads": "Roads Department",
}


def get_department_for_category(
    *,
    category,
):

    department_name = (
        CATEGORY_DEPARTMENT_MAPPING.get(
            category
        )
    )

    if not department_name:
        return None

    try:

        return Department.objects.get(
            name=department_name
        )

    except Department.DoesNotExist:

        return None