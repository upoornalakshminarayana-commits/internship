from rest_framework import serializers
from .models import Job, SavedJob
from accounts.serializers import UserSerializer

class JobSerializer(serializers.ModelSerializer):
    employer = UserSerializer(read_only=True)
    is_saved = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = (
            'id', 'employer', 'title', 'company', 'description', 
            'requirements', 'salary', 'location', 'job_type', 
            'experience_level', 'category', 'created_at', 'is_saved'
        )
        read_only_fields = ('id', 'created_at')

    def get_is_saved(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return SavedJob.objects.filter(user=request.user, job=obj).exists()
        return False

class SavedJobSerializer(serializers.ModelSerializer):
    job_details = JobSerializer(source='job', read_only=True)

    class Meta:
        model = SavedJob
        fields = ('id', 'job', 'job_details', 'saved_at')
        read_only_fields = ('id', 'saved_at')
