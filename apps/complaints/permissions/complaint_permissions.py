from rest_framework.permissions import BasePermission


class IsCitizenOwner(BasePermission):

    def has_object_permission(
        self,
        request,
        view,
        obj,
    ):

        return obj.citizen == request.user


class IsAdminOrOfficer(BasePermission):

    def has_permission(
        self,
        request,
        view,
    ):

        return request.user.role in [
            "admin",
            "officer",
        ]