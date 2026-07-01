from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from .models import Job, SavedJob
from .serializers import JobSerializer, SavedJobSerializer
from .permissions import IsEmployerOrReadOnly, IsOwnerOrReadOnly

class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.all().order_by('-created_at')
    serializer_class = JobSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, IsEmployerOrReadOnly, IsOwnerOrReadOnly)
    
    filter_backends = (DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter)
    filterset_fields = ('location', 'job_type', 'experience_level', 'category')
    search_fields = ('title', 'company', 'description', 'requirements')
    ordering_fields = ('created_at', 'salary')

    def perform_create(self, serializer):
        # Associate job with the logged-in Employer user
        serializer.save(employer=self.request.user)

    # Specific endpoints to match the exact paths requested (/api/jobs/search, /api/jobs/filter)
    @action(detail=False, methods=['get'])
    def search(self, request):
        return self.list(request)

    @action(detail=False, methods=['get'])
    def filter(self, request):
        return self.list(request)

    # Extra actions to save/unsave a job
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def save_job(self, request, pk=None):
        job = self.get_object()
        if request.user.role != 'JOBSEEKER':
            return Response({"error": "Only Job Seekers can save jobs."}, status=status.HTTP_400_BAD_REQUEST)
        
        saved_job, created = SavedJob.objects.get_or_create(user=request.user, job=job)
        if created:
            return Response({"message": "Job saved successfully."}, status=status.HTTP_201_CREATED)
        return Response({"message": "Job already saved."}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def unsave_job(self, request, pk=None):
        job = self.get_object()
        if request.user.role != 'JOBSEEKER':
            return Response({"error": "Only Job Seekers can unsave jobs."}, status=status.HTTP_400_BAD_REQUEST)
        
        deleted, _ = SavedJob.objects.filter(user=request.user, job=job).delete()
        if deleted:
            return Response({"message": "Job unsaved successfully."}, status=status.HTTP_200_OK)
        return Response({"message": "Job was not saved."}, status=status.HTTP_400_BAD_REQUEST)


class SavedJobViewSet(viewsets.ModelViewSet):
    serializer_class = SavedJobSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        # Only return saved jobs for the logged-in Job Seeker
        return SavedJob.objects.filter(user=self.request.user).order_by('-saved_at')

    def create(self, request, *args, **kwargs):
        if request.user.role != 'JOBSEEKER':
            return Response({"error": "Only Job Seekers can save jobs."}, status=status.HTTP_400_BAD_REQUEST)
        
        job_id = request.data.get('job')
        try:
            job = Job.objects.get(id=job_id)
        except Job.DoesNotExist:
            return Response({"error": "Job does not exist."}, status=status.HTTP_404_NOT_FOUND)
            
        saved_job, created = SavedJob.objects.get_or_create(user=request.user, job=job)
        serializer = self.get_serializer(saved_job)
        if created:
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.data, status=status.HTTP_200_OK)
