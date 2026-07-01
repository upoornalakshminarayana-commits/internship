from rest_framework import permissions

class IsEmployerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow employers to post new jobs.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and request.user.role == 'EMPLOYER'

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of a job to edit or delete it.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.employer == request.user
