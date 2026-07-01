from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import Application
from .serializers import ApplicationSerializer

class ApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = ApplicationSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        if user.role == 'EMPLOYER':
            # Employers see applications for jobs they posted
            return Application.objects.filter(job__employer=user).order_by('-applied_at')
        elif user.role == 'JOBSEEKER':
            # Job Seekers see their own applications
            return Application.objects.filter(applicant=user).order_by('-applied_at')
        return Application.objects.none()

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        user = request.user
        
        # Enforce role-based update rules
        if user.role == 'JOBSEEKER':
            # Job Seeker cannot change status
            if 'status' in request.data and request.data['status'] != instance.status:
                return Response(
                    {"error": "Job Seekers cannot update application status."}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            # Must own the application
            if instance.applicant != user:
                return Response(
                    {"error": "You do not own this application."}, 
                    status=status.HTTP_403_FORBIDDEN
                )
                
        elif user.role == 'EMPLOYER':
            # Employer can ONLY update status
            # If they pass cover_letter or resume, prevent or ignore
            # Let's ensure the job belongs to this employer
            if instance.job.employer != user:
                return Response(
                    {"error": "You do not own the job posting for this application."}, 
                    status=status.HTTP_403_FORBIDDEN
                )
                
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        # Only the applicant can withdraw/delete the application
        if instance.applicant != request.user:
            return Response(
                {"error": "Only the candidate who applied can withdraw this application."}, 
                status=status.HTTP_403_FORBIDDEN
            )
        return super().destroy(request, *args, **kwargs)
