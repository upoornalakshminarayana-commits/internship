from rest_framework import views, status, permissions
from rest_framework.response import Response
from django.db.models import Count

from jobs.models import Job, SavedJob
from applications.models import Application
from jobs.serializers import JobSerializer
from applications.serializers import ApplicationSerializer

class DashboardStatsView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        user = request.user
        
        if user.role == 'EMPLOYER':
            # 1. Total Jobs Posted
            total_jobs = Job.objects.filter(employer=user).count()
            
            # 2. Total Applications Received
            total_apps = Application.objects.filter(job__employer=user).count()
            
            # 3. Status Breakdown
            status_counts = Application.objects.filter(job__employer=user) \
                .values('status') \
                .annotate(count=Count('id'))
            
            status_breakdown = {
                'PENDING': 0,
                'REVIEWING': 0,
                'ACCEPTED': 0,
                'REJECTED': 0
            }
            for entry in status_counts:
                status_breakdown[entry['status']] = entry['count']

            # 4. Recent Jobs Posted (last 5)
            recent_jobs = Job.objects.filter(employer=user).order_by('-created_at')[:5]
            recent_jobs_serialized = JobSerializer(recent_jobs, many=True, context={'request': request}).data

            # 5. Recent Applications (last 5)
            recent_apps = Application.objects.filter(job__employer=user).order_by('-applied_at')[:5]
            recent_apps_serialized = ApplicationSerializer(recent_apps, many=True, context={'request': request}).data

            return Response({
                'role': 'EMPLOYER',
                'stats': {
                    'total_jobs_posted': total_jobs,
                    'total_applications_received': total_apps,
                    'applications_by_status': status_breakdown
                },
                'recent_jobs': recent_jobs_serialized,
                'recent_applications': recent_apps_serialized
            })

        elif user.role == 'JOBSEEKER':
            # 1. Total Applications Submitted
            total_applied = Application.objects.filter(applicant=user).count()

            # 2. Total Saved Jobs
            total_saved = SavedJob.objects.filter(user=user).count()

            # 3. Applied Jobs Status Breakdown
            status_counts = Application.objects.filter(applicant=user) \
                .values('status') \
                .annotate(count=Count('id'))
                
            status_breakdown = {
                'PENDING': 0,
                'REVIEWING': 0,
                'ACCEPTED': 0,
                'REJECTED': 0
            }
            for entry in status_counts:
                status_breakdown[entry['status']] = entry['count']

            # 4. Recent Applications (last 5)
            recent_apps = Application.objects.filter(applicant=user).order_by('-applied_at')[:5]
            recent_apps_serialized = ApplicationSerializer(recent_apps, many=True, context={'request': request}).data

            # 5. Recent Saved Jobs (last 5)
            recent_saved = SavedJob.objects.filter(user=user).order_by('-saved_at')[:5]
            # Map saved jobs to their details
            saved_jobs = [s.job for s in recent_saved]
            saved_jobs_serialized = JobSerializer(saved_jobs, many=True, context={'request': request}).data

            return Response({
                'role': 'JOBSEEKER',
                'stats': {
                    'total_applied': total_applied,
                    'total_saved': total_saved,
                    'applied_jobs_by_status': status_breakdown
                },
                'recent_applications': recent_apps_serialized,
                'saved_jobs': saved_jobs_serialized
            })

        return Response({"error": "Invalid user role"}, status=status.HTTP_400_BAD_REQUEST)
